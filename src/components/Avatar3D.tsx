import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function Character({ isSpeaking }: { isSpeaking: boolean }) {
  const headRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (headRef.current) {
      // Nodding when speaking
      headRef.current.rotation.x = isSpeaking ? Math.sin(t * 15) * 0.05 : 0;
      headRef.current.rotation.y = Math.sin(t * 1.5) * 0.1;
    }

    if (rightArmRef.current && leftArmRef.current) {
      // Arm resting splay
      rightArmRef.current.rotation.z = Math.sin(t * 2) * 0.05 + 0.15;
      leftArmRef.current.rotation.z = -Math.sin(t * 2) * 0.05 - 0.15;
      
      // Arm movement when speaking
      if (isSpeaking) {
         rightArmRef.current.rotation.x = Math.sin(t * 10) * 0.2;
         leftArmRef.current.rotation.x = Math.sin(t * 10 + Math.PI) * 0.2;
      } else {
         rightArmRef.current.rotation.x = Math.sin(t * 2) * 0.05;
         leftArmRef.current.rotation.x = -Math.sin(t * 2) * 0.05;
      }
    }
  });

  // Colors based on the uploaded 2D reference
  const skinColor = "#fcdcb4";
  const shirtColor = "#8a3333"; // Maroon
  const pantsColor = "#2c3e50"; // Dark Blue/Grey
  const hairColor = "#2a2a2a"; // Dark Brown/Black
  const shoeColor = "#4a3020"; // Brown

  return (
    <group scale={1.4} position={[0, -1.3, 0]}>
      {/* Head Group */}
      <group position={[0, 1.8, 0]} ref={headRef}>
        {/* Face */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.55, 0.65, 0.55]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        {/* Hair Top */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.6, 0.2, 0.6]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>
        {/* Hair Back/Sides */}
        <mesh position={[0, 0.2, -0.05]}>
          <boxGeometry args={[0.61, 0.4, 0.52]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>
        {/* Beard */}
        <mesh position={[0, -0.25, 0.28]}>
          <boxGeometry args={[0.58, 0.2, 0.1]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>
        {/* Mustache */}
        <mesh position={[0, -0.1, 0.28]}>
          <boxGeometry args={[0.3, 0.06, 0.12]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.12, 0.05, 0.28]}>
          <boxGeometry args={[0.06, 0.1, 0.05]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        <mesh position={[0.12, 0.05, 0.28]}>
          <boxGeometry args={[0.06, 0.1, 0.05]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        {/* Smile (Mouth inside beard) */}
        <mesh position={[0, -0.18, 0.3]}>
          <boxGeometry args={[0.15, 0.04, 0.05]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>

      {/* Torso */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.7, 0.9, 0.35]} />
        <meshStandardMaterial color={shirtColor} roughness={0.8} />
      </mesh>

      {/* Arms */}
      <group position={[-0.45, 1.4, 0]} ref={rightArmRef}>
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[0.2, 0.85, 0.2]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
        {/* Sleeve */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.25, 0.35, 0.25]} />
          <meshStandardMaterial color={shirtColor} roughness={0.8} />
        </mesh>
      </group>

      <group position={[0.45, 1.4, 0]} ref={leftArmRef}>
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[0.2, 0.85, 0.2]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
        {/* Sleeve */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.25, 0.35, 0.25]} />
          <meshStandardMaterial color={shirtColor} roughness={0.8} />
        </mesh>
      </group>

      {/* Legs */}
      <mesh position={[-0.18, 0.25, 0]}>
        <boxGeometry args={[0.3, 0.7, 0.3]} />
        <meshStandardMaterial color={pantsColor} roughness={0.9} />
      </mesh>
      <mesh position={[0.18, 0.25, 0]}>
        <boxGeometry args={[0.3, 0.7, 0.3]} />
        <meshStandardMaterial color={pantsColor} roughness={0.9} />
      </mesh>

      {/* Shoes */}
      <mesh position={[-0.18, -0.15, 0.05]}>
        <boxGeometry args={[0.33, 0.15, 0.4]} />
        <meshStandardMaterial color={shoeColor} roughness={0.6} />
      </mesh>
      <mesh position={[0.18, -0.15, 0.05]}>
        <boxGeometry args={[0.33, 0.15, 0.4]} />
        <meshStandardMaterial color={shoeColor} roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function Avatar3D({ isSpeaking = false }: { isSpeaking?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 1.5, 4.2], fov: 45 }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.8} color="#ffffff" />
      <pointLight position={[-5, 2, 5]} intensity={1} color="#ffcccc" />
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.4}>
        <Character isSpeaking={isSpeaking} />
      </Float>
      <Sparkles count={40} scale={5} size={2} speed={0.4} color="#ff3b3b" opacity={0.6} />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        maxPolarAngle={Math.PI / 2 + 0.1} 
        minPolarAngle={Math.PI / 2 - 0.5}
        minAzimuthAngle={-0.5}
        maxAzimuthAngle={0.5}
      />
    </Canvas>
  );
}
