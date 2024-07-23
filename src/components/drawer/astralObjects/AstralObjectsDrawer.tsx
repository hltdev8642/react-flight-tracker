import { useState } from "react";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { MoonAstronomy } from "./MoonAstronomy.tsx";
import { SunAstronomy } from "./SunAstronomy.tsx";

export function AstralObjectsDrawer() {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <AutoAwesomeIcon />
        </ListItemIcon>
        <ListItemText primary="Astral Objects" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" sx={{ pl: 2 }}>
          <MoonAstronomy />
          <SunAstronomy />
        </List>
      </Collapse>
    </>
  );
}
