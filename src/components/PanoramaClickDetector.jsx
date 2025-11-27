import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

/**
 * Robust click detector:
 * - double click (desktop) + double tap (mobile) fallback
 * - optional single click if isDoubleClick=false
 */
export default function PanoramaClickDetector({
  cubeRef,
  onClickPoint,
  isDoubleClick = false,
  doubleDelay = 300,      // ms ichida 2ta tap -> double
  moveTolerance = 5,      // px
}) {
  const { camera, gl } = useThree();
  const raycasterRef = useRef(new THREE.Raycaster());
  const lastTapRef = useRef(0);
  const downPosRef = useRef({ x: 0, y: 0 });
  const movedRef = useRef(false);

  useEffect(() => {
    // mobil pointer eventlar uchun kerak — aks holda browser gesture-lari aralashadi
    gl.domElement.style.touchAction = "none";
  }, [gl]);

  const raycastAt = (clientX, clientY) => {
    if (!cubeRef.current) return null;
    const rect = gl.domElement.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;

    const mouse = new THREE.Vector2(x, y);
    const raycaster = raycasterRef.current;
    raycaster.setFromCamera(mouse, camera);

    // Kub ichkarisidagi devorga urilsin
    const hit = raycaster.intersectObject(cubeRef.current, true);
    if (hit && hit.length > 0) return hit[0].point.clone();
    return null;
  };

  useEffect(() => {
    const dom = gl.domElement;

    const onPointerDown = (e) => {
      downPosRef.current = { x: e.clientX ?? (e.touches?.[0]?.clientX || 0), y: e.clientY ?? (e.touches?.[0]?.clientY || 0) };
      movedRef.current = false;
    };

    const onPointerMove = (e) => {
      const x = e.clientX ?? (e.touches?.[0]?.clientX || 0);
      const y = e.clientY ?? (e.touches?.[0]?.clientY || 0);
      const dx = Math.abs(x - downPosRef.current.x);
      const dy = Math.abs(y - downPosRef.current.y);
      if (dx > moveTolerance || dy > moveTolerance) movedRef.current = true;
    };

    const handleHit = (clientX, clientY) => {
      const p = raycastAt(clientX, clientY);
      if (p) onClickPoint?.(p);
    };

    const onPointerUp = (e) => {
      const now = Date.now();
      const x = e.clientX ?? (e.changedTouches?.[0]?.clientX || 0);
      const y = e.clientY ?? (e.changedTouches?.[0]?.clientY || 0);
      if (movedRef.current) return; // drag bo'lsa qo‘ymaymiz

      if (isDoubleClick) {
        // double tap/click aniqlash
        if (now - lastTapRef.current < doubleDelay) {
          handleHit(x, y);
          lastTapRef.current = 0;
        } else {
          lastTapRef.current = now;
        }
      } else {
        // single click rejimi
        handleHit(x, y);
      }
    };

    // Desktop dblclick-ni bevosita ham tinglaymiz (agar brauzer yuborsa)
    const onDblClick = (e) => {
      if (!isDoubleClick) return;
      handleHit(e.clientX, e.clientY);
    };

    dom.addEventListener("pointerdown", onPointerDown, { passive: true });
    dom.addEventListener("pointermove", onPointerMove, { passive: true });
    dom.addEventListener("pointerup", onPointerUp, { passive: true });
    dom.addEventListener("dblclick", onDblClick, { passive: true });

    return () => {
      dom.removeEventListener("pointerdown", onPointerDown);
      dom.removeEventListener("pointermove", onPointerMove);
      dom.removeEventListener("pointerup", onPointerUp);
      dom.removeEventListener("dblclick", onDblClick);
    };
  }, [camera, gl, cubeRef, isDoubleClick, doubleDelay, moveTolerance, onClickPoint]);

  return null;
}
