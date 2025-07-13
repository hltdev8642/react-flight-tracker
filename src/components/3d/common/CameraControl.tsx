import { useEffect, useRef } from "react";
import { CameraControls } from "@react-three/drei";
import CameraControlsImpl from "camera-controls";
const { ACTION } = CameraControlsImpl;
import {
  ASTRONOMICAL_UNIT,
  EARTH_RADIUS,
  MOON_RADIUS,
  reductionFactor,
  SUN_RADIUS,
} from "../../../constants.ts";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  cameraTargetState,
  isAnimationRunningState,
  moonPositionState,
  sunPositionState,
} from "../../../atoms.ts";
import { toDegrees } from "../../../astronomy-utils.tsx";
import { convertToCartesian } from "../../../utils.ts";

export default function CameraControl() {
  const cameraControlsRef = useRef<CameraControls>(null!);
  const [cameraTarget] = useRecoilState(cameraTargetState);
  const moonPosition = useRecoilValue(moonPositionState);
  const sunPosition = useRecoilValue(sunPositionState);
  const [, setIsAnimationRunning] = useRecoilState(isAnimationRunningState);

  return (
    <CameraControls
      ref={cameraControlsRef}
      makeDefault={true}
      minDistance={EARTH_RADIUS/1.25} // allow even closer zoom
      maxDistance={500}
      distance={500}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      azimuthRotateSpeed={.12} // slightly faster rotation
      polarRotateSpeed={.12}
      dollySpeed={0.2} // smooth zoom
      truckSpeed={2.0} // enable smooth vertical and horizontal panning
      verticalDragToForward={false} // drag up/down to pan vertically
      smoothTime={0.15} // smooth camera movement
      dampingFactor={0.15} // smooth stop
      // Enable all mouse buttons: left=rotate, middle=zoom, right=pan
      mouseButtons={{
        left: ACTION.ROTATE,
        middle: ACTION.TRUCK, // middle mouse pans
        right: ACTION.TRUCK,
        wheel: ACTION.DOLLY,
      }}
      touches={{
        one: ACTION.TOUCH_ROTATE,
        two: ACTION.TOUCH_DOLLY,
        three: ACTION.TOUCH_TRUCK,
      }}
    />
  );
}
