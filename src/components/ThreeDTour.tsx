import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

interface ThreeDTourProps {
    onClose: () => void;
    modelPath: string;
}

const ModelViewer: React.FC<{ modelPath: string }> = ({ modelPath }) => {
    const { scene } = useGLTF(modelPath);
    return <primitive object={scene} scale={1} />;
};

const ThreeDTour: React.FC<ThreeDTourProps> = ({ onClose, modelPath }) => {
    const [isTourStarted, setIsTourStarted] = useState(false);

    const startTour = () => {
        setIsTourStarted(true);
    };

    if (!isTourStarted) {
        // First state: 3D floor plan with modal
        return (
            <div className="fixed inset-0 z-[4000] bg-gray-800 flex items-center justify-center">
                {/* Top bar */}
                <div className="absolute top-0 left-0 right-0 h-12 bg-black flex items-center justify-between px-4">
                    <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-300 rounded mr-2"></div>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-blue-400 text-white px-3 py-1 rounded text-sm"
                    >
                        Выход X
                    </button>
                </div>

                {/* Navigation arrows */}
                <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center">
                    ‹
                </button>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center">
                    ›
                </button>

                {/* Main 3D view */}
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-[90vw] h-[80vh] bg-white rounded-lg">
                        <Canvas camera={{ position: [10, 5, 15] }}>
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} />
                            <ModelViewer modelPath={modelPath} />
                            <OrbitControls
                                enableZoom={true}
                                enablePan={true}
                                enableRotate={true}
                            />
                        </Canvas>
                    </div>
                </div>

                {/* Modal overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 shadow-xl max-w-md mx-4">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                            Обзор 360°
                        </h2>
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                            </div>
                        </div>
                        <p className="text-gray-600 text-center mb-6">
                            Вращайте планировку
                        </p>
                        <button
                            onClick={startTour}
                            className="w-full bg-blue-400 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 transition"
                        >
                            Начать
                        </button>
                    </div>
                </div>

                {/* Bottom thumbnails */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    <div className="w-16 h-16 bg-gray-200 rounded border-2 border-gray-300"></div>
                    <div className="w-16 h-16 bg-gray-200 rounded border-2 border-gray-300"></div>
                    <div className="w-16 h-16 bg-gray-200 rounded border-2 border-blue-400 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="w-16 h-16 bg-gray-200 rounded border-2 border-gray-300"></div>
                    <div className="w-16 h-16 bg-blue-400 rounded flex items-center justify-center text-white font-semibold">
                        QR
                    </div>
                </div>
            </div>
        );
    }

    // Second state: Interactive 3D tour
    return (
        <div className="fixed inset-0 z-[4000] bg-gray-800 flex items-center justify-center">
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-black flex items-center justify-between px-4">
                <div className="flex items-center">
                    <div className="w-6 h-6 bg-white rounded mr-2"></div>
                </div>
                <button
                    onClick={onClose}
                    className="bg-blue-400 text-white px-3 py-1 rounded text-sm"
                >
                    Выход X
                </button>
            </div>

            {/* Navigation arrows */}
            <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center">
                ‹
            </button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center">
                ›
            </button>

            {/* Main 3D view */}
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-[90vw] h-[80vh] bg-white rounded-lg">
                    <Canvas camera={{ position: [10, 5, 15] }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <ModelViewer modelPath={modelPath} />
                        <OrbitControls
                            enableZoom={true}
                            enablePan={true}
                            enableRotate={true}
                        />
                    </Canvas>
                </div>
            </div>

            {/* Bottom thumbnails */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <div className="w-16 h-16 bg-gray-200 rounded border-2 border-gray-300"></div>
                <div className="w-16 h-16 bg-gray-200 rounded border-2 border-gray-300"></div>
                <div className="w-16 h-16 bg-gray-200 rounded border-2 border-blue-400 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                            <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="w-16 h-16 bg-gray-200 rounded border-2 border-gray-300"></div>
                <div className="w-16 h-16 bg-blue-400 rounded flex items-center justify-center text-white font-semibold">
                    QR
                </div>
            </div>
        </div>
    );
};

export default ThreeDTour;
