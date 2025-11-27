import React, { useState, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useSearchParams } from "react-router";

import LoadingScreen from "../components/LoadingScreen";
import CubemapViewer from "../components/CubemapViewer";
import NavigationControls from "../components/NavigationControls";
import { useGetByIdHome } from "@/hooks/modules/home";

function Vizual() {
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const [searchParams] = useSearchParams();
  const home_id = searchParams.get("home_id") || "";
  const { data: home } = useGetByIdHome(Number(home_id));
  useEffect(() => {
    const roomId = searchParams.get("room");
    if (roomId && home?.plan?.items?.length) {
      const index = home.plan.items.findIndex(
        (item: any) => item.id === Number(roomId)
      );
      if (index >= 0) setCurrentRoomIndex(index);
    }
  }, [searchParams, home]);
  const rooms = useMemo(() => {
    if (!home?.plan?.items) return [];
    return home.plan.items.map((item: any) => {
      const texturesArray = [
        item.textures?.posx,
        item.textures?.negx,
        item.textures?.posy,
        item.textures?.negy,
        item.textures?.posz,
        item.textures?.negz,
      ].map(
        (t: string) =>
          t && `https://3dtur.backend-salehouse.uz/storage/${t}`
      );
      const hotspots = (item.hotspots || []).map((h: any) => ({
        ...h,
        position: new THREE.Vector3(h.position.x, h.position.y, h.position.z),
      }));

      return {
        id: item.id,
        name: item.name,
        textures: texturesArray,
        hotspots,
      };
    });
  }, [home]);
  const activeRoom = rooms[currentRoomIndex];
  if (!home || !activeRoom || activeRoom.textures.length < 6) {
    return <LoadingScreen />;
  }
  const handleRoomChange = (roomId: number) => {
    const index = rooms.findIndex((r:any) => r.id === roomId);
    if (index < 0) return;

    setIsTransitioning(true);
    setIsLoading(true);

    setTimeout(() => {
      setCurrentRoomIndex(index);
      setIsTransitioning(false);
    }, 500);
  };

  const handleHotspotClick = (hotspot: any) => {
    if (hotspot.targetRoom !== null) {
      handleRoomChange(hotspot.targetRoom);
    }
  };

  return (
    <div className="w-full h-screen relative">
      {isLoading && <LoadingScreen />}

      {isTransitioning && (
        <div className="absolute inset-0 bg-black/70 z-[1000] flex items-center justify-center animate-pulse">
          <div className="text-white text-2xl font-bold text-center">
            <div className="mb-5">🚪</div>
            <div>Xonaga o'tilmoqda...</div>
            <div className="text-base mt-2.5 opacity-80">
              {activeRoom.name}
            </div>
          </div>
        </div>
      )}
      <Canvas
        camera={{ position: [0, 0, 0.1], fov: 75, near: 0.001, far: 1000 }}
        className="bg-black"
      >
        <CubemapViewer
          room={activeRoom}
          onLoad={() => setIsLoading(false)}
          onHotspotClick={handleHotspotClick}
        />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          autoRotate={false}
          rotateSpeed={-0.3}
          zoomSpeed={0.5}
          minDistance={0.1}
          maxDistance={2}
          target={[0, 0, 0]}
          enableDamping={true}
          dampingFactor={0.1}
        />
      </Canvas>
      {showControls && (
        <NavigationControls
          rooms={rooms}
          currentRoom={currentRoomIndex}
          onRoomChange={handleRoomChange}
          onToggleControls={() => setShowControls((s) => !s)}
          position="top-left"
        />
      )}

      <button
        onClick={() => setShowControls((s) => !s)}
        className="absolute top-5 right-5 p-2.5 bg-gray-800 text-white rounded z-[1000] hover:bg-white hover:text-black transition"
      >
        {showControls ? "✕" : "☰"}
      </button>
    </div>
  );
}

export default Vizual;
