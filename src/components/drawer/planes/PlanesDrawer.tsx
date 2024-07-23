import { useState } from "react";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { DataSourceFilter } from "./DataSourceFilter.tsx";
import { RadarOptions } from "./RadarOptions.tsx";
import { SelectedFlightData } from "./SelectedFlightData.tsx";
import { AdvancedFilters } from "./AdvancedFilters.tsx";

export function PlanesDrawer() {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <FlightTakeoffIcon />
        </ListItemIcon>
        <ListItemText primary="Planes" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" sx={{ pl: 2 }}>
          <DataSourceFilter />
          <RadarOptions />
          <AdvancedFilters />
          <SelectedFlightData />
        </List>
      </Collapse>
    </>
  );
}
