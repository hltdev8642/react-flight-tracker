import {List} from "@mui/material";
import {DataSourceFilter} from "./DataSourceFilter.tsx";
import {AdvancedFilters} from "./AdvancedFilters.tsx";
import {RadarOptions} from "./RadarOptions.tsx";
import {SelectedFlightData} from "./SelectedFlightData.tsx";
import {GraphicOptions} from "./GraphicOptions.tsx";
import {Miscellaneous} from "./Miscellaneous.tsx";

export function DrawerItems() {
    return (
        <List>
            <DataSourceFilter/>
            <RadarOptions/>
            <GraphicOptions/>
            <AdvancedFilters/>
            <SelectedFlightData/>
            <Miscellaneous/>
        </List>
    )
}