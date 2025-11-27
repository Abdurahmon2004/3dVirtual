import React from "react";

const LoadingScreen: React.FC = () => {
    return (
        <div className="absolute inset-0 w-screen h-screen bg-gray-50 flex flex-col justify-center items-center z-[9999] text-gray-800">
            <div className="w-12 h-12 border-3 border-gray-200 border-t-green-700 rounded-full animate-spin mb-5"></div>
            <p className="text-lg font-sans text-center m-0">
                Virtual Tour yuklanmoqda...
            </p>
        </div>
    );
};

export default LoadingScreen;
