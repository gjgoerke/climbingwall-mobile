import React from "react";
import { View } from "react-native"
import { Canvas, useFrame } from "@react-three/fiber/native"
import { useRef, useState } from "react"
export default function Index() {

    return(
        <View style={{flex: 1}}>
            <Canvas 
            camera={{ position:[-2,2.5,5], fov: 30 }}
            gl={{ debug: { checkShaderErrors: false, onShaderError: null } }}>
                <color attach={"background"} args={["#512DA8"]} />
                
            </Canvas>
        </View>
    )
}