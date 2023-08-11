import {ASTRONOMICAL_UNIT, reductionFactor, SUN_RADIUS} from "../../constants.ts";
import { Vector3} from "three";
import {convertToCartesian} from "../../utils.ts";
import {
    calculateSunPosition,
    rightAscensionAndDeclinationToGeoCoordinates, toDegrees
} from "../../astronomy-utils.tsx";
import {useEffect} from "react";
import {useRecoilState} from "recoil";
import {sunPositionState} from "../../atoms.ts";


export default function Sun() {
    const date = new Date(Date.now())
    const [pos, setPos] = useRecoilState(sunPositionState)
    const posOnEarth = rightAscensionAndDeclinationToGeoCoordinates(pos.ra, pos.dec, date)
    const cartesian = convertToCartesian(toDegrees(posOnEarth.lat), toDegrees(posOnEarth.lon), pos.r * ASTRONOMICAL_UNIT * reductionFactor)
    // update every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setPos(calculateSunPosition(new Date(Date.now())))
        }, 10000)
        return () => {
            clearInterval(interval);
        };
    }, [setPos]);

    return <pointLight
        visible={true}
        position={
            new Vector3(cartesian.x, cartesian.y, cartesian.z)
        }
        castShadow={true}
        intensity={1}
    >
        <mesh>
            <sphereGeometry args={[SUN_RADIUS, 10, 10]}/>
            <meshStandardMaterial color={"yellow"}
                                  emissive={"yellow"}
                                  emissiveIntensity={10}
            />
        </mesh>
    </pointLight>

}