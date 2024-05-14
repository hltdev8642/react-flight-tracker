import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { InstancedMesh, Object3D } from "three";
import { convertToCartesian } from "../../utils.ts";
import { useRecoilValue } from "recoil";
import { miscellaneousOptionsState } from "../../atoms.ts";
import { EARTH_RADIUS, reductionFactor } from "../../constants.ts";
import { useThree } from "@react-three/fiber";
import SatelliteDataUrl from "../../assets/satellites/gp.json?url";
import {
  eciToGeodetic,
  EciVec3,
  gstime,
  propagate,
  twoline2satrec,
} from "satellite.js";

const temp = new Object3D();

function updateSatellitePositions(
  SatelliteData: { TLE_LINE1: string; TLE_LINE2: string }[],
  altitudeFactor: number,
) {
  const satellitePositions: {
    x: number;
    y: number;
    z: number;
  }[] = [];
  SatelliteData?.forEach((gp: { TLE_LINE1: string; TLE_LINE2: string }) => {
    const satrec = twoline2satrec(gp.TLE_LINE1, gp.TLE_LINE2);
    //  Or you can use a JavaScript Date
    const positionAndVelocity = propagate(satrec, new Date());
    const positionEci = positionAndVelocity.position;
    if (positionEci) {
      const gmst = gstime(new Date());
      const positionGd = eciToGeodetic(positionEci as EciVec3<number>, gmst);
      const cartesian = convertToCartesian(
        (positionGd.latitude * 180) / Math.PI,
        (positionGd.longitude * 180) / Math.PI,
        EARTH_RADIUS +
          positionGd.height * 1000 * reductionFactor * altitudeFactor,
      );
      satellitePositions.push(cartesian);
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
      x: number;
      y: number;
      z: number;
    }[]
  >([]);
  // update every 10 seconds
  useEffect(() => {
    const update = () => {
      if (SatelliteData && instancedMeshRef.current) {
        console.log("Satellites updated");
        setSatellitePositions(
          updateSatellitePositions(SatelliteData, altitudeFactor),
        );
        satellitePositions.forEach((cartesian, i) => {
          temp.position.set(cartesian.x, cartesian.y, cartesian.z);
          temp.scale.set(scale / 5, scale / 5, scale / 5);
          // Set rotation to look at the camera
          temp.quaternion.copy(camera.quaternion);
          temp.updateMatrix();

          instancedMeshRef.current.setMatrixAt(i, temp.matrix);
        });
        // Update the instance
        instancedMeshRef.current.instanceMatrix.needsUpdate = true;
      }
    };
    if (!SatelliteData || SatelliteData.length == 0) {
      update();
    } else {
      const interval = setInterval(update, 10000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [
    SatelliteData,
    altitudeFactor,
    satellitePositions,
    scale,
    camera,
    instancedMeshRef.current,
  ]);

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
