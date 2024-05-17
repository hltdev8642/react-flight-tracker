import { useLoader } from "@react-three/fiber";
import { Texture, TextureLoader } from "three";
import EarthColorMap from "../../assets/earth/10k/8081_earthmap10k.jpg";
import EarthSpecularMap from "../../assets/earth/10k/8081_earthspec10k.jpg";
import EarthBumpMap from "../../assets/earth/10k/8081_earthbump10k.jpg";
import EarthNightMap from "../../assets/earth/10k/5_night_16k.jpg";
import { Sphere } from "@react-three/drei";
import { EARTH_RADIUS } from "../../constants.ts";
import { toast } from "react-toastify";
export default function Earth() {
  // load texture
  const [colorMap, specularMap, bumpMap, nightMap] = useLoader(
    TextureLoader,
    [EarthColorMap, EarthSpecularMap, EarthBumpMap, EarthNightMap],
    (loader) => {
      toast.loading(`Downloading High Resolution Earth Textures...`, {
        toastId: "loadingEarth",
        autoClose: false,
      });
      loader.manager.onProgress = (_url, itemsLoaded, itemsTotal) => {
        if (itemsLoaded === itemsTotal) {
          toast.dismiss("loadingEarth");
        }
      };
    },
  ) as Texture[];

  return (
    <>
      <Sphere args={[EARTH_RADIUS, 50, 50]}>
        <meshPhongMaterial specularMap={specularMap} />
        <meshStandardMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.01}
          emissiveMap={nightMap}
          emissiveIntensity={3}
          emissive={0xaaaaaa}
        />
      </Sphere>
    </>
  );
}
