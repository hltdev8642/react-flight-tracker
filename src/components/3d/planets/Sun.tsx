import {
  ASTRONOMICAL_UNIT,
  reductionFactor,
  SUN_RADIUS,
} from "../../../constants.ts";
import { Vector3 } from "three";
import { convertToCartesian } from "../../../utils.ts";
import { calculateSunPosition, toDegrees } from "../../../astronomy-utils.tsx";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { sunPositionState } from "../../../atoms.ts";

export default function Sun() {
  const [pos, setPos] = useRecoilState(sunPositionState);

  const cartesian = convertToCartesian(
    toDegrees(pos.geoLatitude),
    toDegrees(pos.geoLongitude),
    pos.r * ASTRONOMICAL_UNIT * reductionFactor,
  );
  // update every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPos(calculateSunPosition(new Date(Date.now())));
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [setPos]);

  return (
    <pointLight
      visible={true}
      position={new Vector3(cartesian.x, cartesian.y, cartesian.z)}
      castShadow={true}
      intensity={0.8}
    >
      <mesh>
        <sphereGeometry args={[SUN_RADIUS, 10, 10]} />
        <meshStandardMaterial
          flatShading={false}
          emissive={"yellow"}
          emissiveIntensity={5}
        />
      </mesh>
    </pointLight>
  );
}
