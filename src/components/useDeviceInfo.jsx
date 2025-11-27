import { useState, useEffect } from "react";

function getBasicInfo() {
  return {
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    screenWidth: window.screen?.width ?? null,
    screenHeight: window.screen?.height ?? null,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    deviceMemory: navigator.deviceMemory ?? null,
    cpuCores: navigator.hardwareConcurrency ?? null,
    isTouch: ('ontouchstart' in window) || (navigator.maxTouchPoints > 0),
    prefersDark: window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches,
    connection: navigator.connection ? {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink
    } : null
  };
}

export function useDeviceInfo() {
  const [info, setInfo] = useState(() => getBasicInfo());

  useEffect(() => {
    function onResizeOrChange() {
      setInfo(getBasicInfo());
    }

    window.addEventListener("resize", onResizeOrChange);

    // prefers-color-scheme listener
    let mq;
    if (window.matchMedia) {
      mq = window.matchMedia("(prefers-color-scheme: dark)");
      if (mq.addEventListener) mq.addEventListener("change", onResizeOrChange);
      else mq.addListener(onResizeOrChange);
    }

    // network changes
    const conn = navigator.connection;
    if (conn && conn.addEventListener) conn.addEventListener("change", onResizeOrChange);

    return () => {
      window.removeEventListener("resize", onResizeOrChange);
      if (mq) {
        if (mq.removeEventListener) mq.removeEventListener("change", onResizeOrChange);
        else mq.removeListener(onResizeOrChange);
      }
      if (conn && conn.removeEventListener) conn.removeEventListener("change", onResizeOrChange);
    };
  }, []);

  return {
    info,
    // helper: get geolocation (asks permission)
    getLocation: () =>
      new Promise((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error("geolocation not supported"));
        navigator.geolocation.getCurrentPosition(
          pos => resolve(pos.coords),
          err => reject(err),
          { enableHighAccuracy: false, timeout: 10000 }
        );
      }),
    // helper: get battery (if supported)
    getBattery: () =>
      (navigator.getBattery ? navigator.getBattery() : Promise.reject(new Error("Battery API not supported")))
  };
}
