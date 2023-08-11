import { useState} from 'react';
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import {
    Collapse,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText, Table, TableBody, TableCell,
    TableRow,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { rightAscensionAndDeclinationToGeoCoordinates, toDegrees} from "../../astronomy-utils.tsx";
import {useRecoilValue} from "recoil";
import {moonPositionState} from "../../atoms.ts";

export function MoonAstronomy() {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };


    const MoonPosition = useRecoilValue(moonPositionState)
    const geoCoordinates = rightAscensionAndDeclinationToGeoCoordinates(MoonPosition.ra, MoonPosition.dec,
        new Date(Date.now())
    );


    return (
        <>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    <InboxIcon/>
                </ListItemIcon>
                <ListItemText primary="Moon Astronomy"/>
                {open ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Distance</TableCell>
                                <TableCell>{MoonPosition.r.toFixed(5)} Earth Radii</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Elliptical Longitude</TableCell>
                                <TableCell>{toDegrees(MoonPosition.lon).toFixed(5)} °</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Elliptical Latitude</TableCell>
                                <TableCell>{toDegrees(MoonPosition.lat).toFixed(5)} °</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Equatorial Coordinates</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>xeq</TableCell>
                                <TableCell>{MoonPosition.xeq.toFixed(5)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>yeq</TableCell>
                                <TableCell>{MoonPosition.yeq.toFixed(5)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>zeq</TableCell>
                                <TableCell>{MoonPosition.zeq.toFixed(5)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Right Ascension</TableCell>
                                <TableCell>{toDegrees(MoonPosition.ra).toFixed(5)} °</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Declination</TableCell>
                                <TableCell>{toDegrees(MoonPosition.dec).toFixed(5)} °</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Geo Coordinates</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Longitude</TableCell>
                                <TableCell>{toDegrees(geoCoordinates.lon).toFixed(5)} °</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Latitude</TableCell>
                                <TableCell>{toDegrees(geoCoordinates.lat).toFixed(5)} °</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </List>
            </Collapse>
        </>
    )
}