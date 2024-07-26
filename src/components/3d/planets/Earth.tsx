import { useLoader } from "@react-three/fiber";
import { Texture, TextureLoader } from "three";
import EarthColorMap from "../../../assets/earth/10k/8081_earthmap10k.jpg";
import EarthSpecularMap from "../../../assets/earth/10k/8081_earthspec10k.jpg";
import EarthBumpMap from "../../../assets/earth/10k/8081_earthbump10k.jpg";
import EarthNightMap from "../../../assets/earth/10k/5_night_16k.jpg";
import { Sphere } from "@react-three/drei";
import { EARTH_RADIUS } from "../../../constants.ts";
import { toast } from "react-toastify";
import EARTH_FRAGMENT from "../shader/earth_fragment.glsl?raw";
import EARTH_VERTEX from "../shader/earth_vertex.glsl?raw";

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
      <Sphere
        args={[EARTH_RADIUS, 100, 100]}
        onPointerOver={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <meshPhysicalMaterial
          onBeforeCompile={(shader) => {
            shader.fragmentShader = EARTH_FRAGMENT;
            shader.vertexShader = EARTH_VERTEX;
          }}
          clipShadows={true}
          flatShading={false}
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.03}
          roughness={1}
          dithering={true}
          emissiveMap={nightMap}
          emissiveIntensity={3}
          emissive={"#ffffff"}
          specularColor={"#ffffff"}
          specularIntensityMap={specularMap}
        />
      </Sphere>
    </>
  );
}
