import {EARTH_RADIUS} from "../../constants.ts";
import {Sphere} from "@react-three/drei";
import {CountryBorders} from "./countryBorders.tsx";

export function MobileEarth() {


    return (
        <>
            <Sphere args={[EARTH_RADIUS, 50, 50]}>
                <meshStandardMaterial
                    color={'#000000'}
                />
            </Sphere>
            <CountryBorders/>
        </>
    )
}