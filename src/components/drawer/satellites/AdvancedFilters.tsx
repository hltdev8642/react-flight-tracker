import { useRecoilState } from "recoil";
import { satelliteFilterOptionsState } from "../../../atoms.ts";
import { useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { satelliteApi } from "../../../utils.ts";

export function AdvancedFilters() {
  const [open, setOpen] = useState(true);
  const handleClick = () => {
    setOpen(!open);
  };

  const [satelliteFilterOptions, setSatelliteFilterOptions] = useRecoilState(
    satelliteFilterOptionsState,
  );

  const { data: groups, isLoading: isGroupsLoading } = useQuery({
    queryKey: ["satellite-groups"],
    queryFn: () => satelliteApi.satelliteServiceGetSatelliteGroups(),
    cacheTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60,
  });

  return (
    <>
      <ListItemButton onClick={handleClick}>
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
              loading={isGroupsLoading}
              options={groups?.data.groups || []}
              fullWidth
              title="Satellite Groups"
              onChange={(_, value) => {
                if (value && Array.isArray(value)) {
                  setSatelliteFilterOptions({
                    ...satelliteFilterOptions,
                    groups: value,
                  });
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="Select Groups"
                />
              )}
            />
          </ListItem>
        </List>
      </Collapse>
    </>
  );
}
