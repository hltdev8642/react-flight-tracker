import { useEffect, useRef } from "react";
import { CameraControls } from "@react-three/drei";
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
  useEffect(() => {
    if (cameraControlsRef.current) {
      void cameraControlsRef.current.dolly(500 - EARTH_RADIUS * 2, true).then();
    }
  }, [cameraControlsRef]);

  useEffect(
    () => {
      setIsAnimationRunning(true);
      if (cameraControlsRef.current) {
        switch (cameraTarget) {
          case "moon": {
            const cartesian = convertToCartesian(
              toDegrees(moonPosition.geoLatitude),
              toDegrees(moonPosition.geoLongitude),
              moonPosition.r * EARTH_RADIUS,
            );
            void cameraControlsRef.current
              .setTarget(cartesian.x, cartesian.y, cartesian.z, true)
              .then(() => {
                void cameraControlsRef.current
                  .dolly(
                    cameraControlsRef.current.distance - MOON_RADIUS * 2,
                    true,
                  )
                  .then(() => {
                    setIsAnimationRunning(false);
                  });
              });
            break;
          }
          case "earth": {
            void cameraControlsRef.current.setTarget(0, 0, 0, true).then(() => {
              void cameraControlsRef.current
                .dolly(
                  cameraControlsRef.current.distance - EARTH_RADIUS * 2,
                  true,
                )
                .then(() => {
                  setIsAnimationRunning(false);
                });
            });

            break;
          }
          case "sun": {
            const cartesian = convertToCartesian(
              toDegrees(sunPosition.geoLatitude),
              toDegrees(sunPosition.geoLongitude),
              sunPosition.r * ASTRONOMICAL_UNIT * reductionFactor,
            );
            void cameraControlsRef.current
              .setTarget(cartesian.x, cartesian.y, cartesian.z, true)
              .then(() => {
                void cameraControlsRef.current
                  .dolly(
                    cameraControlsRef.current.distance - SUN_RADIUS * 3,
                    true,
                  )
                  .then(() => {
                    setIsAnimationRunning(false);
                  });
              });

            break;
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cameraTarget],
  );

  useEffect(
    () => {
      if (cameraControlsRef.current) {
        switch (cameraTarget) {
          case "moon": {
            const cartesian = convertToCartesian(
              toDegrees(moonPosition.geoLatitude),
              toDegrees(moonPosition.geoLongitude),
              moonPosition.r * EARTH_RADIUS,
            );
            void cameraControlsRef.current.setTarget(
              cartesian.x,
              cartesian.y,
              cartesian.z,
              true,
            );
            break;
          }
          case "earth": {
            void cameraControlsRef.current.setTarget(0, 0, 0, true);

            break;
          }
          case "sun": {
            const cartesian = convertToCartesian(
              toDegrees(sunPosition.geoLatitude),
              toDegrees(sunPosition.geoLongitude),
              sunPosition.r * ASTRONOMICAL_UNIT * reductionFactor,
            );
            void cameraControlsRef.current.setTarget(
              cartesian.x,
              cartesian.y,
              cartesian.z,
              true,
            );

            break;
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      moonPosition.dec,
      moonPosition.r,
      moonPosition.ra,
      sunPosition.dec,
      sunPosition.r,
      sunPosition.ra,
    ],
  );
  return (
    <CameraControls
      minDistance={EARTH_RADIUS + 0.2}
      ref={cameraControlsRef}
      distance={500}
      truckSpeed={0}
      makeDefault={true}
    />
  );
}
