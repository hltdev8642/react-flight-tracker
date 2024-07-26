import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { flightRadarApi } from "../../../utils.ts";
import { selectedFlightState } from "../../../atoms.ts";
import { useRecoilValue } from "recoil";
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DataObjectIcon from "@mui/icons-material/DataObject";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

export function SelectedFlightData(props: { disabled: boolean }) {
  const selectedFlight = useRecoilValue(selectedFlightState);
  const { data } = useQuery({
    queryKey: ["flight", selectedFlight?.id],
    queryFn: () => flightRadarApi.fetchFlight(selectedFlight?.id || ""),
    enabled: !!selectedFlight,
  });
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
          <DataObjectIcon />
        </ListItemIcon>
        <ListItemText primary="Selected Flight JSON data" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout={0} unmountOnExit>
        <List component="div" disablePadding>
          <ListItem sx={{ pl: 4 }}>
            {<pre>{JSON.stringify(data, null, 2)}</pre>}
          </ListItem>
        </List>
      </Collapse>
    </>
  );
}
