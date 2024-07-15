import { useRef, useState } from "react";
import { Group, InstancedMesh } from "three";
import { useFrame, useThree } from "@react-three/fiber";

import { DateTime } from "luxon";
import { satelliteApi } from "../../../utils.ts";
import { Html } from "@react-three/drei";
import { useQuery } from "@tanstack/react-query";
import { handleSatellitePositionUpdate, useBuffers } from "./updateUtils.tsx";

export default function Satellites() {
  const instancedMeshRef = useRef<InstancedMesh>(null!);
  const { camera } = useThree();
  const [index, setIndex] = useState(0);
  const buffers = useBuffers(index);
  const groupRef = useRef<Group>(null!);
  const [currentSatellite, setCurrentSatellite] = useState(-1);
  const satelliteHtmlRef = useRef<HTMLDivElement>(null!);
  const { data: satelliteMap } = useQuery({
    queryKey: ["satelliteMap"],
    queryFn: () =>
      satelliteApi.satelliteServiceGetMinimalSatellites(DateTime.now().toISO()),
    refetchInterval: 10000,
    refetchOnWindowFocus: false,
  });

  // set up raycaster
  const { raycaster } = useThree();
  raycaster.params.Points.threshold = 0.1;

  useFrame(() => {
    const satPositions = handleSatellitePositionUpdate(
      index,
      buffers,
      setIndex,
      camera,
      instancedMeshRef,
    );
    if (groupRef.current && currentSatellite !== -1) {
      groupRef.current.position.set(
        satPositions[currentSatellite].x,
        satPositions[currentSatellite].y,
        satPositions[currentSatellite].z,
      );
    }
    if (satelliteHtmlRef.current && buffers[index].satellitePositions) {
      if (currentSatellite !== -1) {
        satelliteHtmlRef.current.innerHTML = `Alt: ${(buffers[index].satellitePositions[currentSatellite].altitude * 1000).toFixed(4)}<br>Lat: ${buffers[index].satellitePositions[currentSatellite].latitude.toFixed(4)}<br>Lon: ${buffers[index].satellitePositions[currentSatellite].longitude.toFixed(4)}`;
      } else {
        satelliteHtmlRef.current.innerHTML = "No satellite selected";
      }
    }
  });

  let instanceCount = 0;
  if (buffers.length > 0 && buffers[0].satellitePositions) {
    instanceCount = buffers[0].satellitePositions.length;
  }

  return (
    <>
      <group ref={groupRef}>
        {currentSatellite !== -1 &&
          satelliteMap &&
          satelliteMap.data.satellites && (
            <Html>
              <svg
                height="42"
                width="42"
                transform="translate(-16 -16)"
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx="16"
                  cy="16"
                  r="16"
                  stroke="white"
                  strokeWidth="2"
                  fill="rgba(0,0,0,0)"
                />
              </svg>
              <div className="annotationDescription">
                <div className="annotationTitle">
                  {satelliteMap.data.satellites[currentSatellite].objectName} (
                  {satelliteMap.data.satellites[currentSatellite].noradCatId})
                </div>
                <div className="annotationContent" ref={satelliteHtmlRef}></div>
              </div>
            </Html>
          )}
      </group>
      {
        <instancedMesh
          ref={instancedMeshRef}
          args={[undefined, undefined, instanceCount]}
          onPointerOver={(e) => {
            setCurrentSatellite(e.instanceId as number);
          }}
        >
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshBasicMaterial
            transparent={true}
            opacity={1}
            type={"MeshBasicMaterial"}
            color={"#ffffff"}
            wireframe={false}
          />
        </instancedMesh>
      }
    </>
  );
}
