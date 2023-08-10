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
import InboxIcon from "@mui/icons-material/MoveToInbox";
import {calculateSunPosition, toDegrees} from "../../astronomy-utils.tsx";

export function SunAstronomy() {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };


    const [sunPosition, setSunPosition] = useState(calculateSunPosition(new Date(Date.now())));
    // update every 10 seconds
    setInterval(() => {
        setSunPosition(calculateSunPosition(new Date(Date.now())))
    }, 10000)


    return (
        <>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    <InboxIcon/>
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
                                <TableCell>{sunPosition.r} AU</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Elliptical Longitude</TableCell>
                                <TableCell>{toDegrees(sunPosition.lon)} °</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Elliptical Latitude</TableCell>
                                <TableCell>{toDegrees(sunPosition.lat)} °</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Equatorial Coordinates</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>xeq</TableCell>
                                <TableCell>{sunPosition.xeq}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>yeq</TableCell>
                                <TableCell>{sunPosition.yeq}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>zeq</TableCell>
                                <TableCell>{sunPosition.zeq}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Right Ascension</TableCell>
                                <TableCell>{toDegrees(sunPosition.ra)} °</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Declination</TableCell>
                                <TableCell>{toDegrees(sunPosition.dec)} °</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </List>
            </Collapse>
        </>
    )
}