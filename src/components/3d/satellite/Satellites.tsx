import { useRef, useState } from "react";
import { Group, InstancedMesh, TextureLoader } from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { handleSatellitePositionUpdate, useBuffers } from "./updateUtils.tsx";
import { miscellaneousOptionsState } from "../../../atoms.ts";
import { useRecoilValue } from "recoil";
import SatelliteTexture from "../../../assets/satellites/satelliteTexture.png";
import SatelliteDetails, { ToolTipUpdate } from "./SatelliteDetails.tsx";

export default function Satellites() {
  const satelliteTexture = useLoader(TextureLoader, SatelliteTexture);
  const instancedMeshRef = useRef<InstancedMesh>(null!);
  const { camera } = useThree();
  const [index, setIndex] = useState(0);
  const buffers = useBuffers(index);

  const altitudeFactor = useRecoilValue(
    miscellaneousOptionsState,
  ).altitudeFactor;
  // set up raycaster
  const { raycaster } = useThree();
  raycaster.params.Points.threshold = 0.1;
  raycaster.params.Line.threshold = 0.1;

  // Satellite Details Display
  const toolTipGroupRef = useRef<Group>(null!);
  const [currentSatellite, setCurrentSatellite] = useState(-1);
  const satelliteHtmlRef = useRef<HTMLDivElement>(null!);
  const satelliteSelectionMethod = useRecoilValue(
    miscellaneousOptionsState,
  ).satelliteSelectionMethod;
  useFrame(() => {
    const satPositions = handleSatellitePositionUpdate(
      index,
      buffers,
      setIndex,
      camera,
      instancedMeshRef,
      altitudeFactor,
    );
    ToolTipUpdate(
      toolTipGroupRef,
      currentSatellite,
      satPositions,
      satelliteHtmlRef,
      buffers,
      index,
      altitudeFactor,
    );
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
      <SatelliteDetails
        toolTipGroupRef={toolTipGroupRef}
        currentSatellite={currentSatellite}
        calculatedData={buffers}
        index={index}
        toolTipInnerSimpleDescriptionRef={satelliteHtmlRef}
        fullDetails={true}
      />
      {
        <instancedMesh
          ref={instancedMeshRef}
          args={[undefined, undefined, instanceCount]}
          onPointerOver={(e) => {
            if (satelliteSelectionMethod === "hover") {
              setCurrentSatellite(e.instanceId as number);
            }
          }}
          onPointerMissed={() => {
            setCurrentSatellite(-1);
          }}
          onClick={(e) => {
            setCurrentSatellite(e.instanceId as number);
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
