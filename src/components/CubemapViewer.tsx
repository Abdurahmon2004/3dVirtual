import React, { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

interface HotspotType {
    id: string;
    label: string;
    position: { x: number; y: number; z: number };
    targetRoom?: number | null;
}

interface Room {
    id: number;
    name: string;
    textures: string[];
    hotspots?: HotspotType[];
}

interface CubemapViewerProps {
    room?: Room | null;
    onLoad: () => void;
    onHotspotClick: (hotspot: HotspotType) => void;
}

const CubemapViewer: React.FC<CubemapViewerProps> = ({
    room,
    onLoad,
    onHotspotClick,
}) => {
    const [texture, setTexture] = useState<THREE.CubeTexture | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const { scene } = useThree();

    if (!room) return null;
    if (!room.textures || room.textures.length !== 6) return null;

    useEffect(() => {
        const loader = new THREE.CubeTextureLoader();
        setIsLoaded(false);

        const createFallbackTexture = () => {
            const colors = ["#2e7d32", "#f5f5f5", "#333", "#e0e0e0", "#2e7d32", "#f5f5f5"];
            const size = 512;
            const canvases = colors.map((color, index) => {
                const canvas = document.createElement("canvas");
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.fillStyle = color;
                    ctx.fillRect(0, 0, size, size);
                    ctx.fillStyle = "white";
                    ctx.font = "48px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(["Right", "Left", "Top", "Bottom", "Front", "Back"][index], size / 2, size / 2);
                    ctx.font = "24px Arial";
                    ctx.fillText(room.name ?? "Room", size / 2, size / 2 + 60);
                }
                return canvas;
            });
            const cubeTexture = new THREE.CubeTexture(canvases);
            cubeTexture.format = THREE.RGBAFormat;
            cubeTexture.type = THREE.UnsignedByteType;
            cubeTexture.colorSpace = THREE.SRGBColorSpace;
            cubeTexture.needsUpdate = true;
            return cubeTexture;
        };

        const loadTexture = async () => {
            try {
                const cubeTexture = await new Promise<THREE.CubeTexture>((resolve) => {
                    loader.load(
                        room.textures,
                        (texture) => {
                            texture.format = THREE.RGBAFormat;
                            texture.type = THREE.UnsignedByteType;
                            texture.minFilter = THREE.LinearFilter;
                            texture.magFilter = THREE.LinearFilter;
                            texture.colorSpace = THREE.SRGBColorSpace;
                            resolve(texture);
                        },
                        undefined,
                        () => resolve(createFallbackTexture())
                    );
                });
                setTexture(cubeTexture);
                setIsLoaded(true);
                onLoad();
            } catch (error) {
                console.error("Texture load error:", error);
                setTexture(createFallbackTexture());
                setIsLoaded(true);
                onLoad();
            }
        };

        loadTexture();
    }, [room]);

    useEffect(() => {
        if (texture) {
            scene.background = texture;
        }
    }, [texture, scene]);

    if (!isLoaded || !texture) return null;

    return (
        <>
            {room.hotspots?.map((hotspot) => (
                <mesh
                    key={hotspot.id}
                    position={[hotspot.position.x, hotspot.position.y, hotspot.position.z]}
                    onClick={() => onHotspotClick(hotspot)}
                >
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshStandardMaterial color="orange" />
                    <Html center>
                        <div >
                            <svg
                                width="50"
                                height="50"
                                viewBox="0 0 46 46"
                                className="cursor-pointer"
                                style={{
                                    transition: "transform 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                }}
                            >
                                <circle cx="23" cy="23" r="21" strokeWidth="2" fill="white" />
                                <path
                                    d="M23.9 6c1.62 0 2.934 1.335 2.934 2.982 0 1.646-1.314 2.981-2.934 2.981s-2.933-1.335-2.933-2.981C20.967 7.335 22.281 6 23.9 6zm8.855 30.05c-.032-.173-2.737-7.825-2.737-7.825l-4.085-4.23v-8.583c0-1.95-3.48-3.224-3.887-2.938-.267.188-6.387 4.049-6.387 4.049l-.649 6.57a1.331 1.331 0 0 0 1.307 1.526c.729-.001 1.32-.602 1.32-1.343l.546-5.003 3.041-1.8v7.498l5.58 5.47 2.848 7.5A1.62 1.62 0 0 0 31.164 38c.894 0 1.62-.737 1.62-1.646 0-.104 0-.15-.03-.304zm-18.368-1.067c-.24.288-.387.66-.387 1.067 0 .909.725 1.646 1.62 1.646a1.61 1.61 0 0 0 1.36-.756l4.953-6.513 1.523-3.424-2.504-2.385-1.851 3.84-4.714 6.525zm12.268-16.178s-.049 3.697 0 3.621c.044-.066 1.832 1.442 2.292 1.832a1.336 1.336 0 0 0 .107.091c.22.168.494.268.79.268.73 0 1.32-.6 1.32-1.342 0-.5-.267-.807-.667-1.165l-3.842-3.305z"
                                    fill="#000"
                                />
                            </svg>
                        </div>
                    </Html>
                </mesh>
            ))}
        </>
    );
};

export default CubemapViewer;
