import {EARTH_RADIUS} from "../../constants.ts";
import {Sphere} from "@react-three/drei";

export default function MobileEarth() {


    return (
        <>
            <Sphere args={[EARTH_RADIUS, 50, 50]}>
                <meshStandardMaterial
                    color={'#000000'}
                />
            </Sphere>
        </>
    )
}