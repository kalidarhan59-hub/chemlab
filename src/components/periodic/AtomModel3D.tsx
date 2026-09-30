import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ChemicalElement } from '../../types/element';

export interface AtomModel3DProps {
  element: ChemicalElement;
  className?: string;
}

export const AtomModel3D: React.FC<AtomModel3DProps> = ({ element, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 16;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x14b8a6, 3, 40);
    pointLight.position.set(8, 8, 10);
    scene.add(pointLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Central Nucleus (Protons & Neutrons cluster)
    const nucleusGroup = new THREE.Group();
    rootGroup.add(nucleusGroup);

    const nucleusCount = Math.min(element.number, 18);
    const protonMat = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Red protons
      roughness: 0.3,
      emissive: 0xef4444,
      emissiveIntensity: 0.3,
    });
    const neutronMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6, // Blue neutrons
      roughness: 0.3,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.2,
    });

    const nucleusGeo = new THREE.SphereGeometry(0.35, 16, 16);
    for (let i = 0; i < nucleusCount; i++) {
      const mat = i % 2 === 0 ? protonMat : neutronMat;
      const mesh = new THREE.Mesh(nucleusGeo, mat);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const rad = 0.5 * Math.cbrt(Math.random());
      mesh.position.set(
        rad * Math.sin(phi) * Math.cos(theta),
        rad * Math.sin(phi) * Math.sin(theta),
        rad * Math.cos(phi)
      );
      nucleusGroup.add(mesh);
    }

    // 2. Electron Shells & Orbiting Electrons
    const shellRadii = [2.2, 3.4, 4.6, 5.8, 7.0, 8.2, 9.4];
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x14b8a6,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });

    const electronMat = new THREE.MeshStandardMaterial({
      color: 0x2dd4bf,
      emissive: 0x14b8a6,
      emissiveIntensity: 0.8,
    });
    const electronGeo = new THREE.SphereGeometry(0.18, 12, 12);

    interface ElectronObj {
      mesh: THREE.Mesh;
      radius: number;
      speed: number;
      angle: number;
      tiltX: number;
      tiltY: number;
    }
    const electrons: ElectronObj[] = [];

    const shells = element.shells || [1];
    shells.forEach((electronCount, shellIdx) => {
      const r = shellRadii[shellIdx] || (2.2 + shellIdx * 1.2);

      // Ring path
      const ringGeo = new THREE.RingGeometry(r - 0.02, r + 0.02, 48);
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      // Random slight tilt per shell for multi-dimensional atom look
      const tiltX = (shellIdx * 0.3) - 0.5;
      const tiltY = (shellIdx * 0.4) - 0.4;
      ringMesh.rotation.x = tiltX;
      ringMesh.rotation.y = tiltY;
      rootGroup.add(ringMesh);

      // Distribute electrons on this shell (capped for performance on heavy atoms)
      const renderElectronsCount = Math.min(electronCount, 12);
      for (let e = 0; e < renderElectronsCount; e++) {
        const eMesh = new THREE.Mesh(electronGeo, electronMat);
        rootGroup.add(eMesh);
        electrons.push({
          mesh: eMesh,
          radius: r,
          speed: 0.025 / Math.sqrt(shellIdx + 1),
          angle: (e / renderElectronsCount) * Math.PI * 2,
          tiltX,
          tiltY,
        });
      }
    });

    // 3. Mouse / Touch Drag Interaction
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotX = 0.2;
    let rotY = 0.4;

    const onPointerDown = (ev: MouseEvent | TouchEvent) => {
      isDragging = true;
      const x = 'touches' in ev ? ev.touches[0].clientX : ev.clientX;
      const y = 'touches' in ev ? ev.touches[0].clientY : ev.clientY;
      prevMouse = { x, y };
    };

    const onPointerMove = (ev: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const x = 'touches' in ev ? ev.touches[0].clientX : ev.clientX;
      const y = 'touches' in ev ? ev.touches[0].clientY : ev.clientY;
      const dx = x - prevMouse.x;
      const dy = y - prevMouse.y;
      rotY += dx * 0.008;
      rotX += dy * 0.008;
      prevMouse = { x, y };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    dom.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    dom.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging) {
        rotY += 0.005;
      }

      rootGroup.rotation.y += (rotY - rootGroup.rotation.y) * 0.06;
      rootGroup.rotation.x += (rotX - rootGroup.rotation.x) * 0.06;

      nucleusGroup.rotation.y += 0.01;
      nucleusGroup.rotation.z += 0.007;

      // Update electron orbits
      electrons.forEach((el) => {
        el.angle += el.speed;
        const x = Math.cos(el.angle) * el.radius;
        const y = Math.sin(el.angle) * el.radius;

        // Apply tilts
        const pos = new THREE.Vector3(x, y, 0);
        pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), el.tiltX);
        pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), el.tiltY);

        el.mesh.position.copy(pos);
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onPointerDown);
      dom.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      dom.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
      renderer.dispose();
      nucleusGeo.dispose();
      electronGeo.dispose();
      protonMat.dispose();
      neutronMat.dispose();
      ringMat.dispose();
      electronMat.dispose();
    };
  }, [element]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[260px] sm:h-[300px] cursor-grab active:cursor-grabbing select-none ${className}`}
    />
  );
};
