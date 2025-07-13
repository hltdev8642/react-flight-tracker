import { useRecoilState } from "recoil";
import { liveFlightsOptionsState } from "../../../atoms.ts";
import { useEffect, useState } from "react";
import {
  Autocomplete,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
// import { useQuery } from "@tanstack/react-query";


export function AdvancedFilters(props: { disabled: boolean }) {
  const [liveFlightsOptions, setLiveFlightsOptions] = useRecoilState(
    liveFlightsOptionsState,
  );
  const [open, setOpen] = useState(false);
  // ADSB.lol does not provide airline/airport lists. Remove these queries or replace with static options if needed.
  const airlines: any[] = [];
  const isAirlinesLoading = false;
  const airports: any[] = [];
  const isAirportsLoading = false;
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
          <FilterAltIcon />
        </ListItemIcon>
        <ListItemText primary="Advanced Filters" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem sx={{ pl: 4 }}>
            <Autocomplete
              multiple
              id="tags-standard"
              loading={isAirlinesLoading}
              options={airlines}
              getOptionLabel={(option) => option.Name || ""}
              fullWidth
              title="Airlines"
              onChange={(_, value) => {
                setLiveFlightsOptions({
                  ...liveFlightsOptions,
                  filters: {
                    ...liveFlightsOptions.filters,
                    airline: value.map((a) => a.ICAO) || undefined,
                  },
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="Select Airlines"
                />
              )}
            />
          </ListItem>
          <ListItem sx={{ pl: 4 }}>
            <Autocomplete
              multiple
              id="tags-standard"
              loading={isAirportsLoading}
              options={airports}
              getOptionLabel={(option) => option.name || ""}
              fullWidth
              title="Airports"
              onChange={(_, value) => {
                setLiveFlightsOptions({
                  ...liveFlightsOptions,
                  filters: {
                    ...liveFlightsOptions.filters,
                    airport: value.map((a) => a.iata) || undefined,
                  },
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="Select Airports"
                />
              )}
            />
          </ListItem>
        </List>
      </Collapse>
    </>
  );
}
