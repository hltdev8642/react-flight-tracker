import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { InstancedMesh, Object3D } from "three";
import { convertToCartesian, interpolateGeoCoordinates } from "../../utils.ts";
import { useRecoilValue } from "recoil";
import { miscellaneousOptionsState } from "../../atoms.ts";
import { EARTH_RADIUS, reductionFactor } from "../../constants.ts";
import { useFrame, useThree } from "@react-three/fiber";
import SatelliteDataUrl from "../../assets/satellites/gp.json?url";
import {
  eciToGeodetic,
  EciVec3,
  gstime,
  propagate,
  twoline2satrec,
} from "satellite.js";

const temp = new Object3D();
const DELTA = 30 * 60 * 1000;

function updateSatellitePositions(
  SatelliteData: { TLE_LINE1: string; TLE_LINE2: string }[],
  altitudeFactor: number,
  date: Date,
) {
  const satellitePositions: {
    latitude: number;
    longitude: number;
    altitude: number;
  }[] = [];
  SatelliteData?.forEach((gp: { TLE_LINE1: string; TLE_LINE2: string }) => {
    const satrec = twoline2satrec(gp.TLE_LINE1, gp.TLE_LINE2);
    //  Or you can use a JavaScript Date
    const positionAndVelocity = propagate(satrec, date);
    const positionEci = positionAndVelocity.position;
    if (positionEci) {
      const gmst = gstime(new Date());
      const positionGd = eciToGeodetic(positionEci as EciVec3<number>, gmst);
      satellitePositions.push({
        latitude: (positionGd.latitude * 180) / Math.PI,
        longitude: (positionGd.longitude * 180) / Math.PI,
        altitude:
          EARTH_RADIUS +
          positionGd.height * 1000 * reductionFactor * altitudeFactor,
      });
    }
  });

  return satellitePositions;
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
  const [satellitePositions, setSatellitePositions] = useState<
    {
      latitude: number;
      longitude: number;
      altitude: number;
    }[]
  >([]);
  const [satellitePositions30, setSatellitePositions30] = useState<
    {
      latitude: number;
      longitude: number;
      altitude: number;
    }[]
  >([]);

  const [lastCalculatedDate, setLastCalculatedDate] = useState<Date>(
    new Date(),
  );

  // update every 10 seconds
  useEffect(() => {
    const update = () => {
      if (SatelliteData) {
        const date = new Date();
        setSatellitePositions(
          updateSatellitePositions(SatelliteData, altitudeFactor, date),
        );
        setSatellitePositions30(
          updateSatellitePositions(
            SatelliteData,
            altitudeFactor,
            new Date(date.getTime() + DELTA),
          ),
        );
        setLastCalculatedDate(date);
      }
    };
    if (!satellitePositions || satellitePositions.length == 0) {
      update();
    } else {
      const interval = setInterval(update, DELTA);
      return () => {
        clearInterval(interval);
      };
    }
  }, [SatelliteData, altitudeFactor, satellitePositions, scale, camera]);

  useFrame(() => {
    if (instancedMeshRef.current) {
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    satellitePositions.forEach((geodetic, i) => {
      const currentDate = new Date();
      const ratio =
        (currentDate.getTime() - lastCalculatedDate.getTime()) / DELTA;

      geodetic = interpolateGeoCoordinates(
        geodetic,
        satellitePositions30[i],
        ratio,
      );

      const cartesian = convertToCartesian(
        geodetic.latitude,
        geodetic.longitude,
        geodetic.altitude,
      );
      temp.position.set(cartesian.x, cartesian.y, cartesian.z);
      temp.scale.set(scale / 5, scale / 5, scale / 5);
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
          args={[undefined, undefined, satellitePositions.length]}
        >
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial transparent={true} opacity={0.5} />
        </instancedMesh>
      }
    </>
  );
}
