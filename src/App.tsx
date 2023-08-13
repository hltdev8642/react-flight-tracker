import {Divider, Drawer, Grid, IconButton,} from "@mui/material";
import {Suspense, useState} from "react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {useTheme} from '@mui/material/styles';
import Scene from "./components/3d/Scene.tsx";
import {DrawerItems} from "./components/drawer/DrawerItems.tsx";
import {Menu} from "@mui/icons-material";
import {Canvas} from "@react-three/fiber";
import {LoadingScreen} from "./LoadingScreen.tsx";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export function App() {
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
            <Grid>

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
                <Canvas
                    style={{
                        height: "100vh",
                    }}
                    camera={{
                        near: 0.1,
                        far: 100000000,
                    }
                    }
                    // shadows={true}
                >
                    <Suspense
                        fallback={<LoadingScreen/>}
                    >
                        <Scene/>
                    </Suspense>
                </Canvas>


            </Grid>
            <ToastContainer/>
        </>


    );
}