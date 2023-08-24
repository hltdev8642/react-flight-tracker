import { List } from "@mui/material";
import { DataSourceFilter } from "./DataSourceFilter.tsx";
import { AdvancedFilters } from "./AdvancedFilters.tsx";
import { RadarOptions } from "./RadarOptions.tsx";
import { SelectedFlightData } from "./SelectedFlightData.tsx";
import { GraphicOptionsDrawer } from "./GraphicOptionsDrawer.tsx";
import { Miscellaneous } from "./Miscellaneous.tsx";
import { SunAstronomy } from "./SunAstronomy.tsx";
import { MoonAstronomy } from "./MoonAstronomy.tsx";

export function DrawerItems() {
  return (
    <List>
      <DataSourceFilter />
      <RadarOptions />
      <GraphicOptionsDrawer />
      <AdvancedFilters />
      <SelectedFlightData />
      <Miscellaneous />
      <SunAstronomy />
      <MoonAstronomy />
    </List>
  );
}
