"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, useProgress } from "@react-three/drei";
import Model from "./Model";
import { useState, useEffect, Suspense } from "react";

// Suppress the THREE.Clock deprecation warning caused by @react-three/fiber
// until the library updates to use THREE.Timer internally.
if (typeof console !== "undefined") {
    const originalWarn = console.warn;
    console.warn = (...args) => {
        if (args[0] && typeof args[0] === "string" && args[0].includes("THREE.Clock: This module has been deprecated")) {
            return;
        }
        originalWarn(...args);
    };
}

const MODEL_CONFIGS = [
    {
        name: "car",
        path: "/models/car.obj",
        scale: 0.009,
        position: [0, -0.5, 0],
        rotation: [0.1, -0.5, 0],
        minDistance: 5,
        maxDistance: 10,
    },
    {
        name: "controller",
        path: "/models/controller.obj",
        scale: 0.4,
        position: [0, 0, 0],
        rotation: [0.2, -0.5, 0],
        minDistance: 10,
        maxDistance: 23,
    },
    {
        name: "shoes",
        path: "/models/shoes.obj",
        scale: 16,
        position: [0, -2, 0],
        rotation: [0.2, -0.5, 0],
        minDistance: 10,
        maxDistance: 23,
    },
    {
        name: "PS5",
        path: "/models/ps5.obj",
        scale: 0.015,
        position: [0, -3, 0],
        rotation: [0, 0, 0],
        minDistance: 10,
        maxDistance: 23,
    },
];

function CanvasLoader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center bg-transparent">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        </Html>
    );
}

export default function Scene() {
    const [config, setConfig] = useState(null);

    useEffect(() => {
        // Allow selecting specific model via URL for testing (e.g., ?model=laptop)
        const urlParams = new URLSearchParams(window.location.search);
        const modelQuery = urlParams.get('model');

        if (modelQuery) {
            const found = MODEL_CONFIGS.find(c => c.name === modelQuery);
            if (found) {
                setConfig(found);
                return;
            }
        }

        // Pick a random model configuration on the client to avoid server-client hydration mismatch
        const randomIndex = Math.floor(Math.random() * MODEL_CONFIGS.length);
        setConfig(MODEL_CONFIGS[randomIndex]);
    }, []);

    // Wait until the random model is chosen
    if (!config) return null;

    return (
        <Canvas
            camera={{
                position: [0, 0, 5],
                fov: 50,
            }}
        >
            <ambientLight intensity={2} />
            <directionalLight position={[2, 2, 2]} />

            <Suspense fallback={<CanvasLoader />}>
                <Model config={config} />
            </Suspense>

            <OrbitControls
                enableZoom={true}
                minDistance={config.minDistance}
                maxDistance={config.maxDistance}
            />
        </Canvas>
    );
}