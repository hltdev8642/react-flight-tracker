// ADSB.lol API integration for aircraft data
// See: https://api.adsb.lol/docs

import axios from "axios";

const BASE_URL = "https://api.adsb.lol/v2";

export interface ADSBLolAircraft {
  hex: string;
  flight: string;
  lat: number;
  lon: number;
  alt_baro: number;
  alt_geom: number;
  gs: number;
  track: number;
  seen_pos: number;
  rssi: number;
  squawk: string;
  emergency: string;
  category: string;
  nav_qnh: number;
  nav_altitude_mcp: number;
  nav_heading: number;
  nav_modes: string[];
  seen: number;
  messages: number;
  r: string;
  t: string;
  dbFlags: string;
  // ...add more fields as needed from the API
}

export interface ADSBLolResponse {
  now: number;
  total: number;
  aircraft: ADSBLolAircraft[];
}

export interface ADSBLolQuery {
  bounds?: string; // "minlat,minlon,maxlat,maxlon"
  icao24?: string;
  reg?: string;
  flight?: string;
  squawk?: string;
  category?: string;
  // ...other supported query params
}


// Helper to get current geolocation as a Promise
export function getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
  const DEFAULT_LOCATION = { latitude: 42.3655804, longitude: -71.0183939 };
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(DEFAULT_LOCATION);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => resolve(DEFAULT_LOCATION),
        { enableHighAccuracy: true, timeout: 10000 }
      );

    }
  });
}


// Fetch aircraft near a given lat/lon using the /lat/{lat}/lon/{lon}/dist/100 endpoint
export async function fetchAircraftNearLocation(lat: number, lon: number): Promise<ADSBLolResponse> {
  try {
    const url = `${BASE_URL}/lat/${lat}/lon/${lon}/dist/100`;
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    if (error.response && error.response.status === 503) {
      // Return a default JSON with sample planes if service unavailable
      return {
        now: Date.now(),
        total: 2,
        ac: [
          {
            hex: "default1",
            flight: "SAMPLE1",
            lat: 42.3656,
            lon: -71.0184,
            alt_baro: 10000,
            alt_geom: 10500,
            gs: 400,
            track: 90,
            seen_pos: 0,
            rssi: -10,
            squawk: "1200",
            emergency: "none",
            category: "A1",
            nav_qnh: 1013,
            nav_altitude_mcp: 10000,
            nav_heading: 90,
            nav_modes: [],
            seen: 0,
            messages: 100,
            r: "N12345",
            t: "B738",
            dbFlags: "",
          },
          {
            hex: "default2",
            flight: "SAMPLE2",
            lat: 42.366,
            lon: -71.02,
            alt_baro: 12000,
            alt_geom: 12500,
            gs: 420,
            track: 270,
            seen_pos: 0,
            rssi: -12,
            squawk: "1200",
            emergency: "none",
            category: "A2",
            nav_qnh: 1013,
            nav_altitude_mcp: 12000,
            nav_heading: 270,
            nav_modes: [],
            seen: 0,
            messages: 120,
            r: "N54321",
            t: "A320",
            dbFlags: "",
          },
        ],
      } as any;
    }
    throw new Error(error.message || "Failed to fetch aircraft data");
  }
}

// fetchAircraftByHex removed: all aircraft data should come from the /lat/{lat}/lon/{lon}/dist/100 endpoint


