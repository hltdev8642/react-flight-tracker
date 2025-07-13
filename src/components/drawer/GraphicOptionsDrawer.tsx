import { useRecoilState } from "recoil";
import {
  GraphicOptions,
  graphicOptionsOptions,
  graphicOptionsState,
} from "../../atoms.ts";
import { useState } from "react";
import {
  Checkbox,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";
import Slider from "@mui/material/Slider";

export function GraphicOptionsDrawer() {
  const [graphicOptionsS, setGraphicOptions] =
    useRecoilState(graphicOptionsState);
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };

  function getGraphicOptionsValue(graphicOptions: GraphicOptions) {
    const index = Object.values(graphicOptionsOptions).findIndex((value) => {
      return JSON.stringify(value) === JSON.stringify(graphicOptions);
    });
    if (index === -1) {
      return "custom";
    }
    return Object.keys(graphicOptionsOptions)[index];
  }

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Graphic Options" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <ToggleButtonGroup
              value={getGraphicOptionsValue(graphicOptionsS)}
              exclusive
              aria-label="text alignment"
            >
              {[
                { value: "low", label: "low" },
                { value: "medium", label: "med" },
                { value: "high", label: "high" },
                { value: "ultra", label: "ultra" },
                { value: "custom", label: "custom" },
              ].map((value) => {
                return (
                  <ToggleButton
                    key={value.value}
                    value={value.value}
                    aria-label={value.label}
                    onClick={(
                      _e: React.MouseEvent<HTMLElement>,
                      value: string | null,
                    ) => {
                      if (value === "custom") {
                        return;
                      }
                      const v: keyof typeof graphicOptionsOptions =
                        value as keyof typeof graphicOptionsOptions;
                      setGraphicOptions(graphicOptionsOptions[v]);
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: "0.8rem",
                        color: "white",
                      }}
                    >
                      {value.label}
                    </Typography>
                  </ToggleButton>
                );
              })}
            </ToggleButtonGroup>
          </ListItem>
          <ListItem sx={{ pl: 4 }}>
            <ListItemText primary="Bloom" />
            <Checkbox
              checked={graphicOptionsS.bloom}
              onChange={(e) =>
                setGraphicOptions({
                  ...graphicOptionsS,
                  bloom: e?.target?.checked,
                })
              }
              inputProps={{ "aria-label": "controlled" }}
            />
          </ListItem>
          <ListItem sx={{ pl: 4 }}>
            <ListItemText primary="Vignette" />
            <Checkbox
              checked={graphicOptionsS.vignette}
              onChange={(e) =>
                setGraphicOptions({
                  ...graphicOptionsS,
                  vignette: e?.target?.checked,
                })
              }
              inputProps={{ "aria-label": "controlled" }}
            />
          </ListItem>
          <ListItem sx={{ pl: 4 }}>
            <ListItemText primary="SMAA" />
            <Checkbox
              checked={graphicOptionsS.SMAA}
              onChange={(e) =>
                setGraphicOptions({
                  ...graphicOptionsS,
                  SMAA: e?.target?.checked,
                })
              }
              inputProps={{ "aria-label": "controlled" }}
            />
          </ListItem>
          <ListItem sx={{ pl: 4 }}>
            <ListItemText primary="Stars" />
            <Checkbox
              checked={graphicOptionsS.stars}
              onChange={(e) =>
                setGraphicOptions({
                  ...graphicOptionsS,
                  stars: e?.target?.checked,
                })
              }
              inputProps={{ "aria-label": "controlled" }}
            />
          </ListItem>
          <ListItem sx={{ pl: 4 }}>
            <ListItemText primary="Country Borders" />
            <Checkbox
              checked={graphicOptionsS.countryBorders}
              onChange={(e) =>
                setGraphicOptions({
                  ...graphicOptionsS,
                  countryBorders: e?.target?.checked,
                })
              }
              inputProps={{ "aria-label": "controlled" }}
            />
          </ListItem>
          <ListItem sx={{ pl: 4 }}>
            <ListItemText primary="High Resolution Earth" />
            <Checkbox
              checked={graphicOptionsS.highResolutionEarth}
              onChange={(e) =>
                setGraphicOptions({
                  ...graphicOptionsS,
                  highResolutionEarth: e?.target?.checked,
                })
              }
              inputProps={{ "aria-label": "controlled" }}
            />
          </ListItem>
          <ListItem sx={{ pl: 4 }}>
            <ListItemText primary="Enable Moon" />
            <Checkbox
              checked={graphicOptionsS.enableMoon}
              onChange={(e) =>
                setGraphicOptions({
                  ...graphicOptionsS,
                  enableMoon: e?.target?.checked,
                })
              }
              inputProps={{ "aria-label": "controlled" }}
            />
          </ListItem>
          <ListItem sx={{ pl: 4 }}>
            <ListItemText primary="Satellite Path Resolution" />
            <Slider
              value={graphicOptionsS.satellitePathResolution}
              onChange={(_: Event, value: number | number[]) =>
                setGraphicOptions({
                  ...graphicOptionsS,
                  satellitePathResolution: value as number,
                })
              }
              min={1}
              max={500}
              step={50}
              valueLabelDisplay="auto"
            />
          </ListItem>
        </List>
      </Collapse>
    </>
  );
}
