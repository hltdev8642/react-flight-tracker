import {useRecoilState} from "recoil";
import {miscellaneousOptionsState,} from "../../atoms.ts";
import {useState} from "react";
import {Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import Slider from '@mui/material/Slider';

export function Miscellaneous() {
    const [miscellaneousOption, setMiscellaneousOption] = useRecoilState(miscellaneousOptionsState);
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    <InboxIcon/>
                </ListItemIcon>
                <ListItemText primary="Miscellaneous"/>
                {open ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem sx={{pl: 4}}>
                        <ListItemText primary="Altitude Factor"/>
                        <Slider
                            value={miscellaneousOption.altitudeFactor}
                            onChange={(_, value) => setMiscellaneousOption({
                                ...miscellaneousOption,
                                altitudeFactor: value as number
                            })}
                            min={1}
                            max={10}
                            step={0.1}
                            marks={
                                [
                                    {value: 1, label: 'Real'},

                                ]
                            }
                            valueLabelDisplay="auto"
                        />
                    </ListItem>

                </List>
            </Collapse>
        </>
    )
}