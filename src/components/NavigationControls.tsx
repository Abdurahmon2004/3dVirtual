import React from "react";
import { Room } from "../types/Room";

interface NavigationControlsProps {
    rooms: Room[];
    currentRoom: number; // Bu ID bo'ladi
    onRoomChange: (roomId: number) => void;
    onToggleControls: () => void;
    position?:
        | "top-left"
        | "top-right"
        | "bottom-left"
        | "bottom-right"
        | "center-left"
        | "center-right";
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
    rooms,
    currentRoom,
    onRoomChange,
    onToggleControls,
    position = "top-left",
}) => {
    // Agar rooms bo'sh bo'lsa – hech narsa render qilmaymiz
    if (!rooms || rooms.length === 0) {
        return null;
    }

    // currentRoom ID orqali xonani topamiz
    const currentRoomObj = rooms.find((room) => room.id === currentRoom);

    const getPositionClasses = () => {
        switch (position) {
            case "top-right":
                return "top-5 right-5";
            case "bottom-left":
                return "bottom-5 left-5";
            case "bottom-right":
                return "bottom-5 right-5";
            case "center-left":
                return "top-1/2 left-5 transform -translate-y-1/2";
            case "center-right":
                return "top-1/2 right-5 transform -translate-y-1/2";
            default:
                return "top-5 left-5"; // top-left
        }
    };

    return (
        <div
            className={`absolute ${getPositionClasses()} p-5 bg-white rounded-md text-gray-800 font-sans z-[1000] min-w-[200px] border border-gray-200`}
        >
            <h3 className="m-0 mb-4 text-lg text-gray-600">Virtual Tour</h3>

            <div className="mb-4 text-sm">
                Hozirgi xona:{" "}
                <strong>{currentRoomObj?.name || "Noma'lum xona"}</strong>
            </div>

            <div className="flex flex-col gap-2.5">
                {rooms.map((room) => (
                    <button
                        key={room.id}
                        onClick={() => onRoomChange(room.id)}
                        disabled={room.id === currentRoom}
                        className={`px-4 py-2.5 rounded border text-sm transition-colors ${
                            room.id === currentRoom
                                ? "bg-green-700 text-white border-green-700 cursor-default"
                                : "bg-transparent text-gray-800 border-gray-200 cursor-pointer hover:border-green-700 hover:text-green-700"
                        }`}
                    >
                        {room.name}
                    </button>
                ))}
            </div>

            <div className="mt-5 text-xs text-gray-600 border-t border-gray-200 pt-4">
                <p className="m-0 mb-1">Boshqarish:</p>
                <ul className="m-0 pl-4">
                    <li>Sichqoncha: Atrofga qarash</li>
                    <li>G'ildirak: Kattalashtirish/kichiklashtirish</li>
                    <li>Hotspot bosish: Navigatsiya</li>
                </ul>
            </div>

            <button
                onClick={onToggleControls}
                className="mt-3 text-xs text-blue-600 underline"
            >
                Panelni yashirish/ko‘rsatish
            </button>
        </div>
    );
};

export default NavigationControls;
