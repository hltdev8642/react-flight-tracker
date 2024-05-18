import { Stars } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  SMAA,
  Vignette,
} from "@react-three/postprocessing";
import { useRecoilValue } from "recoil";
import { graphicOptionsState, miscellaneousOptionsState } from "../../atoms.ts";
import { CountryBorders } from "./countryBorders.tsx";
import { lazy, Suspense } from "react";
import Sun from "./Sun.tsx";
import Moon from "./Moon.tsx";
import Camera from "./Camera.tsx";

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
      <Moon />
      <FlightTrail />
      {miscellaneousOptions.showSatellites ? <Satellites /> : <></>}
      {graphicOptions.countryBorders ? <CountryBorders /> : <></>}

      {graphicOptions.bloom ||
      graphicOptions.vignette ||
      graphicOptions.SMAA ? (
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
        </EffectComposer>
      ) : (
        <></>
      )}
    </>
  );
}

export default Scene;
