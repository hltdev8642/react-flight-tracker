import {Html} from "@react-three/drei";
import {Vector3} from "three";
import "./Callout.css"
import {useFrame} from "@react-three/fiber";
import {useState} from "react";

export default function Callout(
    props: {
        position: Vector3,
        text: string,
    }
) {

    const [render, setRender] = useState(false)

    useFrame((camera) => {
            if (camera.camera.position.distanceTo(props.position) < 2.5) {
                setRender(true)
            } else {
                setRender(false)
            }
        }
    )

    if (!render) {
        return null
    }

    return (
        <Html position={props.position}
              visible={true}
        >
            <div className={'arrow_box'}>
                {props.text}
            </div>
        </Html>

    )


}