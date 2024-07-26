import { Duration } from "luxon";

export const reductionFactor = 1 / 6371000;
export const EARTH_RADIUS = 6371000 * reductionFactor;
export const MOON_RADIUS = 1740000 * reductionFactor;
export const SUN_RADIUS = 696340000 * reductionFactor;
export const ASTRONOMICAL_UNIT = 149598000000;
export const SATELLITE_BUFFER_DELTA = Duration.fromObject({ seconds: 10 });
