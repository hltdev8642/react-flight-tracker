import { Html, useProgress } from "@react-three/drei";
import { Grid, LinearProgress, Typography } from "@mui/material";
import { TypeAnimation } from "react-type-animation";

export function LoadingScreen() {
  const { active, progress } = useProgress();

  return (
    <>
      <Html center>
        <Grid>
          <Grid item>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={"inherit"}
              sx={{
                width: "max(30vw, 300px)",
                color: "white",
              }}
            />
          </Grid>
          <Grid item>
            <Typography
              variant={"h5"}
              sx={{
                color: "white",
                // add effect
              }}
            >
              {active || progress !== 100 ? (
                <TypeAnimation
                  repeat={Infinity}
                  sequence={[
                    "loading...",
                    5000,
                    "Probably loading...",
                    5000,
                    "Definitely loading...",
                    5000,
                    "Still loading...",
                    5000,
                    "Almost done...",
                    5000,
                    "Just a little more...",
                    5000,
                  ]}
                />
              ) : (
                "Building the world..."
              )}
            </Typography>
          </Grid>
        </Grid>
      </Html>
    </>
  );
}
