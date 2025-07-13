import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  InstancedMesh,
  Matrix4,
  Object3D,
  TextureLoader,
  Vector3,
} from "three";
import { convertToCartesian } from "../../../utils.ts";
import { fetchAircraftNearLocation, getCurrentPosition } from "../../../adsbLolApi";
import type { ADSBLolAircraft } from "../../../adsbLolApi";
import { useRecoilState, useRecoilValue } from "recoil";
import { miscellaneousOptionsState, selectedFlightState } from "../../../atoms.ts";
import { EARTH_RADIUS, reductionFactor } from "../../../constants.ts";
import PlaneTexture from "../../../assets/planeTexture.png";
import { useLoader } from "@react-three/fiber";

const temp = new Object3D();
export default function Flights() {
  const planeTexture = useLoader(TextureLoader, PlaneTexture);
  // Use geolocation to get user's position and fetch aircraft near them
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  useEffect(() => {
    getCurrentPosition().then((pos) => setLocation(pos)).catch(() => setLocation(null));
  }, []);

  const { data: adsbData, refetch: refetchFlights } = useQuery({
    queryKey: ["adsb-aircraft", location],
    queryFn: () =>
      location
        ? fetchAircraftNearLocation(location.latitude, location.longitude)
        : Promise.resolve({ now: Date.now(), total: 0, aircraft: [] }),
    refetchIntervalInBackground: true,
    refetchInterval: 20000,
    enabled: true,
  });
  // ADSB.lol API returns aircraft under 'ac' property
  // Filter to only include aircraft with valid lat/lon/alt_geom
  const data: ADSBLolAircraft[] = (adsbData?.ac || adsbData?.aircraft || []).filter(
    (flight: any) =>
      typeof flight.lat === 'number' &&
      typeof flight.lon === 'number' &&
      typeof flight.alt_geom === 'number' &&
      !isNaN(flight.lat) &&
      !isNaN(flight.lon) &&
      !isNaN(flight.alt_geom)
  );
  // Debug: log filtered aircraft data
  // console.log('Filtered ADSB.lol aircraft data:', data);
  const [selectedFlight, setSelectedFlight] =
    useRecoilState(selectedFlightState);

  useEffect(() => {
    refetchFlights().catch((e) => console.error(e));
  }, [refetchFlights]);

  const instancedMeshRef = useRef<InstancedMesh>(null!);
  const scale = 140000 * reductionFactor;
  const altitudeFactor = useRecoilValue(miscellaneousOptionsState).altitudeFactor;
  useEffect(() => {
    if (data) {
      data.forEach((flight, i) => {
        const cartesian = convertToCartesian(
          flight.lat,
          flight.lon,
          EARTH_RADIUS + (flight.alt_geom || 0) * reductionFactor * altitudeFactor,
        );
        temp.position.set(cartesian.x, cartesian.y, cartesian.z);
        temp.scale.set(scale, scale, scale / 5);
        const target_vec = new Vector3(0, 0, 0);
        const rotation_matrix = new Matrix4();
        rotation_matrix.lookAt(temp.position, target_vec, new Vector3(0, 1, 0));
        temp.quaternion.setFromRotationMatrix(rotation_matrix);
        // Heading (track) in degrees
        temp.rotateOnWorldAxis(temp.position, (-(flight.track || 0) * Math.PI) / 180);
        temp.updateMatrix();
        instancedMeshRef.current.setMatrixAt(i, temp.matrix);
      });
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [data, scale, altitudeFactor]);

  useEffect(() => {
    // update selected flight
    if (selectedFlight && data) {
      const index = data.findIndex((flight) => flight.hex === selectedFlight.hex);
      if (index !== -1) {
        setSelectedFlight(data[index]);
      }
    }
  }, [data, selectedFlight, setSelectedFlight]);

  return (
    <>
      <instancedMesh
        ref={instancedMeshRef}
        args={[undefined, undefined, data?.length || 0]}
        onClick={(e) => {
          // Debug: log click event and instanceId
          // console.log('Plane clicked:', e.instanceId);
          const indexOfPlane = Number(e.instanceId);
          // console.log(data[indexOfPlane]);
          const acArray = data[indexOfPlane];
          if (acArray) {
            alert(
              `Flight: ${acArray.flight || "N/A"}\n` +
              `Hex: ${acArray.hex}\n` +
              `Altitude: ${acArray.alt_geom} ft\n` +
              `Lat: ${acArray.lat}\n` +
              `Lon: ${acArray.lon}\n` +
              `Track: ${acArray.track || "N/A"}`
            );
          }
        }}
      >
        <planeGeometry args={[1, 1, 1, 1]} />
        <meshStandardMaterial
          map={planeTexture}
          transparent={true}
          opacity={0.8}
          emissiveMap={planeTexture}
          emissive={"white"}
          emissiveIntensity={4}
        />
      </instancedMesh>
    </>
  );
}
