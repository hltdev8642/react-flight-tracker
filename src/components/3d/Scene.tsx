import {CameraControls, Stars} from "@react-three/drei";

import {EARTH_RADIUS} from "../../constants.ts";
import {Bloom, EffectComposer, SMAA, Vignette} from "@react-three/postprocessing";
import {useRecoilValue} from "recoil";
import {graphicOptionsState} from "../../atoms.ts";
import {CountryBorders} from "./countryBorders.tsx";
import {lazy, useEffect, useRef} from "react";
import Sun from "./Sun.tsx";

const FlightTrail = lazy(() => import('./FlightTrail.tsx'))
const Flights = lazy(() => import('./Flights.tsx'))
const Earth = lazy(() => import('./Earth.tsx'))
const MobileEarth = lazy(() => import('./MobileEarth.tsx'))

function Scene() {
    const graphicOptions = useRecoilValue(graphicOptionsState)
    const cameraControlsRef = useRef<CameraControls>(null!)
    useEffect(() => {
            if (cameraControlsRef.current) {

                void cameraControlsRef.current.dolly(500 - (EARTH_RADIUS * 2), true).then()
            }
        }
        , [cameraControlsRef])
    return (
        <>
            {
                graphicOptions.stars ?
                    <Stars
                        radius={100}
                        depth={50}
                        count={1000}
                        factor={4}
                        saturation={0}
                        fade={true}

                    />
                    : <></>
            }
            <CameraControls
                minDistance={EARTH_RADIUS + 0.2}
                ref={cameraControlsRef}
                distance={500}
                truckSpeed={0}
            />
            {
                graphicOptions.highResolutionEarth ?
                    <Earth/>
                    : <MobileEarth/>
            }
            <Sun/>
            <Flights/>
            <FlightTrail/>

            {
                graphicOptions.countryBorders ?
                    <CountryBorders/>
                    : <></>
            }


            {
                (graphicOptions.bloom || graphicOptions.vignette || graphicOptions.SMAA) ?
                    <EffectComposer>
                        {
                            graphicOptions.bloom ?
                                <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300}
                                       intensity={0.7}
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
        </>
    )
}

export default Scene
