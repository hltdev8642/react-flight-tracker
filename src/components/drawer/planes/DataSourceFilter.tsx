// Removed unused imports
import { useEffect, useState } from "react";
import {
  Avatar,
  Checkbox,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SourceIcon from "@mui/icons-material/Source";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import FAA from "../../../assets/FAA_LOGO.png";
import ADSB from "../../../assets/ADSB.png";

export function DataSourceFilter(props: { disabled: boolean }) {
  // const [liveFlightsOptions, setLiveFlightsOptions] = useRecoilState(liveFlightsOptionsState);
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (props.disabled) {
      setOpen(false);
    }
  }, [props.disabled]);

  return (
    <>
      <ListItemButton onClick={handleClick} disabled={props.disabled}>
        <ListItemIcon>
          <SourceIcon />
        </ListItemIcon>
        <ListItemText primary="Data Sources" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem sx={{ pl: 4 }}>
            <ListItemIcon>
              <Avatar src={FAA} sx={{ width: 24, height: 24 }} />
            </ListItemIcon>
            <ListItemText primary="FAA" />
            {/* FAA not supported in ADSB.lol, keep for UI only if needed */}
            <Checkbox checked={false} disabled inputProps={{ "aria-label": "controlled" }} />
          </ListItem>
          <ListItem sx={{ pl: 4 }}>
            <ListItemIcon>
              <Avatar src={ADSB} sx={{ width: 24, height: 24 }} />
            </ListItemIcon>
            <ListItemText primary="ADS-B" />
            {/* ADSB is always true for ADSB.lol */}
            <Checkbox checked disabled inputProps={{ "aria-label": "controlled" }} />
          </ListItem>
          <ListItem sx={{ pl: 4 }}>
            <ListItemIcon>
              <Avatar sx={{ width: 24, height: 24 }} />
            </ListItemIcon>
            <ListItemText primary="FLARM" />
            {/* FLARM not supported in ADSB.lol */}
            <Checkbox checked={false} disabled inputProps={{ "aria-label": "controlled" }} />
          </ListItem>
          <ListItem sx={{ pl: 4 }}>
            <ListItemIcon>
              <Avatar sx={{ width: 24, height: 24 }} />
            </ListItemIcon>
            <ListItemText primary="MLAT" />
            {/* MLAT not supported in ADSB.lol */}
            <Checkbox checked={false} disabled inputProps={{ "aria-label": "controlled" }} />
          </ListItem>
          <ListItem sx={{ pl: 4 }}>
            <ListItemIcon>
              <Avatar sx={{ width: 24, height: 24 }} />
            </ListItemIcon>
            <ListItemText primary="satellite" />
            {/* Satellite not supported in ADSB.lol */}
            <Checkbox checked={false} disabled inputProps={{ "aria-label": "controlled" }} />
          </ListItem>
        </List>
      </Collapse>
    </>
  );
}
