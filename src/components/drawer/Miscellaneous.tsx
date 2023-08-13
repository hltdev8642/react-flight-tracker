import {useRecoilState} from "recoil";
import {CAMERA_TARGETS, cameraTargetState, isAnimationRunningState, miscellaneousOptionsState,} from "../../atoms.ts";
import {useState} from "react";
import {
    Checkbox,
    Collapse,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import Slider from '@mui/material/Slider';

export function Miscellaneous() {
    const [miscellaneousOption, setMiscellaneousOption] = useRecoilState(miscellaneousOptionsState);
    const [open, setOpen] = useState(false);
    const [cameraTarget, setCameraTarget] = useRecoilState(cameraTargetState);
    const [isAnimationRunning,] = useRecoilState(isAnimationRunningState)
    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    <MiscellaneousServicesIcon/>
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
                    <ListItem sx={{pl: 4}}>
                        <ListItemText primary="Annotations"/>
                        <Checkbox checked={miscellaneousOption.enableAnnotations}
                                  onChange={(_, checked) => setMiscellaneousOption({
                                          ...miscellaneousOption,
                                          enableAnnotations: checked
                                      }
                                  )}
                                  disabled={isAnimationRunning}
                        />

                    </ListItem>

                    <ListItem sx={{pl: 4}}>
                        <ListItemText primary="Camera Target"/>
                        <ToggleButtonGroup
                            value={cameraTarget}
                            exclusive
                            disabled={isAnimationRunning}
                            onChange={
                                (_, value: CAMERA_TARGETS) => {
                                    if (value != cameraTarget) {
                                        setCameraTarget(value)
                                    }
                                }
                            }
                            aria-label="text alignment"
                        >
                            {
                                [
                                    {value: 'sun', label: 'Sun'},
                                    {value: 'earth', label: 'Earth'},
                                    {value: 'moon', label: 'Moon'},
                                ]
                                    .map(({value, label}) => (
                                        <ToggleButton value={value} aria-label={label}
                                                      key={value}
                                        >
                                            {label}
                                        </ToggleButton>
                                    ))

                            }
                        </ToggleButtonGroup>
                    </ListItem>

                </List>
            </Collapse>
        </>
    )
}