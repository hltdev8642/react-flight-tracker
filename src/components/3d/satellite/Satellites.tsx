import { useRef, useState } from "react";
import { Group, InstancedMesh, TextureLoader } from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";

import { Html } from "@react-three/drei";
import { handleSatellitePositionUpdate, useBuffers } from "./updateUtils.tsx";
import { miscellaneousOptionsState } from "../../../atoms.ts";
import { useRecoilValue } from "recoil";
import SatelliteTexture from "../../../assets/satellites/satelliteTexture.png";

export default function Satellites() {
  const satelliteTexture = useLoader(TextureLoader, SatelliteTexture);
  const instancedMeshRef = useRef<InstancedMesh>(null!);
  const { camera } = useThree();
  const [index, setIndex] = useState(0);
  const buffers = useBuffers(index);
  const groupRef = useRef<Group>(null!);
  const [currentSatellite, setCurrentSatellite] = useState(-1);
  const satelliteHtmlRef = useRef<HTMLDivElement>(null!);
  const altitudeFactor = useRecoilValue(
    miscellaneousOptionsState,
  ).altitudeFactor;
  // set up raycaster
  const { raycaster } = useThree();
  raycaster.params.Points.threshold = 0.1;
  raycaster.params.Line.threshold = 0.1;

  useFrame(() => {
    const satPositions = handleSatellitePositionUpdate(
      index,
      buffers,
      setIndex,
      camera,
      instancedMeshRef,
      altitudeFactor,
    );
    if (
      groupRef.current &&
      currentSatellite !== -1 &&
      satPositions[currentSatellite]
    ) {
      groupRef.current.position.set(
        satPositions[currentSatellite].x,
        satPositions[currentSatellite].y,
        satPositions[currentSatellite].z,
      );
    }
    if (satelliteHtmlRef.current && buffers[index].satellitePositions) {
      if (currentSatellite !== -1) {
        satelliteHtmlRef.current.innerHTML = `Alt: ${buffers[index].satellitePositions[currentSatellite].altitude.toFixed(0)} Km<br>Velocity: ${buffers[index].satellitePositions[currentSatellite].velocity.toFixed(2)} Km/s`;
      } else {
        satelliteHtmlRef.current.innerHTML = "No satellite selected";
      }
    }
  });

  let instanceCount = 0;
  if (
    buffers.length > 0 &&
    buffers[index] &&
    buffers[index].satellitePositions
  ) {
    instanceCount = buffers[index].satellitePositions.length;
  }

  return (
    <>
      <group ref={groupRef}>
        {currentSatellite !== -1 &&
          buffers[index] &&
          buffers[index].satellitePositions && (
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
                  {buffers[index].satellitePositions[currentSatellite].name} (
                  {buffers[index].satellitePositions[currentSatellite].id})
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
          onPointerMissed={() => {
            setCurrentSatellite(-1);
          }}
        >
          <planeGeometry args={[1, 1, 1, 1]} />
          <meshPhysicalMaterial
            map={satelliteTexture}
            emissive={"white"}
            emissiveMap={satelliteTexture}
            emissiveIntensity={0.3}
            alphaHash={true}
          />
        </instancedMesh>
      }
    </>
  );
}
