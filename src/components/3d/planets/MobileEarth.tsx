import { EARTH_RADIUS } from "../../../constants.ts";
import { Sphere } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { Texture, TextureLoader } from "three";
import EarthColorMap from "../../../assets/earth/compressed/8081_earthmap10k-min.jpg";
import EarthNightMap from "../../../assets/earth/compressed/5_night_16k-min.jpg";

export default function MobileEarth() {
  // load texture
  const [colorMap, nightMap] = useLoader(
    TextureLoader,
    [EarthColorMap, EarthNightMap],
    undefined,
  ) as Texture[];

  return (
    <>
      <Sphere
        args={[EARTH_RADIUS, 20, 20]}
        onPointerOver={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <meshStandardMaterial
          map={colorMap}
          emissiveMap={nightMap}
          emissiveIntensity={5}
          emissive={0xaaaaaa}
        />
      </Sphere>
    </>
  );
}
