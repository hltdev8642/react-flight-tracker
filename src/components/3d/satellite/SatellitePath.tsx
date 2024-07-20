import { useQuery } from "@tanstack/react-query";
import { convertToCartesian, satelliteApi } from "../../../utils.ts";
import { DateTime } from "luxon";
import { Line } from "@react-three/drei";
import { Vector3 } from "three";
import { useRecoilValue } from "recoil";
import { miscellaneousOptionsState } from "../../../atoms.ts";
import { EARTH_RADIUS, reductionFactor } from "../../../constants.ts";
import { V1GeoPoint } from "satellite-api-react-flight-tracker-axios";

export default function SatellitePath(props: { noradId: string | undefined }) {
  const { data: satellitePath } = useQuery({
    queryKey: ["satellite-path", props.noradId],
    queryFn: () =>
      satelliteApi.satelliteServiceGetSatellitePath(
        props.noradId || "",
        DateTime.now().toUTC().toISO(),
        1000,
      ),
    refetchInterval: 1000,
    enabled: props.noradId !== undefined,
    refetchOnWindowFocus: true,
  });
  const altitudeFactor = useRecoilValue(
    miscellaneousOptionsState,
  ).altitudeFactor;
  const lineWidth = 20000000 * reductionFactor;
  let points =
    satellitePath?.data.path &&
    satellitePath?.data.path.map((trailPoint: V1GeoPoint) => {
      const cartesian = convertToCartesian(
        trailPoint?.lat || 0,
        trailPoint?.lon || 0,
        EARTH_RADIUS +
          (trailPoint?.altitude || 0) * altitudeFactor * reductionFactor +
          EARTH_RADIUS,
      );
      return new Vector3(cartesian.x, cartesian.y, cartesian.z);
    });

  if (!points || points.length < 2) {
    points = undefined;
  }
  return (
    <Line
      points={points || [new Vector3(0, 0, 0), new Vector3(0.1, 0.1, 0.11)]}
      color={"green"}
      lineWidth={lineWidth}
    />
  );
}
