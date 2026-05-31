"use client";

import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import FuturisticParticles from "./FuturisticParticles";

function SceneContent() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
        <directionalLight position={[-10, -10, -10]} intensity={1} color="#eab308" />
        <FuturisticParticles />
        <Environment preset="city" />
        {/* We disable zoom and pan to keep it as a background */}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}

const Scene = dynamic(() => Promise.resolve(SceneContent), { ssr: false });
export default Scene;
