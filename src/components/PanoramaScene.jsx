import * as THREE from "three";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { useDispatch, useSelector } from "react-redux";
import { setImages } from "../store/features/imagesSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCratePlanHome } from "@/hooks/modules/plan.home";
import utils from "@/helpers/utils"
export default function PanoramaScene() {
  const [searchParams] = useSearchParams();
  const plan_id = searchParams.get("plan_id");
  const cubeRef = useRef(null);
  const { scene, gl } = useThree();
  const navigate = useNavigate();
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const { mutate } = useCratePlanHome();
  useEffect(() => {
    if (gl?.domElement?.style) gl.domElement.style.touchAction = "none";
  }, [gl]);

  const imagesData = useSelector((state) => state?.images?.images);
  const dispatch = useDispatch();
  const faceKeyFromName = (name = "") => {
    const n = name.toLowerCase();
    if (/(^|[^a-z])(posx|px|right)([^a-z]|$)/.test(n)) return "px";
    if (/(^|[^a-z])(negx|nx|left)([^a-z]|$)/.test(n)) return "nx";
    if (/(^|[^a-z])(posy|py|top)([^a-z]|$)/.test(n)) return "py";
    if (/(^|[^a-z])(negy|ny|bottom|down)([^a-z]|$)/.test(n)) return "ny";
    if (/(^|[^a-z])(posz|pz|front)([^a-z]|$)/.test(n)) return "pz";
    if (/(^|[^a-z])(negz|nz|back)([^a-z]|$)/.test(n)) return "nz";
    return null;
  };
  const [roomBlobUrls, setRoomBlobUrls] = useState([]);

  useEffect(() => {
    if (!Array.isArray(imagesData) || imagesData.length === 0) {
      setRoomBlobUrls([]);
      return;
    }

    const allUrls = imagesData.map((room) => {
      const files = room?.textures;
      if (!Array.isArray(files) || files.length !== 6) return null;
      return files.map((f) => URL.createObjectURL(f));
    });

    setRoomBlobUrls(allUrls.filter(Boolean));

    return () => {
      allUrls.forEach((urls) => {
        if (urls) urls.forEach((u) => URL.revokeObjectURL(u));
      });
    };
  }, [imagesData]);
  const currentRoom = imagesData?.[currentRoomIndex];
  const files = currentRoom?.textures;
  const blobUrls = roomBlobUrls[currentRoomIndex];
  const hotspots = currentRoom?.hotspots || [];

  const previews = useMemo(() => {
    if (!Array.isArray(files) || files.length !== 6) return null;
    if (!Array.isArray(blobUrls) || blobUrls.length !== 6) return null;

    const map = {};
    files.forEach((file, i) => {
      const key = faceKeyFromName(file?.name);
      if (key) map[key] = blobUrls[i];
    });

    const ordered = [
      map.px ?? blobUrls[0],
      map.nx ?? blobUrls[1],
      map.py ?? blobUrls[2],
      map.ny ?? blobUrls[3],
      map.pz ?? blobUrls[4],
      map.nz ?? blobUrls[5],
    ];

    return ordered.every(Boolean) ? ordered : null;
  }, [files, blobUrls]);
  const materials = useMemo(() => {
    if (!previews) return null;

    const manager = new THREE.LoadingManager();
    manager.onStart = () => setIsLoading(true);
    manager.onLoad = () => {
      setIsTransitioning(true);
      const t = setTimeout(() => {
        setIsLoading(false);
        setIsTransitioning(false);
      }, 250);
      return () => clearTimeout(t);
    };
    manager.onError = (url) => {};

    const loader = new THREE.TextureLoader(manager);
    return previews.map((url) => {
      const tex = loader.load(url);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide });
    });
  }, [previews]);

  useEffect(() => {
    const prev = scene.background;
    scene.background = null;
    return () => {
      scene.background = prev;
    };
  }, [scene]);
  const innerRadius = 250 - 2;
  const addMarkerAtPoint = useCallback((point) => {
    if (!point) return;
    const adjusted = point.clone().normalize().multiplyScalar(innerRadius);
    setMarkers((prev) => [...prev, adjusted]);
  }, []);

  const lastUpTimeRef = useRef(0);
  const lastUpPosRef = useRef({ x: 0, y: 0 });
  const doubleDelay = 300;
  const moveTol = 6;

  const onPointerDown = (e) => {
    lastUpPosRef.current = { x: e.clientX ?? 0, y: e.clientY ?? 0 };
  };

  const onDoubleClick = (e) => {
    e.stopPropagation();
    addMarkerAtPoint(e.point);
  };

  const onPointerUp = (e) => {
    const now = Date.now();
    const dx = Math.abs((e.clientX ?? 0) - lastUpPosRef.current.x);
    const dy = Math.abs((e.clientY ?? 0) - lastUpPosRef.current.y);
    const moved = dx > moveTol || dy > moveTol;

    if (now - lastUpTimeRef.current < doubleDelay && !moved) {
      e.stopPropagation();
      addMarkerAtPoint(e.point);
      lastUpTimeRef.current = 0;
    } else {
      lastUpTimeRef.current = now;
      lastUpPosRef.current = { x: e.clientX ?? 0, y: e.clientY ?? 0 };
    }
  };

  const removeMarker = (idx) => setMarkers((prev) => prev.filter((_, i) => i !== idx));
  const handleSubmit = () => {
    const hotspots = markers.map((m) => ({
      x: +m.x.toFixed(2),
      y: +m.y.toFixed(2),
      z: +m.z.toFixed(2),
    }));

    imagesData.forEach((item) => {
      const fd = new FormData();
      fd.append("plan_id", Number(plan_id));
      fd.append("name", item.name);
      fd.append("hotspots", JSON.stringify(item.hotspots));
      fd.append("textures[posx]", item.textures[0]);
      fd.append("textures[negx]", item.textures[1]);
      fd.append("textures[posy]", item.textures[2]);
      fd.append("textures[negy]", item.textures[3]);
      fd.append("textures[posz]", item.textures[4]);
      fd.append("textures[negz]", item.textures[5]);

      for (let pair of fd.entries()) {
      }

      mutate(fd,{
        onSuccess:()=>{
          navigate(`/plan-homes?plan_id=${plan_id}`)
        }
      });
    });

  };



  const handleClear = () => {
    setTimeout(() => {
      if (imagesData[currentRoomIndex]) {
        const updatedImagesData = imagesData.map((room, index) => {
          if (index === currentRoomIndex) {

            return {
              ...room,
              hotspots: [],
            };
          }
          return room;
        });

        dispatch(setImages(updatedImagesData));
        setMarkers([]);
      }
    }, 250);
  };
  const handleRoomChange = (targetIndex) => {
    if (targetIndex < 0 || targetIndex >= imagesData.length) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentRoomIndex(targetIndex);
      if (imagesData[currentRoomIndex]) {
        const updatedImagesData = imagesData.map((room, index) => {
          if (index === currentRoomIndex && markers.length > 0) {
            const oldHotspots = room.hotspots || [];
            const newHotspots = markers.map((m, i) => ({
              id: `marker_${oldHotspots.length + i + 1}`,
              position: new THREE.Vector3(m.x, m.y, m.z),
              targetRoom: null,
              label: `Marker ${oldHotspots.length + i + 1}`,
            }));
            return {
              ...room,
              hotspots: [...oldHotspots, ...newHotspots],
            };
          }
          return room;
        });

        dispatch(setImages(updatedImagesData));
        setMarkers([]);
      }
    }, 250);

  };

  if (!previews) {
    return (
      <Html center>
        <div
          style={{
            color: "white",
            fontSize: 18,
            padding: 12,
            background: "rgba(0,0,0,0.5)",
            borderRadius: 8,
          }}
        >
          Rasmlar topilmadi yoki 6 ta preview yo'q.
        </div>
      </Html>
    );
  }

  if (!materials) {
    return (
      <Html center>
        <div style={{ color: "white", fontSize: 18 }}>Rasmlar yuklanmoqda...</div>
      </Html>
    );
  }

  return (
    <>
      {(isLoading || isTransitioning) && (
        <Html fullscreen>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              pointerEvents: "none",
            }}
          >
            <div style={{ color: "#fff", textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>🌀</div>
              <div style={{ fontSize: 20 }}>
                {isLoading ? "Yuklanmoqda..." : "Xonaga o'tilmoqda..."}
              </div>
              <div style={{ opacity: 0.8, marginTop: 8 }}>Panorama tayyorlanmoqda</div>
            </div>
          </div>
        </Html>
      )}

      <mesh
        ref={cubeRef}
        material={materials}
        onDoubleClick={onDoubleClick}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <boxGeometry args={[500, 500, 500]} />
      </mesh>
      {hotspots.map((hotspot, i) => {
        const pos = hotspot.position;
        const position = new THREE.Vector3(pos.x, pos.y, pos.z)
          .normalize()
          .multiplyScalar(innerRadius);

        return (
          <group key={`hotspot-${i}`} position={position}>
            <Html center distanceFactor={15}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoomChange(hotspot.targetRoom);
                }}
                title={hotspot.label || "Xonaga o'tish"}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  transform: "translate(-50%, -50%)",
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
                }}
              >
                <svg
                  width="1502"
                  height="1502"
                  viewBox="0 0 46 46"
                  style={{
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <circle cx="23" cy="23" r="21" strokeWidth="2" fill="white" />
                  <path
                    d="M23.9 6c1.62 0 2.934 1.335 2.934 2.982 0 1.646-1.314 2.981-2.934 2.981s-2.933-1.335-2.933-2.981C20.967 7.335 22.281 6 23.9 6zm8.855 30.05c-.032-.173-2.737-7.825-2.737-7.825l-4.085-4.23v-8.583c0-1.95-3.48-3.224-3.887-2.938-.267.188-6.387 4.049-6.387 4.049l-.649 6.57a1.331 1.331 0 0 0 1.307 1.526c.729-.001 1.32-.602 1.32-1.343l.546-5.003 3.041-1.8v7.498l5.58 5.47 2.848 7.5A1.62 1.62 0 0 0 31.164 38c.894 0 1.62-.737 1.62-1.646 0-.104 0-.15-.03-.304zm-18.368-1.067c-.24.288-.387.66-.387 1.067 0 .909.725 1.646 1.62 1.646a1.61 1.61 0 0 0 1.36-.756l4.953-6.513 1.523-3.424-2.504-2.385-1.851 3.84-4.714 6.525zm12.268-16.178s-.049 3.697 0 3.621c.044-.066 1.832 1.442 2.292 1.832a1.336 1.336 0 0 0 .107.091c.22.168.494.268.79.268.73 0 1.32-.6 1.32-1.342 0-.5-.267-.807-.667-1.165l-3.842-3.305z"
                    fill="#000"
                  />
                </svg>
                {hotspot.label && (
                  <div
                    style={{
                      background: "rgba(0,0,0,0.8)",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: 14,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {hotspot.label}
                  </div>
                )}
              </div>
            </Html>
          </group>
        );
      })}
      {markers.map((p, i) => (
        <group key={i} position={p}>
          <Html center distanceFactor={12}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                removeMarker(i);
              }}
              title="O'chirish uchun bosing"

            >
              <svg
                width="1502"
                height="1502"
                viewBox="0 0 46 46"
                style={{
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <circle cx="23" cy="23" r="21" strokeWidth="2" fill="white" />
                <path
                  d="M23.9 6c1.62 0 2.934 1.335 2.934 2.982 0 1.646-1.314 2.981-2.934 2.981s-2.933-1.335-2.933-2.981C20.967 7.335 22.281 6 23.9 6zm8.855 30.05c-.032-.173-2.737-7.825-2.737-7.825l-4.085-4.23v-8.583c0-1.95-3.48-3.224-3.887-2.938-.267.188-6.387 4.049-6.387 4.049l-.649 6.57a1.331 1.331 0 0 0 1.307 1.526c.729-.001 1.32-.602 1.32-1.343l.546-5.003 3.041-1.8v7.498l5.58 5.47 2.848 7.5A1.62 1.62 0 0 0 31.164 38c.894 0 1.62-.737 1.62-1.646 0-.104 0-.15-.03-.304zm-18.368-1.067c-.24.288-.387.66-.387 1.067 0 .909.725 1.646 1.62 1.646a1.61 1.61 0 0 0 1.36-.756l4.953-6.513 1.523-3.424-2.504-2.385-1.851 3.84-4.714 6.525zm12.268-16.178s-.049 3.697 0 3.621c.044-.066 1.832 1.442 2.292 1.832a1.336 1.336 0 0 0 .107.091c.22.168.494.268.79.268.73 0 1.32-.6 1.32-1.342 0-.5-.267-.807-.667-1.165l-3.842-3.305z"
                  fill="#000"
                />
              </svg>
            </div>
          </Html>
        </group>
      ))}

      {showControls && (
        <OrbitControls
          enableZoom
          enablePan={false}
          enableRotate
          autoRotate={false}
          rotateSpeed={-0.3}
          zoomSpeed={0.5}
          minDistance={0.1}
          maxDistance={2}
          target={[0, 0, 0]}
          enableDamping
          dampingFactor={0.1}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
        />
      )}

      <Html fullscreen>
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              right: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleSubmit}
                style={{
                  pointerEvents: "auto",
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                📍 Yuborish ({markers.length})
              </button>
              <button
                onClick={handleClear}
                style={{
                  pointerEvents: "auto",
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                🗑️ Tozalash
              </button>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div
                style={{
                  pointerEvents: "none",
                  background: "rgba(0,0,0,0.7)",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: 6,
                  fontWeight: 500,
                }}
              >
                {currentRoom?.name || `Xona ${currentRoomIndex + 1}`}
              </div>

              <button

                onClick={() => navigate(-1)}
                style={{
                  pointerEvents: "auto",
                  padding: 10,
                  backgroundColor: "#1f2937",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                {showControls ? "✕" : "☰"}
              </button>
            </div>
          </div>
          {imagesData && imagesData.length > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 12,
                background: "rgba(0,0,0,0.7)",
                padding: "12px 16px",
                borderRadius: 12,
              }}
            >
              {imagesData.map((room, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRoomChange(idx)}
                  style={{
                    pointerEvents: "auto",
                    padding: "8px 16px",
                    borderRadius: 6,
                    border: "2px solid",
                    borderColor: idx === currentRoomIndex ? "#2563eb" : "transparent",
                    background: idx === currentRoomIndex ? "#2563eb" : "rgba(255,255,255,0.1)",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 500,
                    transition: "all 0.2s",
                  }}
                >
                  {room?.name || `Xona ${idx + 1}`}
                </button>
              ))}
            </div>
          )}
        </div>
      </Html>
    </>
  );
}