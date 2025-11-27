export interface House {
    id: number;
    name: string;
    description: string;
    price: string;
    main_image: string;
    location: string;
    images: string[];
    features: string[];
    virtualTourRoomId: number; // Which room to start the 3D tour from
}