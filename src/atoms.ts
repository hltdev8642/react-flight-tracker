import {atom} from "recoil";
import {AircraftData} from "flightradar24-client-ts/lib/types";
import {defaultRadarOptions, RadarOptions} from "flightradar24-client-ts/lib/config";
import {getGPUTier} from 'detect-gpu';
import {calculateMoonPosition, calculateSunPosition} from "./astronomy-utils.tsx";


export const selectedFlightState = atom<AircraftData | undefined>({
        key: 'selectedFlight',
        default: undefined
    }
)

export const liveFlightsOptionsState = atom<RadarOptions>({
        key: 'liveFlightsOptions',
        default: {
            ...defaultRadarOptions,
            estimatedPositions: false,
        },
    }
)


interface GraphicOptions {
    bloom: boolean,
    vignette: boolean,
    SMAA: boolean,
    countryBorders: boolean,
    highResolutionEarth: boolean,
    stars: boolean,
}

export const defaultGraphicOptions: GraphicOptions = {
    bloom: true,
    vignette: true,
    SMAA: true,
    stars: true,
    highResolutionEarth: true,
    countryBorders: true,
}

export const mobileGraphicOptions: GraphicOptions = {
    bloom: false,
    vignette: false,
    SMAA: false,
    stars: false,
    highResolutionEarth: false,
    countryBorders: true,
}
const gpuTier = await getGPUTier();

export const graphicOptionsState = atom<GraphicOptions>({
        key: 'graphicOptions',
        default: gpuTier.isMobile ? mobileGraphicOptions : defaultGraphicOptions,
    }
)

interface MiscellaneousOptions {
    altitudeFactor: number,
}

export const miscellaneousOptionsState = atom<MiscellaneousOptions>({
        key: 'miscellaneousOptions',
        default: {
            altitudeFactor: 1,
        }
    }
)


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
    v: number
}>({
    key: 'sunPosition',
    default: calculateSunPosition(new Date(
        Date.now()
    )),
})

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
    v: number
}>({
        key: 'moonPosition',
        default: calculateMoonPosition(new Date(
            Date.now()
        )),
    }
)

export type CAMERA_TARGETS = 'sun' | 'moon' | 'earth';
export const cameraTargetState = atom<CAMERA_TARGETS>({
        key: 'cameraTarget',
        default: 'earth',
    }
)
export const isAnimationRunningState = atom<boolean>({
        key: 'isAnimationRunning',
        default: false,
    }
)