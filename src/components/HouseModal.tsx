import React, { useState } from "react";
import { House } from "../types/House";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

interface HouseModalProps {
    house: House | null;
    onClose: () => void;
    onStartVirtualTour: (house: House) => void;
}

const DEFAULT_IMAGE = "http://localhost:3000/cubemap/home.jpg";

const ModelViewer: React.FC<{ modelPath: string }> = ({ modelPath }) => {
    const { scene } = useGLTF(modelPath);
    return <primitive object={scene} scale={1} />;
};

const HouseModal: React.FC<HouseModalProps> = ({
    house,
    onClose,
    onStartVirtualTour,
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [fullscreen, setFullscreen] = useState<null | number>(null);
    if (!house) return null;

    const isGLBFile =
        house.images[currentImageIndex] &&
        house.images[currentImageIndex].endsWith(".glb");

    // Fullscreen modal for images
    const renderFullscreen = (idx: number) => {
        const isGLB = house.images[idx] && house.images[idx].endsWith(".glb");
        return (
            <div className="fixed inset-0 z-[4000] flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
                <button
                    onClick={() => setFullscreen(null)}
                    className="absolute top-8 right-8 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg transition z-10"
                >
                    ✕
                </button>
                {/* Left arrow */}
                <button
                    onClick={() =>
                        setFullscreen(
                            idx === 0 ? house.images.length - 1 : idx - 1
                        )
                    }
                    className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center rounded-xl bg-blue-50 text-blue-400 hover:bg-blue-100 transition z-10 border border-blue-100 shadow-lg"
                >
                    <svg
                        width="32"
                        height="32"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="23 28 9 16 23 4"></polyline>
                    </svg>
                </button>
                {/* Main image or 3D */}
                <div className="w-full flex flex-col items-center justify-center">
                    {isGLB ? (
                        <div className="w-[80vw] h-[80vh] max-w-6xl max-h-[90vh] cursor-pointer">
                            <Canvas
                                camera={{ position: [10, 5, 15] }}
                                className="w-full h-full rounded-2xl"
                            >
                                <ambientLight intensity={0.5} />
                                <pointLight position={[10, 10, 10]} />
                                <ModelViewer modelPath={house.images[idx]} />
                                <OrbitControls
                                    enableZoom={true}
                                    enablePan={true}
                                    enableRotate={true}
                                />
                            </Canvas>
                        </div>
                    ) : (
                        <img
                            src={
                                house.images[idx] &&
                                !house.images[idx].endsWith(".glb")
                                    ? house.images[idx]
                                    : DEFAULT_IMAGE
                            }
                            alt=""
                            className="max-w-5xl max-h-[80vh] w-auto h-auto object-contain border-4 border-white cursor-pointer"
                            onClick={() => setFullscreen(null)}
                        />
                    )}
                    {/* Slider (carousel) */}
                    <div className="w-full flex items-center justify-center gap-3 py-8 bg-transparent relative mt-6">
                        <div className="flex gap-4">
                            {house.images.map((img, i) => (
                                <div
                                    key={i}
                                    className={`w-24 h-24 rounded-2xl shadow-lg flex items-center justify-center cursor-pointer border transition-all duration-200 overflow-hidden ${
                                        idx === i
                                            ? "border-2 border-blue-400 bg-blue-50 scale-110"
                                            : "border border-gray-200 bg-white hover:scale-105"
                                    }`}
                                    onClick={() => setFullscreen(i)}
                                >
                                    <img
                                        src={img}
                                        alt=""
                                        className="w-full h-full object-cover rounded-2xl"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Right arrow */}
                <button
                    onClick={() =>
                        setFullscreen(
                            idx === house.images.length - 1 ? 0 : idx + 1
                        )
                    }
                    className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center rounded-xl bg-blue-50 text-blue-400 hover:bg-blue-100 transition z-10 border border-blue-100 shadow-lg"
                >
                    <svg
                        width="32"
                        height="32"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="9 28 23 16 9 4"></polyline>
                    </svg>
                </button>
            </div>
        );
    };
    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-white/80">
            {fullscreen !== null && renderFullscreen(fullscreen)}

            {/* Modal */}
            <div className="relative w-full max-w-6xl h-[80vh] bg-[#f7f9fa] rounded-3xl shadow-xl flex overflow-hidden border border-gray-100">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 bg-gray-100 hover:bg-gray-200 text-gray-400 rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow"
                >
                    ✕
                </button>
                {/* Left info panel */}
                <div className="w-[340px] bg-[#f7f9fa] h-full flex flex-col justify-between p-10 border-r border-gray-100">
                    <div>
                        <div className="w-14 h-14 bg-blue-100 rounded-full mb-8 mx-auto" />
                        <h2 className="text-2xl font-semibold text-gray-500 mb-8 text-center tracking-wide">
                            {house.name}
                        </h2>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-2 text-center text-gray-400 text-lg mb-8">
                            <div>
                                <div className="font-semibold text-gray-700 text-xl">
                                    42.1 м²
                                </div>
                                <div className="text-xs mt-1">площадь</div>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-700 text-xl">
                                    38 м²
                                </div>
                                <div className="text-xs mt-1">жилая</div>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-700 text-xl">
                                    7/19
                                </div>
                                <div className="text-xs mt-1">этаж</div>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-700 text-xl">
                                    A3
                                </div>
                                <div className="text-xs mt-1">секция</div>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-700 text-center mb-8 tracking-wide">
                            {house.price} ₽
                        </div>
                    </div>
                    <button className="w-full py-4 bg-[#2196f3] hover:bg-blue-600 text-white text-lg font-semibold rounded-xl shadow transition">
                        Хочу так же!
                    </button>
                </div>
                {/* Right image/slider panel */}
                <div className="flex-1 flex flex-col items-center justify-center bg-white h-full relative">
                    {/* Main image */}
                    <div className="flex-1 flex items-center justify-center relative w-full">
                        {/* Left arrow */}
                        <button
                            onClick={() =>
                                setCurrentImageIndex(
                                    currentImageIndex === 0
                                        ? house.images.length - 1
                                        : currentImageIndex - 1
                                )
                            }
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-400 hover:bg-blue-100 transition z-10 border border-blue-100"
                        >
                            <svg
                                width="28"
                                height="28"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="19 24 9 14 19 4"></polyline>
                            </svg>
                        </button>
                        {/* Main image or 3D */}
                        <div className="w-[500px] h-[370px] bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden relative shadow-sm">
                            {/* 4-chi rasm: GLB fayl */}
                            {currentImageIndex === 3 && isGLBFile && (
                                <>
                                    <Canvas camera={{ position: [10, 5, 15] }}>
                                        <ambientLight intensity={0.5} />
                                        <pointLight position={[10, 10, 10]} />
                                        <ModelViewer
                                            modelPath={
                                                house.images[currentImageIndex]
                                            }
                                        />
                                        <OrbitControls
                                            enableZoom={true}
                                            enablePan={true}
                                            enableRotate={true}
                                        />
                                    </Canvas>
                                    {/* Увеличить button */}
                                    <button
                                        onClick={() =>
                                            setFullscreen(currentImageIndex)
                                        }
                                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-6 py-2 bg-white/90 border border-blue-200 text-blue-500 rounded-full shadow hover:bg-blue-50 text-lg font-medium"
                                        style={{ backdropFilter: "blur(2px)" }}
                                    >
                                        <svg
                                            width="22"
                                            height="22"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="11" cy="11" r="9" />
                                            <path d="M11 7v4l3 3" />
                                        </svg>
                                        Увеличить
                                    </button>
                                </>
                            )}
                            {/* 5-chi rasm: 3D tour button */}
                            {currentImageIndex === 4 && (
                                <>
                                    <img
                                        src={
                                            house.images[currentImageIndex] &&
                                            !house.images[
                                                currentImageIndex
                                            ].endsWith(".glb")
                                                ? house.images[
                                                      currentImageIndex
                                                  ]
                                                : DEFAULT_IMAGE
                                        }
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() =>
                                            onStartVirtualTour(house)
                                        }
                                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg text-lg font-semibold transition"
                                    >
                                        <svg
                                            width="22"
                                            height="22"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M12 2l1.5 6H18l-4.5 3.5L15 18l-3-2-3 2 1.5-6.5L6 8h4.5z" />
                                        </svg>
                                        3D tourga o'tib ketish
                                    </button>
                                </>
                            )}
                            {/* Boshqa rasmlar */}
                            {[0, 1, 2].includes(currentImageIndex) && (
                                <>
                                    <img
                                        src={house.images[currentImageIndex]}
                                        alt=""
                                        className="w-full h-full object-cover"
                                        onClick={() =>
                                            setFullscreen(currentImageIndex)
                                        }
                                        style={{ cursor: "pointer" }}
                                    />
                                    {/* Увеличить button */}
                                    <button
                                        onClick={() =>
                                            setFullscreen(currentImageIndex)
                                        }
                                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-6 py-2 bg-white/90 border border-blue-200 text-blue-500 rounded-full shadow hover:bg-blue-50 text-lg font-medium"
                                        style={{ backdropFilter: "blur(2px)" }}
                                    >
                                        <svg
                                            width="22"
                                            height="22"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="11" cy="11" r="9" />
                                            <path d="M11 7v4l3 3" />
                                        </svg>
                                        Увеличить
                                    </button>
                                </>
                            )}
                        </div>
                        {/* Right arrow */}
                        <button
                            onClick={() =>
                                setCurrentImageIndex(
                                    currentImageIndex ===
                                        house.images.length - 1
                                        ? 0
                                        : currentImageIndex + 1
                                )
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-400 hover:bg-blue-100 transition z-10 border border-blue-100"
                        >
                            <svg
                                width="28"
                                height="28"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="9 24 19 14 9 4"></polyline>
                            </svg>
                        </button>
                    </div>
                    {/* Slider (carousel) */}
                    <div className="w-full flex items-center justify-center gap-3 py-4 bg-transparent relative mt-2">
                        <div className="flex gap-4">
                            {house.images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`w-20 h-20 rounded-xl shadow flex items-center justify-center cursor-pointer border transition-all duration-200 overflow-hidden ${
                                        currentImageIndex === idx
                                            ? "border-2 border-blue-400 bg-blue-50"
                                            : "border border-gray-200 bg-white"
                                    }`}
                                    onClick={() => setCurrentImageIndex(idx)}
                                >
                                    <img
                                        src={img}
                                        alt=""
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                </div>
                            ))}
                            {/* QR button */}
                            <button className="w-20 h-20 flex items-center justify-center rounded-xl bg-[#2196f3] text-white text-2xl font-bold ml-6 shadow hover:bg-blue-600 transition">
                                QR
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HouseModal;
