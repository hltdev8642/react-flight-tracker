import {useLoader} from "@react-three/fiber";
import {Texture, TextureLoader} from "three";
import EarthColorMap from "../../assets/earthmap/8081_earthmap10k.jpg";
import EarthSpecularMap from "../../assets/earthmap/8081_earthspec10k.jpg";
import EarthBumpMap from "../../assets/earthmap/8081_earthbump10k.jpg";
import EarthNightMap from "../../assets/earthmap/5_night_16k.jpg";
import {Sphere, useProgress} from "@react-three/drei";
import {EARTH_RADIUS} from "../../constants.ts";
import {toast} from "react-toastify";
import {useEffect} from "react";

export default function Earth() {
    const {active, progress} = useProgress()
    if (active && progress !== 100 && !toast.isActive('loadingEarth')) {
        toast.loading(`Downloading High Resolution Earth Textures...`, {
            toastId: 'loadingEarth',
            progress: progress,
            autoClose: false,
        })
    }
    // load texture
    const [colorMap, specularMap, bumpMap, nightMap] = useLoader(TextureLoader, [
            EarthColorMap,
            EarthSpecularMap,
            EarthBumpMap,
            EarthNightMap
        ]
    ) as Texture[]


    useEffect(() => {
            if (!active && progress === 100) {
                toast.dismiss('loadingEarth')
            }
        }
        , [active, progress])


    return (
        <><Sphere args={[EARTH_RADIUS, 50, 50]}>
            <meshPhongMaterial specularMap={specularMap}/>
            <meshStandardMaterial
                map={colorMap}
                bumpMap={bumpMap}
                bumpScale={0.01}
                displacementMap={bumpMap}
                displacementScale={0.01}
                displacementBias={0.0001}
                emissiveMap={nightMap}
                emissiveIntensity={5}
                emissive={0xaaaaaa}
            />
        </Sphere></>
    )
}