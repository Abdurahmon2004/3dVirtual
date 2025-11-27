import React from "react";
import { House } from "../types/House";

interface HouseCardProps {
    house: House;
    onClick: (house: House) => void;
}

const HouseCard: React.FC<HouseCardProps> = ({ house, onClick }) => {
    return (
        <div
            className="house-card bg-white rounded-md border border-gray-200 overflow-hidden cursor-pointer m-4 w-[350px] min-h-[300px] flex flex-col transition-all duration-300 hover:bg-gray-100"
            onClick={() => onClick(house)}
        >
            <div className="h-50 bg-gray-800 flex items-center justify-center text-white text-2xl font-bold">
                <img
                    src={house.main_image}
                    className="h-full w-full object-cover"
                    alt=""
                />
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <h3 className="m-0 mb-2.5 text-gray-800 text-lg">
                    {house.name}
                </h3>

                <div className="flex justify-between items-center mb-4">
                    <span className="text-green-700 font-bold text-lg">
                        {house.price}
                    </span>
                    <span className="text-gray-600 text-xs">
                        📍 {house.location}
                    </span>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick(house);
                    }}
                    className="bg-green-700 text-white border-none py-3 px-5 rounded cursor-pointer text-sm font-bold mt-auto hover:bg-green-800 transition-colors"
                >
                    🏠 Ko'rish va 3D Tour
                </button>
            </div>
        </div>
    );
};

export default HouseCard;
