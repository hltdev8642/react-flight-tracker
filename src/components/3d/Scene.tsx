import { Stars } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  Noise,
  SMAA,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { useRecoilValue } from "recoil";
import { graphicOptionsState, miscellaneousOptionsState } from "../../atoms.ts";
import { CountryBorders } from "./countryBorders.tsx";
import { lazy, Suspense } from "react";
import Sun from "./Sun.tsx";
import Moon from "./Moon.tsx";
import Camera from "./Camera.tsx";
import { ToneMappingMode } from "postprocessing";

const FlightTrail = lazy(() => import("./FlightTrail.tsx"));
const Flights = lazy(() => import("./Flights.tsx"));
const Earth = lazy(() => import("./Earth.tsx"));
const MobileEarth = lazy(() => import("./MobileEarth.tsx"));
const Satellites = lazy(() => import("./Satellites.tsx"));

function Scene() {
  const graphicOptions = useRecoilValue(graphicOptionsState);
  const miscellaneousOptions = useRecoilValue(miscellaneousOptionsState);
  return (
    <>
      {graphicOptions.stars ? (
        <Stars
          radius={100}
          depth={50000}
          count={1000}
          factor={4}
          saturation={0}
          fade={true}
        />
      ) : (
        <></>
      )}
      <Camera />
      <Suspense
        fallback={
          <>
            <MobileEarth />
          </>
        }
      >
        {graphicOptions.highResolutionEarth ? <Earth /> : <MobileEarth />}
      </Suspense>
      <Sun />
      {graphicOptions.enableMoon ? (
        <Suspense fallback={<></>}>
          <Moon />
        </Suspense>
      ) : (
        <></>
      )}

      <Flights />
      <FlightTrail />
      {miscellaneousOptions.showSatellites ? <Satellites /> : <></>}
      {graphicOptions.countryBorders ? <CountryBorders /> : <></>}

      <EffectComposer>
        {graphicOptions.bloom ? (
          <Bloom
            luminanceThreshold={0}
            luminanceSmoothing={0.9}
            height={300}
            intensity={0.7}
          />
        ) : (
          <></>
        )}
        {graphicOptions.vignette ? (
          <Vignette eskil={false} offset={0.1} darkness={0.9} />
        ) : (
          <></>
        )}
        {graphicOptions.SMAA ? <SMAA /> : <></>}
        <Noise opacity={0.01} />
        <ToneMapping
          mode={ToneMappingMode.ACES_FILMIC}
          adaptive={true} // toggle adaptive luminance map usage
          resolution={256} // texture resolution of the luminance map
          middleGrey={0.6} // middle grey factor
          maxLuminance={16.0} // maximum luminance
          averageLuminance={1.0} // average luminance
          adaptationRate={1.0} // luminance adaptation rate
        />
      </EffectComposer>
    </>
  );
}

export default Scene;
