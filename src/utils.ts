import { FlightRadarApi } from "flightradar24-client-ts";
import { toDegrees, toRadians } from "./astronomy-utils.tsx";

export function convertToCartesian(
  latitude: number,
  longitude: number,
  radius: number,
) {
  const phi = (90 - latitude) * (Math.PI / 180);
  const theta = (longitude + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return { x, y, z };
}

// https://math.stackexchange.com/questions/383711/parametric-equation-for-great-circle#384719
// http://edwilliams.org/avform147.htm
export function interpolateGeoCoordinates(
  start: { latitude: number; longitude: number; altitude: number },
  end: { latitude: number; longitude: number; altitude: number },
  fraction: number,
) {
  const d = Math.acos(
    Math.sin(toRadians(start.latitude)) * Math.sin(toRadians(end.latitude)) +
      Math.cos(toRadians(start.latitude)) *
        Math.cos(toRadians(end.latitude)) *
        Math.cos(toRadians(end.longitude) - toRadians(start.longitude)),
  );
  const A = Math.sin((1 - fraction) * d) / Math.sin(d);
  const B = Math.sin(fraction * d) / Math.sin(d);
  const x =
    A *
      Math.cos(toRadians(start.latitude)) *
      Math.cos(toRadians(start.longitude)) +
    B * Math.cos(toRadians(end.latitude)) * Math.cos(toRadians(end.longitude));
  const y =
    A *
      Math.cos(toRadians(start.latitude)) *
      Math.sin(toRadians(start.longitude)) +
    B * Math.cos(toRadians(end.latitude)) * Math.sin(toRadians(end.longitude));
  const z =
    A * Math.sin(toRadians(start.latitude)) +
    B * Math.sin(toRadians(end.latitude));
  const latitude = Math.atan2(z, Math.sqrt(x * x + y * y));
  const longitude = Math.atan2(y, x);
  return {
    latitude: toDegrees(latitude),
    longitude: toDegrees(longitude),
    altitude: start.altitude + fraction * (end.altitude - start.altitude),
  };
}

export function listInterpolatedGeoCoordinates(
  start: { latitude: number; longitude: number; altitude: number },
  end: { latitude: number; longitude: number; altitude: number },
  numberOfPoints: number,
) {
  const coordinates = [];
  for (let i = 0; i < numberOfPoints; i++) {
    coordinates.push(interpolateGeoCoordinates(start, end, i / numberOfPoints));
  }
  coordinates.push(end);
  return coordinates;
}

const flightRadarApi = new FlightRadarApi({
  corsProxy: "https://cors-proxy.appadooapoorva.workers.dev/",
});
export { flightRadarApi };
