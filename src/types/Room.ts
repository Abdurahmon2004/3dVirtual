import * as THREE from "three";

export interface Hotspot {
    id: string;
    position: THREE.Vector3;
    targetRoom: number;
    label: string;
}

export interface Room {
    id: number;
    name: string;
    textures: string[];
    hotspots: Hotspot[];
}
