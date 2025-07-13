import { Grid, Typography } from "@mui/material";
import { Suspense } from "react";
import Scene from "./components/3d/Scene.tsx";
import { Canvas } from "@react-three/fiber";
import { LoadingScreen } from "./LoadingScreen.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DrawerComponent from "./components/drawer/DrawerComponent.tsx";

export function App() {
  return (
    <>
      <DrawerComponent />
      <Grid>
        <Canvas
          gl={{ alpha: true, stencil: false, antialias: true, depth: true }}
          style={{
            height: "100vh",
          }}
          dpr={1}
          camera={{
            near: 0.01,
            far: 100000000,
          }}
        >
          <Suspense fallback={<LoadingScreen />}>
            <Scene />
          </Suspense>
        </Canvas>
      </Grid>
      <ToastContainer position="bottom-center" />
      <Typography
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          margin: "0.5em",
          color: "white",
          fontSize: "0.5em",
          opacity: 0.5,
        }}
      >
        v
        {import.meta.env.VITE_APP_VERSION ||
          import.meta.env.PACKAGE_VERSION ||
          "0.0.0"}
      </Typography>
    </>
  );
}
