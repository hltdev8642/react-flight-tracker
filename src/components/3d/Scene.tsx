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
import {
  graphicOptionsState,
  isPlanesEnabledState,
  isSatellitesEnabledState,
} from "../../atoms.ts";
import { CountryBorders } from "./planets/countryBorders.tsx";
import { lazy, Suspense } from "react";
import Sun from "./planets/Sun.tsx";
import Moon from "./planets/Moon.tsx";
import Camera from "./common/Camera.tsx";
import { ToneMappingMode } from "postprocessing";

const FlightTrail = lazy(() => import("./flight/FlightTrail.tsx"));
const Flights = lazy(() => import("./flight/Flights.tsx"));
const Earth = lazy(() => import("./planets/Earth.tsx"));
const MobileEarth = lazy(() => import("./planets/MobileEarth.tsx"));
const Satellites = lazy(() => import("./satellite/Satellites.tsx"));

function Scene() {
  const graphicOptions = useRecoilValue(graphicOptionsState);
  const isSatellitesEnabled = useRecoilValue(isSatellitesEnabledState);
  const isPlanesEnabled = useRecoilValue(isPlanesEnabledState);
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
      {graphicOptions.countryBorders ? <CountryBorders /> : <></>}

      {isPlanesEnabled ? (
        <>
          <Flights />
          <FlightTrail />
        </>
      ) : (
        <></>
      )}
      {isSatellitesEnabled ? <Satellites /> : <></>}

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
