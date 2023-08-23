import { Grid } from "@mui/material";
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
          style={{
            height: "100vh",
          }}
          camera={{
            near: 0.1,
            far: 100000000,
          }}
        >
          <Suspense fallback={<LoadingScreen />}>
            <Scene />
          </Suspense>
        </Canvas>
      </Grid>
      <ToastContainer position="bottom-center" />
    </>
  );
}
