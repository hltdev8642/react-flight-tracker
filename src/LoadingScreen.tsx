import {Html, useProgress} from "@react-three/drei";
import {Grid, LinearProgress, Typography} from "@mui/material";
import {TypeAnimation} from "react-type-animation";
export function LoadingScreen() {
    const {active, progress} = useProgress()

    return <>
        <Html center>
            <Grid>
                <Grid item>
                    <LinearProgress

                        variant="determinate" value={progress}
                        color={"inherit"}
                        sx={{
                            width: "max(20vw, 200px)",
                            color: "white",
                        }
                        }
                    />
                </Grid>
                <Grid item>
                    <Typography
                        variant={"h5"}
                        sx={{
                            color: "white",
                            // add effect
                            textShadow: "0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #0ff, 0 0 70px #0ff, 0 0 80px #0ff, 0 0 100px #0ff, 0 0 150px #0ff",

                        }}
                    >
                        {
                            active ?
                                <TypeAnimation
                                    sequence={[
                                        "loading...",
                                        "Probably loading...",
                                        "Definitely loading...",
                                    ]}
                                />
                                :
                                "Doing javascript stuff..."
                        }
                    </Typography>

                </Grid>
            </Grid>
        </Html></>
}