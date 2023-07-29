import {atom} from "recoil";
import {AircraftData} from "flightradar24-client-ts/lib/types";
import {defaultRadarOptions, RadarOptions} from "flightradar24-client-ts/lib/config";

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
}

export const graphicOptionsState = atom<GraphicOptions>({
        key: 'graphicOptions',
        default: {
            bloom: true,
            vignette: true,
            SMAA: true,
        }
    }
)