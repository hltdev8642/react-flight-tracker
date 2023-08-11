import {EARTH_RADIUS, MOON_RADIUS} from "../../constants.ts";
import {convertToCartesian} from "../../utils.ts";
import {
    calculateMoonPosition,

    rightAscensionAndDeclinationToGeoCoordinates, toDegrees
} from "../../astronomy-utils.tsx";
import {useEffect} from "react";
import {Sphere} from "@react-three/drei"
import {Vector3} from "three";
import {useRecoilState} from "recoil";
import {moonPositionState} from "../../atoms.ts";


export default function Moon() {
    const date = new Date(Date.now())
    const [pos, setPos] = useRecoilState(moonPositionState)
    const posOnEarth = rightAscensionAndDeclinationToGeoCoordinates(pos.ra, pos.dec, date)
    const cartesian = convertToCartesian(toDegrees(posOnEarth.lat), toDegrees(posOnEarth.lon), pos.r * EARTH_RADIUS)
    // update every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setPos(calculateMoonPosition(new Date(Date.now())))
        }, 10000)
        return () => {
            clearInterval(interval);
        };
    }, [setPos]);

    return <Sphere args={[MOON_RADIUS, 10, 10]}
                   position={new Vector3(cartesian.x, cartesian.y, cartesian.z)}
    >
        <meshStandardMaterial
            flatShading={false}
            color={"white"}
            emissive={"grey"}
            emissiveIntensity={0.1}

        />
    </Sphere>

}