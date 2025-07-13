import { Grid, Typography } from "@mui/material";
import type { ADSBLolAircraft } from "../../../adsbLolApi";

export default function AircraftDetails({ aircraft }: { aircraft: ADSBLolAircraft }) {
  if (!aircraft) return null;
  return (
    <div className="annotationDescription">
      <Typography variant="h6" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
        {aircraft.flight || "N/A"} ({aircraft.hex})
      </Typography>
      <Grid container spacing={2} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
        <Grid item minWidth={160}>
          <b>Lat:</b> {aircraft.lat.toFixed(4)}
          <br />
          <b>Lon:</b> {aircraft.lon.toFixed(4)}
          <br />
          <b>Altitude:</b> {aircraft.alt_geom} ft
          <br />
          <b>Speed:</b> {aircraft.gs} kt
          <br />
          <b>Track:</b> {aircraft.track}°
        </Grid>
        <Grid item minWidth={160}>
          <b>Squawk:</b> {aircraft.squawk}
          <br />
          <b>Category:</b> {aircraft.category}
          <br />
          <b>Type:</b> {aircraft.t}
          <br />
          <b>Messages:</b> {aircraft.messages}
        </Grid>
      </Grid>
    </div>
  );
}
