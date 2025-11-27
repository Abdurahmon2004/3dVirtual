import { House } from "../types/House";

export const houses: House[] = [
    {
        id: 1,
        name: "Zamonaviy Villa",
        description:
            "Zamonaviy dizayn va qulayliklar bilan jihozlangan hashamatli villa",
        price: "$850,000",
        location: "Toshkent, Chilonzor",
        main_image: "http://localhost:3000/cubemap/home.jpg",
        images: [
            "http://localhost:3000/cubemap/home.jpg",
            "http://localhost:3000/cubemap/home1.png",
            "http://localhost:3000/cubemap/home2.png",
        ],
        features: [
            "4 ta yotoq xona",
            "3 ta hammom",
            "Katta oshxona",
            "Bog'cha",
            "Garaj",
        ],
        virtualTourRoomId: 0,
    },
    {
        id: 2,
        name: "Klassik Uy",
        description: "Klassik arxitektura va zamonaviy qulayliklar uyg'unligi",
        price: "$650,000",
        location: "Toshkent, Yunusobod",
        main_image: "http://localhost:3000/cubemap/home.jpg",
        images: [
            "http://localhost:3000/cubemap/home.jpg",
            "http://localhost:3000/cubemap/home1.png",
            "http://localhost:3000/cubemap/home2.png",
        ],
        features: [
            "3 ta yotoq xona",
            "2 ta hammom",
            "Oshxona",
            "Bog'cha",
            "Terrasa",
        ],
        virtualTourRoomId: 0,
    },
    {
        id: 3,
        name: "Minimalistik Kvartira",
        description: "Zamonaviy minimalistik dizayn va funksionallik",
        price: "$450,000",
        location: "Toshkent, Sergeli",
        main_image: "http://localhost:3000/cubemap/home.jpg",
        images: [
            "http://localhost:3000/cubemap/home.jpg",
            "http://localhost:3000/cubemap/home1.png",
            "http://localhost:3000/cubemap/home2.png",
        ],
        features: [
            "2 ta yotoq xona",
            "1 ta hammom",
            "Oshxona",
            "Balkon",
            "Parking",
        ],
        virtualTourRoomId: 0,
    },
];
