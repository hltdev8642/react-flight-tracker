import {useRecoilState} from "recoil";
import {graphicOptionsState,} from "../../atoms.ts";
import {useState} from "react";
import {Checkbox, Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import SettingsIcon from '@mui/icons-material/Settings';

export function GraphicOptions() {
    const [graphicOptions, setGraphicOptions] = useRecoilState(graphicOptionsState);
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    <SettingsIcon/>
                </ListItemIcon>
                <ListItemText primary="Graphic Options"/>
                {open ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem sx={{pl: 4}}>
                        <ListItemText primary="Bloom"/>
                        <Checkbox
                            checked={graphicOptions.bloom}
                            onChange={(e) => setGraphicOptions({
                                    ...graphicOptions,
                                    bloom: e?.target?.checked
                                }
                            )}
                            inputProps={{'aria-label': 'controlled'}}
                        />
                    </ListItem>
                    <ListItem sx={{pl: 4}}>
                        <ListItemText primary="Vignette"/>
                        <Checkbox
                            checked={graphicOptions.vignette}
                            onChange={(e) => setGraphicOptions({
                                    ...graphicOptions,
                                    vignette: e?.target?.checked
                                }
                            )}
                            inputProps={{'aria-label': 'controlled'}}
                        />
                    </ListItem>
                    <ListItem sx={{pl: 4}}>
                        <ListItemText primary="SMAA"/>
                        <Checkbox
                            checked={graphicOptions.SMAA}
                            onChange={(e) => setGraphicOptions({
                                    ...graphicOptions,
                                    SMAA: e?.target?.checked
                                }
                            )}
                            inputProps={{'aria-label': 'controlled'}}
                        />
                    </ListItem>
                    <ListItem sx={{pl: 4}}>
                        <ListItemText primary="Stars"/>
                        <Checkbox
                            checked={graphicOptions.stars}
                            onChange={(e) => setGraphicOptions({
                                    ...graphicOptions,
                                    stars: e?.target?.checked

                                }
                            )}
                            inputProps={{'aria-label': 'controlled'}}
                        />
                    </ListItem>
                    <ListItem sx={{pl: 4}}>
                        <ListItemText primary="Country Borders"/>
                        <Checkbox
                            checked={graphicOptions.countryBorders}
                            onChange={(e) => setGraphicOptions({
                                    ...graphicOptions,
                                    countryBorders: e?.target?.checked
                                }
                            )}
                            inputProps={{'aria-label': 'controlled'}}
                        />
                    </ListItem>
                    <ListItem sx={{pl: 4}}>
                        <ListItemText primary="High Resolution Earth"/>
                        <Checkbox
                            checked={graphicOptions.highResolutionEarth}
                            onChange={(e) => setGraphicOptions({
                                    ...graphicOptions,
                                    highResolutionEarth: e?.target?.checked
                                }
                            )}
                            inputProps={{'aria-label': 'controlled'}}
                        />
                    </ListItem>
                </List>
            </Collapse>
        </>
    )
}