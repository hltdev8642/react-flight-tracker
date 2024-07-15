import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
  InstancedMesh,
  Matrix4,
  Object3D,
  TextureLoader,
  Vector3,
} from "three";
import { convertToCartesian, flightRadarApi } from "../../../utils.ts";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  liveFlightsOptionsState,
  miscellaneousOptionsState,
  selectedFlightState,
} from "../../../atoms.ts";
import { EARTH_RADIUS, reductionFactor } from "../../../constants.ts";
import PlaneTexture from "../../../assets/planeTexture.png";
import { useLoader } from "@react-three/fiber";

const temp = new Object3D();
export default function Flights() {
  const planeTexture = useLoader(TextureLoader, PlaneTexture);
  const { data: zones } = useQuery({
    queryKey: ["zones"],
    queryFn: () => flightRadarApi.fetchZones(),
  });
  const liveFlightsOptions = useRecoilValue(liveFlightsOptionsState);
  const { data, refetch: refetchFlights } = useQuery({
    queryKey: ["flights"],
    queryFn: () =>
      flightRadarApi.fetchFromRadarMultiZone(zones!, liveFlightsOptions),
    refetchIntervalInBackground: true,
    refetchInterval: 20000,
    enabled: !!zones,
  });

  const [selectedFlight, setSelectedFlight] =
    useRecoilState(selectedFlightState);

  useEffect(() => {
    if (zones) {
      refetchFlights().catch((e) => console.error(e));
    }
  }, [liveFlightsOptions, refetchFlights, zones]);

  const instancedMeshRef = useRef<InstancedMesh>(null!);
  const scale = 140000 * reductionFactor;
  const altitudeFactor = useRecoilValue(
    miscellaneousOptionsState,
  ).altitudeFactor;
  useEffect(() => {
    if (data) {
      // Set positions
      data.forEach((flight, i) => {
        const cartesian = convertToCartesian(
          flight.trailEntity.lat,
          flight.trailEntity.lng,
          EARTH_RADIUS +
            flight.trailEntity.alt * reductionFactor * altitudeFactor,
        );
        temp.position.set(cartesian.x, cartesian.y, cartesian.z);
        temp.scale.set(scale, scale, scale / 5);
        const target_vec = new Vector3(0, 0, 0);
        const rotation_matrix = new Matrix4();

        // const magnetic_north = convertToCartesian(81.3000,-110.8000,EARTH_RADIUS)
        // const true_north = convertToCartesian(90,0,EARTH_RADIUS)
        rotation_matrix.lookAt(temp.position, target_vec, new Vector3(0, 1, 0));
        temp.quaternion.setFromRotationMatrix(rotation_matrix);
        // rotate around axis passing through origin and temp.position
        temp.rotateOnWorldAxis(
          temp.position,
          (-flight.trailEntity.hd * Math.PI) / 180,
        );
        temp.updateMatrix();
        instancedMeshRef.current.setMatrixAt(i, temp.matrix);
      });
      // Update the instance
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [data, scale, liveFlightsOptions, altitudeFactor]);

  useEffect(() => {
    // update selected flight
    if (selectedFlight && data) {
      const index = data.findIndex((flight) => flight.id === selectedFlight.id);
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
          if (data && e.instanceId !== undefined) {
            setSelectedFlight(data[e.instanceId]);
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
