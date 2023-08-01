import {CameraControls, Stars, Text} from "@react-three/drei";

import Flights from "./Flights.tsx";
import FlightTrail from "./FlightTrail.tsx";
import {Suspense} from "react";
import {EARTH_RADIUS} from "../../constants.ts";
import {Bloom, EffectComposer, SMAA, Vignette} from "@react-three/postprocessing";
import {useRecoilValue} from "recoil";
import {graphicOptionsState} from "../../atoms.ts";
import {MobileEarth} from "./MobileEarth.tsx";


function Scene() {
    const graphicOptions = useRecoilValue(graphicOptionsState)

    return (
        <Suspense fallback={
            <>
                <Text color="white" anchorX="center" anchorY="middle">
                    Loading...
                </Text>
            </>

        }>
            <Stars
                radius={100}
                depth={50}
                count={1000}
                factor={4}
                saturation={0}
                fade={true}

            />
            <CameraControls/>
            <MobileEarth/>
            <pointLight position={[EARTH_RADIUS + 102, 0, 0]}
                        castShadow={true}
            />
            <Flights/>
            <FlightTrail/>
            {
                graphicOptions.bloom || graphicOptions.vignette || graphicOptions.SMAA ?
                    <EffectComposer>
                        {
                            graphicOptions.bloom ?
                                <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300}
                                /> : <></>
                        }
                        {
                            graphicOptions.vignette ?
                                <Vignette eskil={false} offset={0.1} darkness={0.9}
                                /> : <></>
                        }
                        {
                            graphicOptions.SMAA ?
                                <SMAA/> : <></>
                        }

                    </EffectComposer>
                    : <></>
            }
        </Suspense>
    )
}

export default Scene
