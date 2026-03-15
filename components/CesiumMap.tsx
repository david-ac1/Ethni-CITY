"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export interface CesiumMapHandle {
  flyTo: (lat: number, lng: number, altitude?: number) => void;
}

interface CesiumMapProps {
  className?: string;
  onLocationChange?: (lat: number, lng: number) => void;
}

// Dynamic cesium import — only runs in browser
let Cesium: typeof import("cesium") | null = null;

const CesiumMap = forwardRef<CesiumMapHandle, CesiumMapProps>(function CesiumMap(
  { className, onLocationChange },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<import("cesium").Viewer | null>(null);
  const pinEntityRef = useRef<import("cesium").Entity | null>(null);

  useImperativeHandle(ref, () => ({
    flyTo: (lat: number, lng: number, altitude = 800) => {
      if (!viewerRef.current || !Cesium) return;
      
      const destination = Cesium.Cartesian3.fromDegrees(lng, lat, altitude);
      
      // Update pin position when flying
      if (pinEntityRef.current) {
        pinEntityRef.current.position = Cesium.Cartesian3.fromDegrees(lng, lat) as any;
      }

      viewerRef.current.camera.flyTo({
        destination,
        orientation: {
          heading: Cesium.Math.toRadians(15), // Slight tilt for dynamism
          pitch: Cesium.Math.toRadians(-35), // More panoramic view
          roll: 0,
        },
        duration: 5.5, // Even more cinematic
        easingFunction: Cesium.EasingFunction.HERMITE_OUT, // Smoother finish
      });
    },
  }));

  useEffect(() => {
    let viewer: import("cesium").Viewer | null = null;

    async function initCesium() {
      if (!containerRef.current || viewerRef.current) return;

      const cesiumModule = await import("cesium");
      // @ts-expect-error - Cesium CSS doesn't have type declarations
      await import("cesium/Build/Cesium/Widgets/widgets.css");
      
      window.CESIUM_BASE_URL = '/cesium/';
      cesiumModule.buildModuleUrl.setBaseUrl('/cesium/');
      
      Cesium = cesiumModule;

      cesiumModule.Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN || "";

      viewer = new cesiumModule.Viewer(containerRef.current, {
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
          console.log("Google 3D tiles unavailable");
        }
      }

      // Add Interactive Pin
      const pinBuilder = new cesiumModule.PinBuilder();
      const pinEntity = viewer.entities.add({
        id: "active-location-pin",
        name: "Sonic Target",
        position: cesiumModule.Cartesian3.fromDegrees(20, 5), // Initial
        billboard: {
          image: pinBuilder.fromColor(cesiumModule.Color.fromCssColorString("#9c06f9"), 48).toDataURL(),
          verticalOrigin: cesiumModule.VerticalOrigin.BOTTOM,
          heightReference: cesiumModule.HeightReference.RELATIVE_TO_GROUND,
        },
      });
      pinEntityRef.current = pinEntity;

      // Handle Map Clicks to move the pin
      const handler = new cesiumModule.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction((movement: any) => {
        if (!Cesium || !viewer) return;
        const cartesian = viewer.scene.pickPosition(movement.position);
        if (Cesium.defined(cartesian)) {
          const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          const lng = Cesium.Math.toDegrees(cartographic.longitude);
          const lat = Cesium.Math.toDegrees(cartographic.latitude);
          
          // Move pin visually
          pinEntity.position = cartesian as any;
          
          // Notify parent
          if (onLocationChange) onLocationChange(lat, lng);
        }
      }, cesiumModule.ScreenSpaceEventType.LEFT_CLICK);

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
  }, [onLocationChange]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
});

export default CesiumMap;
