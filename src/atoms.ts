import {atom} from "recoil";
import {AircraftData} from "flightradar24-client-ts/lib/types";
import {defaultRadarOptions, RadarOptions} from "flightradar24-client-ts/lib/config";
import {getGPUTier} from 'detect-gpu';


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