import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';

function FloatingFood({ position, color, speed = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time * speed) * 0.3;
      meshRef.current.rotation.y = Math.cos(time * speed) * 0.3;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

export default function FoodScene() {
  return (
    <div className="w-full h-full absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff6b6b" />

        {/* Floating food items */}
        <FloatingFood position={[-3, 2, 0]} color="#22c55e" speed={0.8} />
        <FloatingFood position={[3, -1, -2]} color="#f59e0b" speed={1.2} />
        <FloatingFood position={[0, -2, 1]} color="#ef4444" speed={1} />
        <FloatingFood position={[-2, -1, -1]} color="#8b5cf6" speed={0.9} />
        <FloatingFood position={[2, 2, -3]} color="#3b82f6" speed={1.1} />
      </Canvas>
    </div>
  );
}
