import {ASTRONOMICAL_UNIT, reductionFactor} from "../../constants.ts";
import {PointLight, Vector3} from "three";
import {convertToCartesian} from "../../utils.ts";
import {
    calculateSunPosition,
    rightAscensionAndDeclinationToGeoCoordinates, toDegrees
} from "../../astronomy-utils.tsx";
import {useRef} from "react";
import {useFrame} from "@react-three/fiber";


export default function Sun() {
    const lightRef = useRef<PointLight>(null!)
    const date = new Date(Date.now())
    const pos = calculateSunPosition(date)
    const posOnEarth = rightAscensionAndDeclinationToGeoCoordinates(pos.ra, pos.dec, date)
    const cartesian = convertToCartesian(toDegrees(posOnEarth.lat), toDegrees(posOnEarth.lon), pos.r * ASTRONOMICAL_UNIT * reductionFactor)
    useFrame(({clock}) => {
            // update the light position every 10 seconds
            if (clock.getElapsedTime() % 10 < 0.01) {
                const date = new Date(Date.now())
                const pos = calculateSunPosition(date)
                const posOnEarth = rightAscensionAndDeclinationToGeoCoordinates(pos.ra, pos.dec, date)
                const cartesian = convertToCartesian(toDegrees(posOnEarth.lat), toDegrees(posOnEarth.lon), pos.r * ASTRONOMICAL_UNIT * reductionFactor)
                lightRef.current.position.set(cartesian.x, cartesian.y, cartesian.z)
            }

        }
    )
    return <pointLight position={
        new Vector3(cartesian.x, cartesian.y, cartesian.z)
    }
                       castShadow={true}
                       intensity={1}
                       ref={lightRef}

    />

}