import { MutableRefObject, useEffect, useState } from "react";
import { DateTime } from "luxon";
import {
  InstancedMesh,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
} from "three";
import {
  convertToCartesian,
  interpolateGeoCoordinates,
  satelliteApi,
} from "../../../utils.ts";
import { toDegrees } from "../../../astronomy-utils.tsx";
import { EARTH_RADIUS, SATELLITE_BUFFER_DELTA } from "../../../constants.ts";
import { V1Satellite } from "satellite-api-react-flight-tracker-axios";
import {
  SatelliteFilterOptions,
  satelliteFilterOptionsState,
} from "../../../atoms.ts";
import { useRecoilState } from "recoil";

const temp = new Object3D();
export type GeoPosition = {
  latitude: number;
  longitude: number;
  altitude: number;
};

export type CartesianPosition = {
  x: number;
  y: number;
  z: number;
};

export type SatelliteWithCartesian = V1Satellite &
  CartesianPosition &
  GeoPosition;

export type CalculatedData = {
  date: DateTime;
  satellitePositions: SatelliteWithCartesian[];
};

function useBuffers(index: number) {
  const [buffers, setBuffers] = useState<CalculatedData[]>([]);
  const [satelliteFilterOptions] = useRecoilState(satelliteFilterOptionsState);

  function resetSatelliteData() {
    const now = DateTime.now().toUTC();
    const bufferStart = updateSatellitePositions(now, satelliteFilterOptions);
    const bufferEnd = updateSatellitePositions(
      now.plus(SATELLITE_BUFFER_DELTA),
      satelliteFilterOptions,
    );
    const bufferNext = updateSatellitePositions(
      now.plus(SATELLITE_BUFFER_DELTA).plus(SATELLITE_BUFFER_DELTA),
      satelliteFilterOptions,
    );
    Promise.all([bufferStart, bufferEnd, bufferNext])
      .then((buffers) => {
        setBuffers(buffers);
      })
      .catch((error) => {
        console.error("Error fetching satellite data", error);
      });
  }

  useEffect(() => {
    if (buffers.length == 0) {
      resetSatelliteData();
      return;
    }
    const currentEndIndex = nextIndex(index, buffers.length);
    const currentEndDate = buffers[currentEndIndex].date;
    const nextEndIndex = nextIndex(currentEndIndex, buffers.length);
    const nextEndDate = currentEndDate.plus(SATELLITE_BUFFER_DELTA);

    if (nextEndDate < DateTime.now()) {
      setBuffers([]);
      return;
    }

    if (buffers[nextEndIndex].date.toMillis() == nextEndDate.toMillis()) {
      return;
    }
    updateSatellitePositions(nextEndDate, satelliteFilterOptions)
      .then((buffer) => {
        setBuffers((prev) => {
          prev[nextEndIndex] = buffer;
          return prev;
        });
      })
      .catch((error) => {
        console.error("Error fetching satellite data", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, buffers]);

  useEffect(() => {
    if (buffers.length == 0) {
      return;
    } else {
      resetSatelliteData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [satelliteFilterOptions, buffers.length]);

  return buffers;
}

function handleSatellitePositionUpdate(
  index: number,
  buffers: CalculatedData[],
  setIndex: (value: ((prevState: number) => number) | number) => void,
  camera:
    | (OrthographicCamera & {
        manual?: boolean;
      })
    | (PerspectiveCamera & { manual?: boolean }),
  instancedMeshRef: MutableRefObject<InstancedMesh>,
  altitudeFactor: number,
): SatelliteWithCartesian[] {
  const date = DateTime.now();
  let calculatedIndex = index;
  if (
    !buffers[index] ||
    !buffers[nextIndex(index, buffers.length)] ||
    !buffers[index].satellitePositions ||
    !buffers[nextIndex(index, buffers.length)].satellitePositions
  ) {
    return [];
  }
  if (
    date > buffers[nextIndex(index, buffers.length)].date &&
    buffers[index].date.second !=
      buffers[nextIndex(index, buffers.length)].date.second
  ) {
    setIndex(nextIndex(index, buffers.length));

    calculatedIndex = nextIndex(index, buffers.length);
  }
  const startBuffer = buffers[calculatedIndex];
  const endBuffer = buffers[nextIndex(calculatedIndex, buffers.length)];
  const ratio =
    (date.toMillis() - startBuffer.date.toMillis()) /
    SATELLITE_BUFFER_DELTA.toMillis();
  const satPositions = startBuffer.satellitePositions.map(
    (satelliteWithCartesian, i) => {
      if (
        !satelliteWithCartesian.velocity ||
        !endBuffer.satellitePositions[i] ||
        !endBuffer.satellitePositions[i].velocity
      ) {
        return satelliteWithCartesian;
      }
      const isSatelliteSlow = satelliteWithCartesian.velocity < 0.5;
      const interpolatedGeoCoordinates = interpolateGeoCoordinates(
        satelliteWithCartesian,
        endBuffer.satellitePositions[i],
        isSatelliteSlow ? 0 : ratio,
      );
      satelliteWithCartesian = {
        ...satelliteWithCartesian,
        velocity:
          satelliteWithCartesian.velocity * ratio +
          endBuffer.satellitePositions[i].velocity * (1 - ratio),
        ...interpolatedGeoCoordinates,
        altitude:
          interpolatedGeoCoordinates.altitude * altitudeFactor * 0.0001 +
          EARTH_RADIUS,
      };

      // const cartesian = interpolateCartesian(cartesian1, cartesian2, ratio);
      let cartesian = convertToCartesian(
        satelliteWithCartesian.latitude,
        satelliteWithCartesian.longitude,
        satelliteWithCartesian.altitude,
      );
      let scale = Math.max(satelliteWithCartesian.altitude / 400, 0.001);

      if (
        isNaN(satelliteWithCartesian.latitude) ||
        isNaN(endBuffer.satellitePositions[i].latitude) ||
        satelliteWithCartesian.altitude > 2000
      ) {
        cartesian = {
          x: 0,
          y: 0,
          z: 0,
        };
        scale = 0;
      }
      scale *= 5;
      temp.position.set(cartesian.x, cartesian.y, cartesian.z);
      temp.scale.set(scale, scale, scale);
      // Set rotation to look at the camera
      temp.quaternion.copy(camera.quaternion);
      temp.updateMatrix();

      instancedMeshRef.current.setMatrixAt(i, temp.matrix);
      satelliteWithCartesian = {
        ...satelliteWithCartesian,
        ...cartesian,
      };
      return satelliteWithCartesian;
    },
  );
  // Update the instance
  instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  instancedMeshRef.current.computeBoundingSphere();
  return satPositions;
}

async function updateSatellitePositions(
  date: DateTime,
  options: SatelliteFilterOptions,
) {
  const res = await satelliteApi.satelliteServiceGetSatellitePositions(
    date.toISO() as string,
    options.groups,
  );
  return {
    date: date,
    satellitePositions: res.data.satellites?.map((satellite) => {
      return {
        latitude: toDegrees(satellite.lat as number),
        longitude: toDegrees(satellite.lon as number),
        altitude: satellite.altitude as number,
        id: satellite.id,
        name: satellite.name,
        velocity: satellite.velocity as number,
      };
    }),
  } as CalculatedData;
}

function nextIndex(index: number, length: number) {
  return (index + 1) % length;
}

export {
  useBuffers,
  handleSatellitePositionUpdate,
  updateSatellitePositions,
  nextIndex,
};
