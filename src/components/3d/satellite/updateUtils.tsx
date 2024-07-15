import { MutableRefObject, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { miscellaneousOptionsState } from "../../../atoms.ts";
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

const temp = new Object3D();

type GeoCoordinate = { latitude: number; longitude: number; altitude: number };

type CalculatedData = {
  date: DateTime;
  satellitePositions: GeoCoordinate[];
};

function useBuffers(index: number) {
  const [buffers, setBuffers] = useState<CalculatedData[]>([]);
  const altitudeFactor = useRecoilValue(
    miscellaneousOptionsState,
  ).altitudeFactor;
  useEffect(() => {
    function resetSatelliteData() {
      const now = DateTime.now();
      const bufferStart = updateSatellitePositions(altitudeFactor, now);
      const bufferEnd = updateSatellitePositions(
        altitudeFactor,
        now.plus(SATELLITE_BUFFER_DELTA),
      );
      const bufferNext = updateSatellitePositions(
        altitudeFactor,
        now.plus(SATELLITE_BUFFER_DELTA).plus(SATELLITE_BUFFER_DELTA),
      );
      Promise.all([bufferStart, bufferEnd, bufferNext])
        .then((buffers) => {
          setBuffers(buffers);
        })
        .catch((error) => {
          console.error("Error fetching satellite data", error);
        });
    }

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
    updateSatellitePositions(altitudeFactor, nextEndDate)
      .then((buffer) => {
        setBuffers((prev) => {
          prev[nextEndIndex] = buffer;
          return prev;
        });
      })
      .catch((error) => {
        console.error("Error fetching satellite data", error);
      });
  }, [index, buffers, altitudeFactor]);

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
): { x: number; y: number; z: number }[] {
  const date = DateTime.now();
  let calculatedIndex = index;
  if (!buffers[index] || !buffers[nextIndex(index, buffers.length)]) {
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
  const satPositions = startBuffer.satellitePositions.map((geodetic, i) => {
    geodetic = interpolateGeoCoordinates(
      geodetic,
      endBuffer.satellitePositions[i],
      ratio,
    );

    // const cartesian = interpolateCartesian(cartesian1, cartesian2, ratio);
    let cartesian = convertToCartesian(
      geodetic.latitude,
      geodetic.longitude,
      geodetic.altitude,
    );
    let scale = Math.max(geodetic.altitude / 400, 0.001);

    if (
      isNaN(geodetic.latitude) ||
      isNaN(endBuffer.satellitePositions[i].latitude) ||
      geodetic.altitude > 2000
    ) {
      cartesian = {
        x: 0,
        y: 0,
        z: 0,
      };
      scale = 0;
    }
    temp.position.set(cartesian.x, cartesian.y, cartesian.z);
    temp.scale.set(scale, scale, scale);
    // Set rotation to look at the camera
    temp.quaternion.copy(camera.quaternion);
    temp.updateMatrix();

    instancedMeshRef.current.setMatrixAt(i, temp.matrix);
    return cartesian;
  });
  // Update the instance
  instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  return satPositions;
}

async function updateSatellitePositions(
  altitudeFactor: number,
  date: DateTime,
) {
  const res = await satelliteApi.satelliteServiceGetSatellitePositions(
    date.toISO() as string,
    [],
  );
  return {
    date: date,
    satellitePositions: res.data.satellites?.map((satellite) => {
      return {
        latitude: toDegrees(satellite.lat as number),
        longitude: toDegrees(satellite.lon as number),
        altitude:
          (satellite.altitude as number) * altitudeFactor * 0.0001 +
          EARTH_RADIUS,
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
