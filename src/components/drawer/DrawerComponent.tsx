import {Divider, Drawer, IconButton} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {DrawerItems} from "./DrawerItems.tsx";
import {Menu} from "@mui/icons-material";
import {useTheme} from "@mui/material/styles";
import {useState} from "react";

export default function DrawerComponent() {
    let drawerWidth = "max(20vw, 350px)";
    if (window.innerWidth < 500) {
        drawerWidth = "100vw";
    }

    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    return (
        <>

            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                anchor="left"
                open={open}
                variant={"persistent"}
            >
                <IconButton
                    style={{
                        borderRadius: 0,
                    }}

                    onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                </IconButton>
                <Divider/>
                <DrawerItems/>
            </Drawer>

            <IconButton
                color="primary"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                size={
                    "large"
                }

                sx={{
                    ...(open && {display: 'none'}),
                    position: "absolute",
                    zIndex: 1000,
                    top: 0,
                    left: 0,
                    margin: theme.spacing(1),

                }}


            >
                <Menu
                    fontSize={"large"}

                />
            </IconButton>
        </>
    )
}