import React, { useState, useEffect } from "react";
import { House } from "../types/House";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

interface HouseSheetProps {
    house: House | null;
    onClose: () => void;
    onStartVirtualTour: (house: House) => void;
}

// 3D Model component for GLB files
const ModelViewer: React.FC<{ modelPath: string }> = ({ modelPath }) => {
    const { scene } = useGLTF(modelPath);
    return <primitive object={scene} scale={1} />;
};

const HouseSheet: React.FC<HouseSheetProps> = ({
    house,
    onClose,
    onStartVirtualTour,
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        if (house) {
            // Small delay to trigger animation
            setTimeout(() => setIsVisible(true), 10);
        }
    }, [house]);

    if (!house) return null;

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === house.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? house.images.length - 1 : prev - 1
        );
    };

    const openFullscreen = () => {
        setIsFullscreen(true);
    };

    const closeFullscreen = () => {
        setIsFullscreen(false);
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300); // Wait for animation to complete
    };

    const isGLBFile = house.images[currentImageIndex].endsWith(".glb");

    // Fullscreen image view
    if (isFullscreen) {
        return (
            <div className="fixed inset-0 w-screen h-screen bg-black/90 flex items-center justify-center z-[3000]">
                <div className="relative w-full h-full">
                    {/* Close fullscreen button */}
                    <button
                        onClick={closeFullscreen}
                        className="absolute top-5 right-5 bg-gray-800 text-white border-none rounded w-10 h-10 cursor-pointer text-lg z-10"
                    >
                        ✕
                    </button>

                    {/* Fullscreen content */}
                    {isGLBFile ? (
                        <div className="w-full h-full">
                            <Canvas camera={{ position: [10, 5, 15] }}>
                                <ambientLight intensity={0.5} />
                                <pointLight position={[10, 10, 10]} />
                                <ModelViewer
                                    modelPath={house.images[currentImageIndex]}
                                />
                                <OrbitControls
                                    enableZoom={true}
                                    enablePan={true}
                                    enableRotate={true}
                                />
                            </Canvas>
                        </div>
                    ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-5xl">
                            <div className="text-center">
                                <div className="text-6xl mb-2">🏠</div>
                                <div className="text-lg">
                                    Rasm {currentImageIndex + 1} /{" "}
                                    {house.images.length}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation arrows */}
                    <button
                        onClick={prevImage}
                        className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white border-none rounded w-12 h-12 cursor-pointer text-xl z-10"
                    >
                        ‹
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white border-none rounded w-12 h-12 cursor-pointer text-xl z-10"
                    >
                        ›
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 w-screen h-screen bg-black/50 z-[2000] transition-opacity duration-300 ${
                    isVisible ? "opacity-100" : "opacity-0"
                }`}
                onClick={handleClose}
            />

            {/* Right Side Sheet */}
            <div
                className={`fixed top-0 right-0 w-full md:w-[600px] h-[90vh] bg-white z-[2001] transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col shadow-[-4px_0_20px_rgba(0,0,0,0.1)] ${
                    isVisible ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Close button at the top */}
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={handleClose}
                        className="bg-black/70 text-white border-none rounded-full w-10 h-10 cursor-pointer text-xl flex items-center justify-center"
                    >
                        ✕
                    </button>
                </div>

                {/* Image Slider Section */}
                <div className="h-[45%] relative bg-gray-50 flex flex-col justify-end">
                    {/* Main image display */}
                    <div
                        className="relative h-full bg-gray-800 flex items-center justify-center text-white text-6xl cursor-pointer rounded-b-none rounded-t-xl"
                        onClick={openFullscreen}
                    >
                        {/* Check if current image is a GLB file */}
                        {isGLBFile ? (
                            <div className="w-full h-full">
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
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="text-7xl mb-3">🏠</div>
                                <div className="text-2xl">
                                    Rasm {currentImageIndex + 1} /{" "}
                                    {house.images.length}
                                </div>
                                <div className="text-base mt-3 opacity-80">
                                    Kattalashtirish uchun bosing
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Slider (carousel) */}
                    <div className="w-full flex items-center justify-center gap-3 py-4 bg-transparent relative">
                        {/* Left arrow */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                prevImage();
                            }}
                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 text-blue-400 hover:bg-blue-200 transition absolute left-0 z-10"
                        >
                            <svg
                                width="28"
                                height="28"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-chevron-left"
                            >
                                <polyline points="19 24 9 14 19 4"></polyline>
                            </svg>
                        </button>
                        {/* Slides */}
                        <div className="flex gap-4 mx-16">
                            {house.images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`w-24 h-24 rounded-xl shadow flex items-center justify-center cursor-pointer border transition-all duration-200 overflow-hidden ${
                                        currentImageIndex === idx
                                            ? "border-2 border-blue-400 bg-blue-50"
                                            : "border border-gray-200 bg-white"
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndex(idx);
                                    }}
                                >
                                    {img.endsWith(".glb") ? (
                                        <span className="text-blue-400 text-2xl">
                                            3D
                                        </span>
                                    ) : (
                                        <img
                                            src={img}
                                            alt=""
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Right arrow */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                nextImage();
                            }}
                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 text-blue-400 hover:bg-blue-200 transition absolute right-0 z-10"
                        >
                            <svg
                                width="28"
                                height="28"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-chevron-right"
                            >
                                <polyline points="9 24 19 14 9 4"></polyline>
                            </svg>
                        </button>
                        {/* QR button */}
                        <button className="w-24 h-24 flex items-center justify-center rounded-xl bg-blue-400 text-white text-2xl font-bold ml-6">
                            QR
                        </button>
                    </div>
                </div>

                {/* House Information Section */}
                <div className="flex-1 p-4 overflow-y-auto bg-white">
                    {/* Header */}
                    <div className="mb-4">
                        <h2 className="m-0 text-gray-800 text-xl font-bold">
                            {house.name}
                        </h2>
                    </div>

                    {/* Price and Location */}
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-green-700 font-bold text-lg">
                            {house.price}
                        </span>
                        <span className="text-gray-600 text-sm flex items-center gap-1">
                            📍 {house.location}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="m-0 mb-4 text-gray-600 text-sm leading-relaxed">
                        {house.description}
                    </p>

                    {/* Features */}
                    <div className="mb-4">
                        <h4 className="m-0 mb-2.5 text-gray-800 text-sm font-bold">
                            Qulayliklar:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {house.features.map((feature, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-100 px-2.5 py-1 rounded-2xl text-xs text-gray-800 border border-gray-200"
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* 3D Tour button */}
                    {currentImageIndex === 4 && (
                        <button
                            onClick={() => onStartVirtualTour(house)}
                            className="w-full bg-green-700 text-white border-none py-3 px-4 rounded-md cursor-pointer text-sm font-bold flex items-center justify-center gap-1.5 mt-2 hover:bg-green-800 transition-colors"
                        >
                            🏠 3D Virtual Tour Boshlash
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default HouseSheet;
