import { atom } from "recoil";
import { AircraftData } from "flightradar24-client-ts/lib/types";
import {
  defaultRadarOptions,
  RadarOptions,
} from "flightradar24-client-ts/lib/config";
import { getGPUTier } from "detect-gpu";
import {
  calculateMoonPosition,
  calculateSunPosition,
} from "./astronomy-utils.tsx";
import { syncEffect } from "recoil-sync";
import { array, bool, Checker, number, object, string } from "@recoiljs/refine";

export const selectedFlightState = atom<AircraftData | undefined>({
  key: "selectedFlight",
  default: undefined,
});

export const liveFlightsOptionsState = atom<RadarOptions>({
  key: "liveFlightsOptions",
  default: {
    ...defaultRadarOptions,
    estimatedPositions: false,
  },
});

export interface GraphicOptions {
  enableMoon: boolean;
  bloom: boolean;
  vignette: boolean;
  SMAA: boolean;
  countryBorders: boolean;
  highResolutionEarth: boolean;
  stars: boolean;
  satellitePathResolution: number;
}

export const ultraGraphics: GraphicOptions = {
  bloom: true,
  vignette: true,
  SMAA: true,
  stars: true,
  highResolutionEarth: true,
  countryBorders: true,
  enableMoon: true,
  satellitePathResolution: 200,
};

export const highGraphics: GraphicOptions = {
  bloom: true,
  vignette: true,
  SMAA: false,
  stars: true,
  highResolutionEarth: true,
  countryBorders: true,
  enableMoon: true,
  satellitePathResolution: 90,
};

export const mediumGraphics: GraphicOptions = {
  bloom: false,
  vignette: false,
  SMAA: false,
  stars: true,
  highResolutionEarth: true,
  countryBorders: true,
  enableMoon: true,
  satellitePathResolution: 60,
};

export const lowGraphics: GraphicOptions = {
  bloom: false,
  vignette: false,
  SMAA: false,
  stars: false,
  highResolutionEarth: false,
  countryBorders: false,
  enableMoon: false,
  satellitePathResolution: 30,
};

export const graphicOptionsOptions = {
  ultra: ultraGraphics,
  high: highGraphics,
  medium: mediumGraphics,
  low: lowGraphics,
};

async function calculateGraphicOptions() {
  const gpuTier = await getGPUTier({
    desktopTiers: [
      0, 15, 30, 60, 120, 200, 280, 400, 500, 600, 700, 800, 900, 1000,
    ],
  });
  if (gpuTier.tier >= 7) {
    return graphicOptionsOptions.ultra;
  } else if (gpuTier.tier === 5 || gpuTier.tier === 6) {
    return graphicOptionsOptions.high;
  } else if (gpuTier.tier === 3 || gpuTier.tier === 4) {
    return graphicOptionsOptions.medium;
  } else {
    return graphicOptionsOptions.low;
  }
}

export const graphicOptionsState = atom<GraphicOptions>({
  key: "graphicOptions",
  default: calculateGraphicOptions(),
});

interface MiscellaneousOptions {
  satelliteSelectionMethod: "hover" | "click";
  altitudeFactor: number;
  enableAnnotations: boolean;
}

export const miscellaneousOptionsState = atom<MiscellaneousOptions>({
  key: "miscellaneousOptions",
  default: {
    altitudeFactor: 1,
    enableAnnotations: true,
    satelliteSelectionMethod: "hover",
  },

  effects: [
    syncEffect({
      refine: object({
        altitudeFactor: number(),
        enableAnnotations: bool(),
        satelliteSelectionMethod: string(),
      }) as Checker<MiscellaneousOptions>,
    }),
  ],
});

export const sunPositionState = atom<{
  dec: number;
  yeq: number;
  E: number;
  xeq: number;
  zeq: number;
  zh: number;
  ellipticLatitude: number;
  ra: number;
  yh: number;
  xh: number;
  geoLongitude: number;
  r: number;
  geoLatitude: number;
  ellipticLongitude: number;
  v: number;
}>({
  key: "sunPosition",
  default: calculateSunPosition(new Date(Date.now())),
});

export const moonPositionState = atom<{
  dec: number;
  yeq: number;
  E: number;
  xeq: number;
  zeq: number;
  zh: number;
  ellipticLatitude: number;
  ra: number;
  yh: number;
  xh: number;
  geoLongitude: number;
  r: number;
  geoLatitude: number;
  ellipticLongitude: number;
  v: number;
}>({
  key: "moonPosition",
  default: calculateMoonPosition(new Date(Date.now())),
});

export type CAMERA_TARGETS = "sun" | "moon" | "earth";
export const cameraTargetState = atom<CAMERA_TARGETS>({
  key: "cameraTarget",
  default: "earth",
  effects: [
    syncEffect({
      refine: string() as Checker<CAMERA_TARGETS>,
    }),
  ],
});
export const isAnimationRunningState = atom<boolean>({
  key: "isAnimationRunning",
  default: false,
});

// TODO: Fix the type of the atom
export const isPlanesEnabledState = atom<boolean>({
  key: "isPlanesEnabled",
  default: false,
  effects: [
    syncEffect({
      refine: bool(),
    }),
  ],
});

export const isSatellitesEnabledState = atom<boolean>({
  key: "isSatellitesEnabled",
  default: true,
  effects: [
    syncEffect({
      refine: bool(),
    }),
  ],
});

export interface SatelliteFilterOptions {
  groups: string[];
}

// TODO: Fix the type of the atom
export const satelliteFilterOptionsState = atom<SatelliteFilterOptions>({
  key: "satelliteFilterOptions",
  default: {
    groups: [],
  },

  effects: [
    syncEffect({
      refine: object({
        groups: array(string()),
      }) as Checker<SatelliteFilterOptions>,
    }),
  ],
});
