import { Canvas } from "@react-three/fiber";
//@ts-ignore
import EditPanoramaScene from "../components/EditPanoramaScene";

export default function EditVizual() {
  return (
    <div style={{ width: "100%", height: "100vh", background: "#000" }}>
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75, near: 0.001, far: 2000 }}>
        <EditPanoramaScene />
      </Canvas>
    </div>
  );
}
