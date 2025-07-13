import { MutableRefObject, Suspense } from "react";
import { Group } from "three";

import { Html } from "@react-three/drei";
import { CalculatedData, SatelliteWithCartesian } from "./updateUtils.tsx";
import { EARTH_RADIUS } from "../../../constants.ts";
import { useQuery } from "@tanstack/react-query";
import { satelliteApi } from "../../../utils.ts";
import { Grid, Typography } from "@mui/material";
import SatellitePath from "./SatellitePath.tsx";

function ToolTip(props: {
  groupRef: MutableRefObject<Group>;
  currentSatellite: number;
  calculatedData: CalculatedData[];
  index: number;
  toolTipInnerSimpleDescriptionRef: MutableRefObject<HTMLDivElement>;
  fullDetails: boolean;
  noradId?: string;
}) {
  const { data: satelliteDetailsData } = useQuery({
    queryKey: ["satellite", props.noradId],
    queryFn: () =>
      satelliteApi.satelliteServiceGetSatelliteDetail(props.noradId || ""),
    refetchInterval: 10000,
    enabled:
      props.currentSatellite !== -1 &&
      props.fullDetails &&
      props.noradId !== undefined,
    refetchOnWindowFocus: true,
  });
  return (
    <group ref={props.groupRef}>
      {props.currentSatellite !== -1 &&
        props.calculatedData[props.index] &&
        props.calculatedData[props.index].satellitePositions &&
        props.calculatedData[props.index].satellitePositions[
          props.currentSatellite
        ] && (
          <Html>
            <svg
              height="42"
              width="42"
              transform="translate(-16 -16)"
              style={{ cursor: "pointer" }}
            >
              <circle
                cx="16"
                cy="16"
                r="16"
                stroke="white"
                strokeWidth="2"
                fill="rgba(0,0,0,0)"
              />
            </svg>
            <div className="annotationDescription">
              <Typography
                variant="h6"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                {
                  props.calculatedData[props.index].satellitePositions[
                    props.currentSatellite
                  ].name
                }{" "}
                (
                {
                  props.calculatedData[props.index].satellitePositions[
                    props.currentSatellite
                  ].id
                }
                )
              </Typography>
              <Grid
                container
                spacing={3}
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                <Grid
                  item
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  minWidth={160}
                >
                  <div ref={props.toolTipInnerSimpleDescriptionRef}></div>
                </Grid>
                {satelliteDetailsData && (
                  <Grid
                    item
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    minWidth={230}
                  >
                    <b>Launch Date:</b> {satelliteDetailsData.data.launchDate}
                    <br />
                    <b>Launch Site:</b> {satelliteDetailsData.data.site}
                    <br />
                    <b>Country:</b> {satelliteDetailsData.data.countryCode}
                    <br />
                    <b>Object Type:</b> {satelliteDetailsData.data.objectType}
                    <br />
                    <b>RCS Size:</b> {satelliteDetailsData.data.rcsSize}
                    <br />
                    <b>Period</b> {satelliteDetailsData.data.period}
                  </Grid>
                )}
              </Grid>
            </div>
          </Html>
        )}
    </group>
  );
}

export default function SatelliteDetails(props: {
  toolTipGroupRef: MutableRefObject<Group>;
  currentSatellite: number;
  calculatedData: CalculatedData[];
  index: number;
  toolTipInnerSimpleDescriptionRef: MutableRefObject<HTMLDivElement>;
  fullDetails: boolean;
}) {
  let noradId: string | undefined = undefined;
  if (
    props.currentSatellite !== -1 &&
    props.fullDetails &&
    props.calculatedData[props.index] &&
    props.calculatedData[props.index].satellitePositions &&
    props.calculatedData[props.index].satellitePositions[props.currentSatellite]
  ) {
    noradId =
      props.calculatedData[props.index].satellitePositions[
        props.currentSatellite
      ].id;
  }

  return (
    <>
      <ToolTip
        groupRef={props.toolTipGroupRef}
        currentSatellite={props.currentSatellite}
        calculatedData={props.calculatedData}
        index={props.index}
        toolTipInnerSimpleDescriptionRef={
          props.toolTipInnerSimpleDescriptionRef
        }
        fullDetails
        noradId={noradId}
      />
      <Suspense fallback={<></>}>
        <SatellitePath noradId={noradId} />
      </Suspense>
    </>
  );
}

function descriptionTemplate(
  satPositions: SatelliteWithCartesian[],
  currentSatellite: number,
  altitudeFactor: number,
) {
  return `
Velocity: ${satPositions[currentSatellite].velocity?.toFixed(2) || ""} Km/s
<br/>Lat: ${satPositions[currentSatellite].latitude.toFixed(2)}°
<br/>Lon: ${satPositions[currentSatellite].longitude.toFixed(2)}°
<br/>Alt: ${((satPositions[currentSatellite].altitude - EARTH_RADIUS) / (altitudeFactor * 0.0001)).toFixed(2)} Km
`;
}

export function ToolTipUpdate(
  toolTipGroupRef: MutableRefObject<Group>,
  currentSatellite: number,
  satPositions: SatelliteWithCartesian[],
  satelliteHtmlRef: MutableRefObject<HTMLDivElement>,
  buffers: CalculatedData[],
  index: number,
  altitudeFactor: number,
) {
  if (
    toolTipGroupRef.current &&
    currentSatellite !== -1 &&
    satPositions[currentSatellite]
  ) {
    toolTipGroupRef.current.position.set(
      satPositions[currentSatellite].x,
      satPositions[currentSatellite].y,
      satPositions[currentSatellite].z,
    );
  }
  if (
    satelliteHtmlRef.current &&
    buffers[index].satellitePositions &&
    currentSatellite !== -1 &&
    satPositions[currentSatellite]
  ) {
    if (currentSatellite !== -1) {
      satelliteHtmlRef.current.innerHTML = descriptionTemplate(
        satPositions,
        currentSatellite,
        altitudeFactor,
      );
    } else {
      satelliteHtmlRef.current.innerHTML = "No satellite selected";
    }
  }
}
