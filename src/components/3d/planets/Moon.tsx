import { EARTH_RADIUS, MOON_RADIUS } from "../../../constants.ts";
import { convertToCartesian } from "../../../utils.ts";
import { calculateMoonPosition, toDegrees } from "../../../astronomy-utils.tsx";
import { useEffect } from "react";
import { Sphere } from "@react-three/drei";
import { Texture, TextureLoader, Vector3 } from "three";
import { useRecoilState } from "recoil";
import { moonPositionState } from "../../../atoms.ts";
import { useLoader } from "@react-three/fiber";
import MoonColorMap from "../../../assets/moon/compressed/colormap.jpg";
import MoonDisplacementMap from "../../../assets/moon/compressed/displacementmap.jpg";

export default function Moon() {
  const [colorMap, displacementMap] = useLoader(TextureLoader, [
    MoonColorMap,
    MoonDisplacementMap,
  ]) as Texture[];
  const [pos, setPos] = useRecoilState(moonPositionState);
  const cartesian = convertToCartesian(
    toDegrees(pos.geoLatitude),
    toDegrees(pos.geoLongitude),
    pos.r * EARTH_RADIUS,
  );
  // update every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPos(calculateMoonPosition(new Date(Date.now())));
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [setPos]);

  return (
    <Sphere
      args={[MOON_RADIUS, 30, 30]}
      position={new Vector3(cartesian.x, cartesian.y, cartesian.z)}
    >
      <meshStandardMaterial
        flatShading={false}
        map={colorMap}
        bumpMap={displacementMap}
        bumpScale={0.0025}
        dithering={true}
        roughness={1}
        metalness={0}
      />
    </Sphere>
  );
}
