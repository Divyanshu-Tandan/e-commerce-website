"use client";

import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import { useEffect } from "react";
import * as THREE from "three";

export default function Model({ config }) {
    const obj = useLoader(OBJLoader, config.path);

    useEffect(() => {
        if (obj) {
            obj.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshPhysicalMaterial({
                        color: 0x3b82f6, // Blue to match the gradient theme
                        metalness: 0.8,
                        roughness: 0.2,
                        clearcoat: 1.0,
                        clearcoatRoughness: 0.1,
                    });
                }
            });
        }
    }, [obj]);

    return (
        <primitive
            object={obj}
            scale={config.scale}
            position={config.position}
            rotation={config.rotation}
        />
    );
}