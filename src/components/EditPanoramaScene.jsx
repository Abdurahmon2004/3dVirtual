import * as THREE from "three";
import {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useUpdatePlanHome,
  useGetByIdPlanHome, usePlanHomes
} from "@/hooks/modules/plan.home";
import { buildStorageUrl } from "@/constants/urls";

export default function EditPanoramaScene() {
  const [searchParams] = useSearchParams();
  const plan_item_id = searchParams.get("plan_item_id");
  const plan_id = searchParams.get('plan_id');
  const [page, setPage] = useState(1);
  const { gl } = useThree();
  const navigate = useNavigate();
  const { data: planHomes, refetch } = usePlanHomes({ page, plan_id });
  console.log(planHomes);

  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagesData, setImagesData] = useState([]);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [editHotspot, setEditHotspot] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [selectedPlanHome, setSelectedPlanHome] = useState("");
  const { data } = useGetByIdPlanHome(plan_item_id);
  const { mutate } = useUpdatePlanHome();

  useEffect(() => {
    if (!data) return;

    const texturesArr = [
      data.textures.posx,
      data.textures.negx,
      data.textures.posy,
      data.textures.negy,
      data.textures.posz,
      data.textures.negz,
    ];

    setImagesData([
      {
        id: data.id,
        name: data.name,
        hotspots: data.hotspots || [],
        textures: texturesArr,
        plan_id: data.plan_id,
      },
    ]);
  }, [data]);

  useEffect(() => {
    if (gl?.domElement?.style) {
      gl.domElement.style.touchAction = "none";
    }
  }, [gl]);

  const currentRoom = imagesData[currentRoomIndex];
  const previews = currentRoom?.textures || [];
  const hotspots = currentRoom?.hotspots || [];

  const innerRadius = 250 - 2;

  const materials = useMemo(() => {
    if (!previews.length) return null;

    const manager = new THREE.LoadingManager();

    manager.onStart = () => setIsLoading(true);
    manager.onLoad = () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsTransitioning(false);
        setIsLoading(false);
      }, 250);
    };

    const loader = new THREE.TextureLoader(manager);

    return previews.map((relativeUrl) => {
      const tex = loader.load(buildStorageUrl(relativeUrl));
      tex.colorSpace = THREE.SRGBColorSpace;

      return new THREE.MeshBasicMaterial({
        map: tex,
        side: THREE.BackSide,
      });
    });
  }, [previews]);

  const lastClick = useRef(0);

  const addMarkerAtPoint = useCallback((point) => {
    const pos = point.clone().normalize().multiplyScalar(innerRadius);

    setMarkers((prev) => [
      ...prev,
      {
        id: "marker_" + Date.now(),
        position: pos,
        targetRoom: null,
        label: "Marker",
      },
    ]);
  }, []);

  const handlePointerUp = (e) => {
    // const now = Date.now();
    // if (now - lastClick.current < 250) {
    //   addMarkerAtPoint(e.point);
    // }
    // lastClick.current = now;
  };

  const removeMarker = (i) => {
    setMarkers((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = () => {
    const mergedHotspots = [
      ...hotspots,
      ...markers.map((m) => ({
        id: m.id,
        label: m.label,
        targetRoom: m.targetRoom,
        position: {
          x: +m.position.x.toFixed(2),
          y: +m.position.y.toFixed(2),
          z: +m.position.z.toFixed(2),
        },
      })),
    ];

    const fd = new FormData();
    fd.append("plan_item_id", currentRoom.plan_id);
    fd.append("name", currentRoom.name);
    fd.append("hotspots", JSON.stringify(mergedHotspots));

    mutate(fd, {
      onSuccess: () => {
        navigate(`/settings/plan-homes?plan_id=${currentRoom.plan_id}`);
      },
    });
  };

  const openHotspotModal = (h) => {
    setEditHotspot(h);
    setEditLabel(h.label);
  };

  const handleSaveHotspot = () => {
    const updatedHotspots = hotspots.map((h) =>
      h.id === editHotspot.id ? { ...editHotspot, label: editLabel } : h
    );

    setImagesData((prev) => {
      const copy = [...prev];
      copy[currentRoomIndex].hotspots = updatedHotspots;
      return copy;
    });

    setEditHotspot(null);
  };

  const HotspotSVG = () => (
    <svg
      width="46"
      height="46"
      viewBox="0 0 46 46"
      style={{
        display: "block",
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
  );

  return (
    <>
      {/* LOADER */}
      {(isLoading || isTransitioning) && (
        <Html fullscreen>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 20,
              zIndex: 99,
            }}
          >
            {isLoading ? "Yuklanmoqda..." : "Xonaga o'tilmoqda..."}
          </div>
        </Html>
      )}

      {/* PANORAMA */}
      {materials && (
        <mesh material={materials} onPointerUp={handlePointerUp}>
          <boxGeometry args={[500, 500, 500]} />
        </mesh>
      )}

      {/* EXISTING HOTSPOTS */}
      {hotspots.map((h, i) => {
        const pos = new THREE.Vector3(
          h.position.x,
          h.position.y,
          h.position.z
        )
          .normalize()
          .multiplyScalar(innerRadius);

        return (
          <group key={i} position={pos}>
            <Html
              center
              distanceFactor={300}
              style={{ pointerEvents: "auto" }}
            >
              <div
                onClick={() => openHotspotModal(h)}
                style={{ cursor: "pointer" }}
              >
                <HotspotSVG />
              </div>
            </Html>
          </group>
        );
      })}

      {/* NEW MARKERS */}
      {markers.map((m, i) => (
        <group key={m.id} position={m.position}>
          <Html
            center
            distanceFactor={300}
            style={{ pointerEvents: "auto" }}
          >
            <div
              onClick={() => removeMarker(i)}
              style={{ cursor: "pointer" }}
            >
              <HotspotSVG />
            </div>
          </Html>
        </group>
      ))}

      {/* CONTROLS */}
      <OrbitControls enableZoom={true} enablePan={false} rotateSpeed={0.4} />

      {/* SAVE BUTTON */}
      <Html fullscreen>
        <div
          style={{
            position: "absolute",
            bottom: 30,
            right: 30,
            zIndex: 999,
          }}
        >
          <button
            onClick={handleSubmit}
            style={{
              padding: "12px 20px",
              background: "#3b82f6",
              color: "white",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Saqlash
          </button>
        </div>
      </Html>

      {/* EDIT MODAL */}
      {editHotspot && (
        <Html fullscreen>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99,
            }}
          >
            <div
              style={{
                background: "white",
                padding: 20,
                borderRadius: 10,
                width: 600,
              }}
            >
              <h3 style={{ fontWeight: "bold", marginBottom: 8 }}>
                Hotspotni tahrirlash
              </h3>

              <select
                style={{
                  border: "1px solid #ccc",
                  width: "100%",
                  padding: 8,
                  marginBottom: 12,
                  borderRadius: 4,
                }}
                value={selectedPlanHome}
                onChange={(e) => setSelectedPlanHome(e.target.value)}
              >
                <option value="" selected disabled>Xonani tanlang</option>

                {planHomes?.data?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>


              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={() => setEditHotspot(null)}
                  style={{
                    padding: "6px 12px",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleSaveHotspot}
                  style={{
                    background: "#3b82f6",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: 4,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        </Html>
      )}
    </>
  );
}