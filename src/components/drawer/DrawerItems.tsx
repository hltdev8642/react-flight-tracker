import { List } from "@mui/material";
import { GraphicOptionsDrawer } from "./GraphicOptionsDrawer.tsx";
import { Miscellaneous } from "./Miscellaneous.tsx";
import { AstralObjectsDrawer } from "./astralObjects/AstralObjectsDrawer.tsx";
import { PlanesDrawer } from "./planes/PlanesDrawer.tsx";
import { SatellitesDrawer } from "./satellites/SatellitesDrawer.tsx";

export function DrawerItems() {
  return (
    <List>
      <PlanesDrawer />
      <AstralObjectsDrawer />
      <SatellitesDrawer />
      <GraphicOptionsDrawer />
      <Miscellaneous />
    </List>
  );
}
