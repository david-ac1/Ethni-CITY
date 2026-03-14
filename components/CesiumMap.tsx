"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export interface CesiumMapHandle {
  flyTo: (lat: number, lng: number, altitude?: number) => void;
}

interface CesiumMapProps {
  className?: string;
}

// Dynamic cesium import — only runs in browser
let Cesium: typeof import("cesium") | null = null;

const CesiumMap = forwardRef<CesiumMapHandle, CesiumMapProps>(function CesiumMap(
  { className },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<import("cesium").Viewer | null>(null);

  useImperativeHandle(ref, () => ({
    flyTo: (lat: number, lng: number, altitude = 800) => {
      if (!viewerRef.current || !Cesium) return;
      viewerRef.current.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lng, lat, altitude),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-45),
          roll: 0,
        },
        duration: 3.5,
        easingFunction: Cesium.EasingFunction.QUARTIC_IN_OUT,
      });
    },
  }));

  useEffect(() => {
    let viewer: import("cesium").Viewer | null = null;

    async function initCesium() {
      if (!containerRef.current || viewerRef.current) return;

      // Dynamically import cesium only in browser
      const cesiumModule = await import("cesium");
      // @ts-expect-error - Cesium CSS doesn't have type declarations
      await import("cesium/Build/Cesium/Widgets/widgets.css");
      
      // Tell Cesium where to find its static assets (copied via copy-webpack-plugin)
      window.CESIUM_BASE_URL = '/cesium/';
      cesiumModule.buildModuleUrl.setBaseUrl('/cesium/');
      
      Cesium = cesiumModule;

      cesiumModule.Ion.defaultAccessToken =
        process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN || "";

      viewer = new cesiumModule.Viewer(containerRef.current, {
        // Use Google Maps 3D Photorealistic Tiles
        terrainProvider: undefined,
        baseLayerPicker: false,
        navigationHelpButton: false,
        sceneModePicker: false,
        homeButton: false,
        timeline: false,
        animation: false,
        geocoder: false,
        fullscreenButton: false,
        infoBox: false,
        selectionIndicator: false,
        shadows: false,
      });

      // Enable Google Maps Photorealistic 3D Tiles
      if (process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN) {
        try {
          const tileset = await cesiumModule.createGooglePhotorealistic3DTileset({});
          viewer.scene.primitives.add(tileset);
        } catch {
          console.log("Google 3D tiles unavailable — using default terrain");
        }
      }

      // Start over a compelling global view
      viewer.camera.setView({
        destination: cesiumModule.Cartesian3.fromDegrees(20, 5, 15000000),
        orientation: {
          heading: cesiumModule.Math.toRadians(0),
          pitch: cesiumModule.Math.toRadians(-90),
          roll: 0,
        },
      });

      // Style the scene
      viewer.scene.backgroundColor = cesiumModule.Color.fromCssColorString("#1b0f23");
      if (viewer.scene.fog) viewer.scene.fog.enabled = false;

      viewerRef.current = viewer;
    }

    initCesium();

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
});

export default CesiumMap;
