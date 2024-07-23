import { useState } from "react";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { AdvancedFilters } from "./AdvancedFilters.tsx";
import SatelliteAltIcon from "@mui/icons-material/SatelliteAlt";

export function SatellitesDrawer() {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <SatelliteAltIcon />
        </ListItemIcon>
        <ListItemText primary="Satellites" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" sx={{ pl: 2 }}>
          <AdvancedFilters />
        </List>
      </Collapse>
    </>
  );
}
