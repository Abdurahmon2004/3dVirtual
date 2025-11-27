import React, { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface HotspotProps {
    position: THREE.Vector3;
    label: string;
    onClick: () => void;
}

const Hotspot: React.FC<HotspotProps> = ({ position, label, onClick }) => {
    const [hovered, setHovered] = useState(false);
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (meshRef.current) {
            // Simple rotation
            meshRef.current.rotation.y += 0.005;
        }
    });

    return (
        <group position={position}>
            {/* Hotspot sphere */}
            <mesh
                ref={meshRef}
                onClick={onClick}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                scale={hovered ? 1.1 : 1}
            >
                <sphereGeometry args={[0.02, 12, 12]} />
                <meshBasicMaterial
                    color={"white"}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Hotspot ring */}
            <mesh
                onClick={onClick}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <ringGeometry args={[0.03, 0.05, 16]} />
                <meshBasicMaterial
                    color={"white"}
                    transparent
                    opacity={0.8}
                    side={THREE.DoubleSide}
                />
            </mesh>


        </group>
    );
};

export default Hotspot;
