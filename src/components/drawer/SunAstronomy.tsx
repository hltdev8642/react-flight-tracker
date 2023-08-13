import {useState} from 'react';
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import {
    Collapse,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText, Table, TableBody, TableCell,
    TableRow,
} from "@mui/material";
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import {toDegrees} from "../../astronomy-utils.tsx";
import {useRecoilValue} from "recoil";
import {sunPositionState} from "../../atoms.ts";

export function SunAstronomy() {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };


    const sunPosition = useRecoilValue(sunPositionState)

    return (
        <>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    <WbSunnyIcon/>
                </ListItemIcon>
                <ListItemText primary="Sun Astronomy"/>
                {open ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Distance</TableCell>
                                <TableCell>{sunPosition.r.toFixed(5)} AU</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Elliptical Longitude</TableCell>
                                <TableCell>{toDegrees(sunPosition.ellipticLongitude).toFixed(5)} °</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Elliptical Latitude</TableCell>
                                <TableCell>{toDegrees(sunPosition.ellipticLatitude).toFixed(5)} °</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Equatorial Coordinates</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>xeq</TableCell>
                                <TableCell>{sunPosition.xeq.toFixed(5)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>yeq</TableCell>
                                <TableCell>{sunPosition.yeq.toFixed(5)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>zeq</TableCell>
                                <TableCell>{sunPosition.zeq.toFixed(5)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Right Ascension</TableCell>
                                <TableCell>{toDegrees(sunPosition.ra).toFixed(5)} °</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Declination</TableCell>
                                <TableCell>{toDegrees(sunPosition.dec).toFixed(5)} °</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Geo Coordinates</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Longitude</TableCell>
                                <TableCell>{toDegrees(sunPosition.geoLongitude).toFixed(5)} °</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Latitude</TableCell>
                                <TableCell>{toDegrees(sunPosition.geoLatitude).toFixed(5)} °</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </List>
            </Collapse>
        </>
    )
}