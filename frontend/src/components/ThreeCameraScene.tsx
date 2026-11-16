'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ThreeCameraScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setIsSupported(false);
        return;
      }
    } catch {
      setIsSupported(false);
      return;
    }

    const width = currentMount.clientWidth || 400;
    const height = currentMount.clientHeight || 400;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Camera Lens Group
    const lensGroup = new THREE.Group();

    // 1. Outer Lens Barrel (Dark Anodized Matte)
    const barrelGeo = new THREE.CylinderGeometry(1.6, 1.8, 2.2, 48, 1, false);
    const barrelMat = new THREE.MeshStandardMaterial({
      color: 0x141414,
      metalness: 0.85,
      roughness: 0.35,
    });
    const barrel = new THREE.Mesh(barrelGeo, barrelMat);
    barrel.rotation.x = Math.PI / 2;
    lensGroup.add(barrel);

    // 2. Gold Accent Focus Ring (Luxury Gold #C5A46D)
    const goldRingGeo = new THREE.TorusGeometry(1.72, 0.08, 16, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xc5a46d,
      metalness: 0.95,
      roughness: 0.2,
      emissive: 0x42341c,
      emissiveIntensity: 0.25,
    });
    const goldRing1 = new THREE.Mesh(goldRingGeo, goldMat);
    goldRing1.position.z = 0.5;
    lensGroup.add(goldRing1);

    const goldRing2 = new THREE.Mesh(goldRingGeo, goldMat);
    goldRing2.position.z = -0.5;
    goldRing2.scale.set(0.95, 0.95, 0.95);
    lensGroup.add(goldRing2);

    // 3. Ribbed Rubber Focus Grip
    const gripGeo = new THREE.CylinderGeometry(1.7, 1.7, 0.7, 64, 1, true);
    const gripMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.9,
      metalness: 0.1,
    });
    const grip = new THREE.Mesh(gripGeo, gripMat);
    grip.rotation.x = Math.PI / 2;
    grip.position.z = 0.1;
    lensGroup.add(grip);

    // 4. Optical Front Glass Element (Convex lens with iridescent reflection)
    const glassGeo = new THREE.SphereGeometry(1.35, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.4);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a2e3b,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.7,
      thickness: 0.5,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.rotation.x = -Math.PI / 2;
    glass.position.z = 0.9;
    lensGroup.add(glass);

    // 5. Aperture Blades Ring (Inner mechanism)
    const apertureRingGeo = new THREE.RingGeometry(0.4, 1.2, 32);
    const apertureMat = new THREE.MeshStandardMaterial({
      color: 0x1f1f1f,
      metalness: 0.8,
      roughness: 0.4,
      side: THREE.DoubleSide,
    });
    const aperture = new THREE.Mesh(apertureRingGeo, apertureMat);
    aperture.position.z = 0.4;
    lensGroup.add(aperture);

    scene.add(lensGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.DirectionalLight(0xc5a46d, 3.0);
    goldKeyLight.position.set(4, 5, 5);
    scene.add(goldKeyLight);

    const blueFillLight = new THREE.DirectionalLight(0x4a75a0, 1.8);
    blueFillLight.position.set(-4, -3, 3);
    scene.add(blueFillLight);

    const rimLight = new THREE.PointLight(0xffffff, 2.5, 10);
    rimLight.position.set(0, 3, -2);
    scene.add(rimLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      mouseX = (x / rect.width) * 2;
      mouseY = (y / rect.height) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous subtle levitation & idle rotation
      lensGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

      // Smooth lerp to mouse position
      targetRotationY = mouseX * 0.5 + Math.sin(elapsedTime * 0.4) * 0.15;
      targetRotationX = -mouseY * 0.4 + 0.1;

      lensGroup.rotation.y += (targetRotationY - lensGroup.rotation.y) * 0.05;
      lensGroup.rotation.x += (targetRotationX - lensGroup.rotation.x) * 0.05;

      // Gentle aperture pulse
      aperture.rotation.z = elapsedTime * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (!isSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="relative w-64 h-64 rounded-full border border-gold/40 flex items-center justify-center shadow-2xl bg-card-bg/60">
          <div className="w-48 h-48 rounded-full border border-gold/60 flex items-center justify-center animate-spin" style={{ animationDuration: '20s' }}>
            <div className="w-32 h-32 rounded-full border-2 border-gold flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gold/20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-2 px-3 py-1 rounded-full bg-card-bg/80 border border-gold/30 text-[11px] text-gold tracking-widest uppercase">
        <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
        Interactive 3D Master Cinema Lens • Move Cursor
      </div>
    </div>
  );
}
