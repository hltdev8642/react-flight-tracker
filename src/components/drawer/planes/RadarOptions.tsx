// Removed unused imports
import { useEffect, useState } from "react";
import {
  Checkbox,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import RadarIcon from "@mui/icons-material/Radar";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

export function RadarOptions(props: { disabled: boolean }) {
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
          <RadarIcon />
        </ListItemIcon>
        <ListItemText primary="Radar Options" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem sx={{ pl: 4 }}>
            <ListItemText primary="Gliders" />
            {/* Gliders not supported in ADSB.lol */}
            <Checkbox checked={false} disabled inputProps={{ "aria-label": "controlled" }} />
          </ListItem>
          <ListItem sx={{ pl: 4 }}>
            <ListItemText primary="inAir" />
            {/* inAir not supported in ADSB.lol */}
            <Checkbox checked={false} disabled inputProps={{ "aria-label": "controlled" }} />
          </ListItem>
          <ListItem sx={{ pl: 4 }}>
            <ListItemText primary="onGround" />
            {/* onGround not supported in ADSB.lol */}
            <Checkbox checked={false} disabled inputProps={{ "aria-label": "controlled" }} />
          </ListItem>

          <ListItem sx={{ pl: 4 }}>
            <ListItemText primary="Inactive" />
            {/* Inactive not supported in ADSB.lol */}
            <Checkbox checked={false} disabled inputProps={{ "aria-label": "controlled" }} />
          </ListItem>
          <ListItem sx={{ pl: 4 }}>
            <ListItemText primary="Estimated Positions" />
            {/* Estimated positions not supported in ADSB.lol */}
            <Checkbox checked={false} disabled inputProps={{ "aria-label": "controlled" }} />
          </ListItem>
        </List>
      </Collapse>
    </>
  );
}
