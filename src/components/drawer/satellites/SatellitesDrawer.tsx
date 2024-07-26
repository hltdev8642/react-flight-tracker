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
import { Enabled } from "../common/Enabled.tsx";
import { isSatellitesEnabledState } from "../../../atoms.ts";
import { useRecoilValue } from "recoil";

export function SatellitesDrawer() {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  const isSatellitesEnabled = useRecoilValue(isSatellitesEnabledState);
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
          <Enabled enabledState={isSatellitesEnabledState} />
          <AdvancedFilters disabled={!isSatellitesEnabled} />
        </List>
      </Collapse>
    </>
  );
}
