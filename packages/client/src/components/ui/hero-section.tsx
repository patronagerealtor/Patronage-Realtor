import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Shape, ExtrudeGeometry, type Group } from "three";

// Shared geometry created once for all boxes (avoids creating 50 geometries every frame)
const shape = new Shape();
const angleStep = Math.PI * 0.5;
const radius = 1;
shape.absarc(2, 2, radius, angleStep * 0, angleStep * 1);
shape.absarc(-2, 2, radius, angleStep * 1, angleStep * 2);
shape.absarc(-2, -2, radius, angleStep * 2, angleStep * 3);
shape.absarc(2, -2, radius, angleStep * 3, angleStep * 4);
const extrudeSettings = {
  depth: 0.3,
  bevelEnabled: true,
  bevelThickness: 0.05,
  bevelSize: 0.05,
  bevelSegments: 12,
  curveSegments: 12,
};
const sharedGeometry = new ExtrudeGeometry(shape, extrudeSettings);
sharedGeometry.center();

const Box = React.memo(({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) => (
  <mesh geometry={sharedGeometry} position={position} rotation={rotation}>
    <meshPhysicalMaterial
      color="#232323"
      metalness={1}
      roughness={0.3}
      reflectivity={0.5}
      iridescence={1}
      iridescenceIOR={1.3}
      iridescenceThicknessRange={[100, 400]}
    />
  </mesh>
));

const BOX_COUNT = 18;
const GEOMETRY_SCALE = 1.6; // Resize the rotating group (larger = more prominent in hero)

const AnimatedBoxes = () => {
  const groupRef = useRef<Group | null>(null);
  const boxes = useMemo(
    () =>
      Array.from({ length: BOX_COUNT }, (_, index) => ({
        position: [(index - BOX_COUNT / 2) * 0.75, 0, 0] as [number, number, number],
        rotation: [(index - 5) * 0.1, Math.PI / 2, 0] as [number, number, number],
        id: index,
      })),
    []
  );

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef} scale={[GEOMETRY_SCALE, GEOMETRY_SCALE, GEOMETRY_SCALE]}>
      {boxes.map((box) => (
        <Box key={box.id} position={box.position} rotation={box.rotation} />
      ))}
    </group>
  );
};

const CAMERA_POSITION: [number, number, number] = [5, 5, 20];

export const Scene = () => (
  <div className="w-full h-full z-0 pointer-events-none">
    <Canvas
      camera={{ position: CAMERA_POSITION, fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={15} />
      <directionalLight position={[10, 10, 5]} intensity={15} />
      <AnimatedBoxes />
    </Canvas>
  </div>
);

