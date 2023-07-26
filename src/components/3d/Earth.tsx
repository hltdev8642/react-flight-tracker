import {useLoader} from "@react-three/fiber";
import {SphereGeometry, Texture, TextureLoader, Vector3} from "three";
import {NodeToyMaterial} from "@nodetoy/three-nodetoy";
import EarthColorMap from "../../assets/earthmap/8081_earthmap10k.jpg";
import EarthSpecularMap from "../../assets/earthmap/8081_earthspec10k.jpg";
import EarthBumpMap from "../../assets/earthmap/8081_earthbump10k.jpg";
import EarthNightMap from "../../assets/earthmap/night_noLight.jpg";
import EarthNightMapTransparent from "../../assets/earthmap/5_night_transparent16k.png";
import {Sphere} from "@react-three/drei";
import {EARTH_RADIUS} from "../../constants.ts";

export function Earth() {
    // load texture
    const [colorMap, specularMap, bumpMap, nightMap] = useLoader(TextureLoader, [
            EarthColorMap,
            EarthSpecularMap,
            EarthBumpMap,
            EarthNightMap
        ]
    ) as Texture[]

    const sphereGeometry = new SphereGeometry(1, 200, 200)
    sphereGeometry.computeTangents()
    sphereGeometry.computeBoundingSphere()
    sphereGeometry.computeVertexNormals()
    const light = (new Vector3(0, 0.3, -1)).normalize()
    const material = new NodeToyMaterial({
        url: "https://draft.nodetoy.co/pmX6cATx6YUSLbzX",
        verbose: true,
        parameters: { // These have to have the same names given to the properties
            night: EarthNightMapTransparent,
            emissionIntensity: 5,
            lightDir: {
                x: light.x,
                y: light.y,
                z: light.z,
            }
        },
    });

    return (
        <>
            <Sphere args={[EARTH_RADIUS - 0.0001, 50, 50]}>
                <meshPhysicalMaterial
                    map={colorMap}
                    bumpMap={bumpMap}
                    bumpScale={0.01}
                    displacementMap={bumpMap}
                    displacementScale={0.01}
                    displacementBias={0.0001}
                    aoMap={specularMap}
                    emissiveMap={nightMap}
                    emissiveIntensity={5}
                    emissive={0xaaaaaa}
                />
            </Sphere>
            <mesh
                geometry={sphereGeometry}
                material={material}
            ></mesh>

        </>
    )
}