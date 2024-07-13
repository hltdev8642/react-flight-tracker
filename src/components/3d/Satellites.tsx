import { useEffect, useRef, useState } from "react";
import { InstancedMesh, Object3D } from "three";
import { useRecoilValue } from "recoil";
import { miscellaneousOptionsState } from "../../atoms.ts";
import { EARTH_RADIUS } from "../../constants.ts";
import { useFrame, useThree } from "@react-three/fiber";

import { DateTime, Duration } from "luxon";
import {
  convertToCartesian,
  interpolateGeoCoordinates,
  satelliteApi,
} from "../../utils.ts";
import { toDegrees } from "../../astronomy-utils.tsx";

const temp = new Object3D();
const DELTA = Duration.fromObject({ seconds: 5 });

type GeoCoordinate = { latitude: number; longitude: number; altitude: number };

type CalculatedData = {
  date: DateTime;
  satellitePositions: GeoCoordinate[];
};

async function updateSatellitePositions(
  altitudeFactor: number,
  date: DateTime,
) {
  const res = await satelliteApi.satelliteServiceGetSatellitePositions(
    date.toISO() as string,
    [],
  );
  return {
    date: date,
    satellitePositions: res.data.satellites?.map((satellite) => {
      return {
        latitude: toDegrees(satellite.lat as number),
        longitude: toDegrees(satellite.lon as number),
        altitude:
          (satellite.altitude as number) * altitudeFactor * 0.0001 +
          EARTH_RADIUS,
      };
    }),
  } as CalculatedData;
}

function nextIndex(index: number, length: number) {
  return (index + 1) % length;
}

function useBuffers(index: number) {
  const [buffers, setBuffers] = useState<CalculatedData[]>([]);
  const altitudeFactor = useRecoilValue(
    miscellaneousOptionsState,
  ).altitudeFactor;
  useEffect(() => {
    function resetSatelliteData() {
      const now = DateTime.now();
      const bufferStart = updateSatellitePositions(altitudeFactor, now);
      const bufferEnd = updateSatellitePositions(
        altitudeFactor,
        now.plus(DELTA),
      );
      const bufferNext = updateSatellitePositions(
        altitudeFactor,
        now.plus(DELTA).plus(DELTA),
      );
      Promise.all([bufferStart, bufferEnd, bufferNext]).then((buffers) => {
        setBuffers(buffers);
      });
    }

    if (buffers.length == 0) {
      resetSatelliteData();
      return;
    }
    const currentEndIndex = nextIndex(index, buffers.length);
    const currentEndDate = buffers[currentEndIndex].date;
    const nextEndIndex = nextIndex(currentEndIndex, buffers.length);
    const nextEndDate = currentEndDate.plus(DELTA);

    if (nextEndDate < DateTime.now()) {
      setBuffers([]);
      return;
    }

    if (buffers[nextEndIndex].date.toMillis() == nextEndDate.toMillis()) {
      return;
    }
    updateSatellitePositions(altitudeFactor, nextEndDate).then((buffer) => {
      setBuffers((prev) => {
        prev[nextEndIndex] = buffer;
        return prev;
      });
    });
  }, [index, buffers]);

  return buffers;
}

export default function Satellites() {
  const instancedMeshRef = useRef<InstancedMesh>(null!);
  const { camera } = useThree();
  const [index, setIndex] = useState(0);
  const buffers = useBuffers(index);

  useFrame(() => {
    const date = DateTime.now();
    let calculatedIndex = index;
    if (!buffers[index] || !buffers[nextIndex(index, buffers.length)]) {
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
      const ratio =
        (date.toMillis() - startBuffer.date.toMillis()) / DELTA.toMillis();
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
      let scale = Math.max(geodetic.altitude / 400, 0.001);

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

  let instanceCount = 0;
  if (buffers.length > 0 && buffers[0].satellitePositions) {
    instanceCount = buffers[0].satellitePositions.length;
  }

  return (
    <>
      {
        <instancedMesh
          ref={instancedMeshRef}
          args={[undefined, undefined, instanceCount]}
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
