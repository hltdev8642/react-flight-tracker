import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { InstancedMesh, Object3D } from "three";
import { useRecoilValue } from "recoil";
import { miscellaneousOptionsState } from "../../atoms.ts";
import { reductionFactor } from "../../constants.ts";
import { useFrame, useThree } from "@react-three/fiber";
import SatelliteDataUrl from "../../assets/satellites/gp.json?url";
import {
  eciToGeodetic,
  EciVec3,
  gstime,
  propagate,
  twoline2satrec,
} from "satellite.js";

import { DateTime, Duration } from "luxon";
import { convertToCartesian, interpolateGeoCoordinates } from "../../utils.ts";

const temp = new Object3D();
const DELTA = Duration.fromObject({ milliseconds: 10000 });

type GeoCoordinate = { latitude: number; longitude: number; altitude: number };

type CalculatedData = {
  date: DateTime;
  satellitePositions: GeoCoordinate[];
};

function updateSatellitePositions(
  SatelliteData: { TLE_LINE1: string; TLE_LINE2: string }[],
  altitudeFactor: number,
  date: DateTime,
  buffer: CalculatedData,
) {
  SatelliteData?.map((gp: { TLE_LINE1: string; TLE_LINE2: string }, i) => {
    const satrec = twoline2satrec(gp.TLE_LINE1, gp.TLE_LINE2);
    //  Or you can use a JavaScript Date
    const positionAndVelocity = propagate(satrec, new Date(date.toMillis()));
    const positionEci = positionAndVelocity.position;
    if (positionEci) {
      const gmst = gstime(new Date(date.toMillis()));
      const positionGd = eciToGeodetic(positionEci as EciVec3<number>, gmst);
      buffer.satellitePositions[i] = {
        latitude: (positionGd.latitude * 180) / Math.PI,
        longitude: (positionGd.longitude * 180) / Math.PI,
        altitude: positionGd.height * 1000 * reductionFactor * altitudeFactor,
      };
    }
  });

  buffer.date = date;
  return buffer;
}

function nextIndex(index: number, length: number) {
  return (index + 1) % length;
}

export default function Satellites() {
  const { data: SatelliteData } = useQuery<
    { TLE_LINE1: string; TLE_LINE2: string }[]
  >({
    queryKey: ["satellites"],
    queryFn: () => fetch(SatelliteDataUrl).then((res) => res.json()),
  });
  const instancedMeshRef = useRef<InstancedMesh>(null!);
  const scale = 140000 * reductionFactor;
  const altitudeFactor = useRecoilValue(
    miscellaneousOptionsState,
  ).altitudeFactor;
  const { camera } = useThree();
  const [buffers, setBuffers] = useState<CalculatedData[]>([
    { date: DateTime.now(), satellitePositions: [] },
    { date: DateTime.now(), satellitePositions: [] },
    { date: DateTime.now(), satellitePositions: [] },
  ]);

  const [index, setIndex] = useState(-1);
  // update every 10 seconds
  useEffect(() => {
    const update = () => {
      if (SatelliteData) {
        const currentEndIndex = nextIndex(index, buffers.length);
        const currentEndDate = buffers[currentEndIndex].date;
        const nextEndIndex = nextIndex(currentEndIndex, buffers.length);
        const nextEndDate = currentEndDate.plus(DELTA);

        if (buffers[nextEndIndex].date.toMillis() == nextEndDate.toMillis()) {
          return;
        }

        setBuffers((prev) => {
          updateSatellitePositions(
            SatelliteData,
            altitudeFactor,
            nextEndDate,
            prev[nextEndIndex],
          );
          return prev;
        });
      }
    };
    if (index == -1) {
      if (SatelliteData) {
        const date = DateTime.now();

        setIndex(0);
        setBuffers((prev) => {
          updateSatellitePositions(
            SatelliteData,
            altitudeFactor,
            date,
            prev[0],
          );
          updateSatellitePositions(
            SatelliteData,
            altitudeFactor,
            date.plus(DELTA),
            prev[1],
          );

          return prev;
        });
      }
    } else {
      const interval = setInterval(update, DELTA.toMillis() / 10);
      return () => {
        clearInterval(interval);
      };
    }
  }, [SatelliteData, altitudeFactor, scale, camera, index, buffers]);

  useFrame(() => {
    const date = DateTime.now();
    let calculatedIndex = index;
    if (!buffers[index]) {
      return;
    }
    if (
      date > buffers[nextIndex(index, buffers.length)].date &&
      buffers[index].date.second !=
        buffers[nextIndex(index, buffers.length)].date.second
    ) {
      setIndex(nextIndex(index, buffers.length));

      calculatedIndex = nextIndex(index, buffers.length);
    }
    const startBuffer = buffers[calculatedIndex];
    const endBuffer = buffers[nextIndex(calculatedIndex, buffers.length)];

    startBuffer.satellitePositions.forEach((geodetic, i) => {
      let ratio;

      ratio =
        (date.toMillis() - startBuffer.date.toMillis()) /
        (endBuffer.date.toMillis() - startBuffer.date.toMillis());
      geodetic = interpolateGeoCoordinates(
        geodetic,
        endBuffer.satellitePositions[i],
        ratio,
      );

      // const cartesian = interpolateCartesian(cartesian1, cartesian2, ratio);
      let cartesian = convertToCartesian(
        geodetic.latitude,
        geodetic.longitude,
        geodetic.altitude,
      );
      let scale = Math.max(geodetic.altitude / 200, 0.01);

      if (
        isNaN(geodetic.latitude) ||
        isNaN(endBuffer.satellitePositions[i].latitude) ||
        geodetic.altitude > 2000
      ) {
        cartesian = {
          x: 0,
          y: 0,
          z: 0,
        };
        scale = 0;
      }
      temp.position.set(cartesian.x, cartesian.y, cartesian.z);
      temp.scale.set(scale, scale, scale);
      // Set rotation to look at the camera
      temp.quaternion.copy(camera.quaternion);
      temp.updateMatrix();

      instancedMeshRef.current.setMatrixAt(i, temp.matrix);
    });
    // Update the instance
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <>
      {
        <instancedMesh
          ref={instancedMeshRef}
          args={[undefined, undefined, buffers[0].satellitePositions.length]}
        >
          <sphereGeometry args={[0.5, 6, 6]} />
          <meshBasicMaterial
            transparent={true}
            opacity={0.5}
            type={"MeshBasicMaterial"}
            color={"#ffffff"}
            wireframe={false}
          />
        </instancedMesh>
      }
    </>
  );
}
