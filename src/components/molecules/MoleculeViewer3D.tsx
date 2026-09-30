import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { Play, Pause } from 'lucide-react';
import { MoleculeGraph } from '../../types/molecule';
import elementsBasicData from '../../data/elementsBasic.json';
import { ElementData } from '../../types/molecule';
import { generate3DLayout } from '../../utils/mol/layout3d';

export interface MoleculeViewer3DRef {
  getSnapshotDataUrl: () => string | null;
}

interface MoleculeViewer3DProps {
  graph: MoleculeGraph;
  lang: 'kk' | 'ru' | 'en';
}

type RenderMode = 'ball_stick' | 'space_filling' | 'wireframe';

const elementsMap = new Map<string, ElementData>(
  (elementsBasicData as ElementData[]).map((e) => [e.symbol, e])
);

// Standard Van der Waals radii (Angstroms)
const VDW_RADII: Record<string, number> = {
  H: 1.20,
  C: 1.70,
  N: 1.55,
  O: 1.52,
  F: 1.47,
  Cl: 1.75,
  Br: 1.85,
  I: 1.98,
  P: 1.80,
  S: 1.80,
  Na: 2.27,
  Fe: 2.00,
  Cu: 1.40,
  Zn: 1.39,
};

export const MoleculeViewer3D = forwardRef<MoleculeViewer3DRef, MoleculeViewer3DProps>(
  ({ graph, lang }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const groupRef = useRef<THREE.Group | null>(null);
    const animFrameRef = useRef<number | null>(null);

    const [renderMode, setRenderMode] = useState<RenderMode>('ball_stick');
    const [autoRotate, setAutoRotate] = useState(true);

    // Orbit control state
    const isDraggingRef = useRef(false);
    const prevMousePosRef = useRef({ x: 0, y: 0 });

    useImperativeHandle(ref, () => ({
      getSnapshotDataUrl: () => {
        if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return null;
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        return rendererRef.current.domElement.toDataURL('image/png');
      },
    }));

    // Setup Three.js scene
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth || 600;
      const height = container.clientHeight || 480;

      // 1. Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#0b1324');
      sceneRef.current = scene;

      // 2. Camera
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 7.5);
      cameraRef.current = camera;

      // 3. Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;
      container.appendChild(renderer.domElement);

      // 4. Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight1.position.set(8, 12, 10);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.5);
      dirLight2.position.set(-8, -10, -6);
      scene.add(dirLight2);

      // 5. Group for molecule objects
      const molGroup = new THREE.Group();
      scene.add(molGroup);
      groupRef.current = molGroup;

      // Animation Loop
      const animate = () => {
        if (autoRotate && groupRef.current && !isDraggingRef.current) {
          groupRef.current.rotation.y += 0.006;
          groupRef.current.rotation.x += 0.002;
        }
        renderer.render(scene, camera);
        animFrameRef.current = requestAnimationFrame(animate);
      };
      animate();

      // Resize observer
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = entry.contentRect.width;
          const h = entry.contentRect.height;
          if (w > 0 && h > 0) {
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
          }
        }
      });
      resizeObserver.observe(container);

      // --- Interactive Pointer & Touch Controls ---
      const handlePointerDown = (x: number, y: number) => {
        isDraggingRef.current = true;
        prevMousePosRef.current = { x, y };
      };

      const handlePointerMove = (x: number, y: number) => {
        if (!isDraggingRef.current || !groupRef.current) return;
        const dx = x - prevMousePosRef.current.x;
        const dy = y - prevMousePosRef.current.y;
        groupRef.current.rotation.y += dx * 0.008;
        groupRef.current.rotation.x += dy * 0.008;
        prevMousePosRef.current = { x, y };
      };

      const handlePointerUp = () => {
        isDraggingRef.current = false;
      };

      // Mouse events
      const onMouseDown = (e: MouseEvent) => handlePointerDown(e.clientX, e.clientY);
      const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
      const onMouseUp = () => handlePointerUp();

      // Touch events (mobile compatibility)
      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
        }
      };
      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      };
      const onTouchEnd = () => handlePointerUp();

      // Mouse Wheel Zoom
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        camera.position.z = Math.min(20, Math.max(2.5, camera.position.z + e.deltaY * 0.008));
      };

      const dom = renderer.domElement;
      dom.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      dom.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onTouchEnd);

      dom.addEventListener('wheel', onWheel, { passive: false });

      return () => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        resizeObserver.disconnect();

        dom.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

        dom.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);

        dom.removeEventListener('wheel', onWheel);

        if (container.contains(dom)) container.removeChild(dom);
        renderer.dispose();
      };
    }, []);

    // Rebuild 3D Molecule Mesh on graph or renderMode change
    useEffect(() => {
      const group = groupRef.current;
      if (!group) return;

      // Clear previous meshes
      while (group.children.length > 0) {
        const obj = group.children[0] as THREE.Mesh;
        if (obj.geometry) obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else if (obj.material) {
          obj.material.dispose();
        }
        group.remove(obj);
      }

      if (!graph.atoms || graph.atoms.length === 0) return;

      // Compute 3D coordinates
      const positions3D = generate3DLayout(graph);

      // Shared Geometries
      const sphereGeoHigh = new THREE.SphereGeometry(1, 32, 32);
      const cylinderGeo = new THREE.CylinderGeometry(1, 1, 1, 16);

      // Render Atoms
      graph.atoms.forEach((atom) => {
        const pos = positions3D.get(atom.id) || { x: 0, y: 0, z: 0 };
        const el = elementsMap.get(atom.element);
        const hexColor = el?.cpkColor || '#64748B';

        let radius = 0.45;
        if (renderMode === 'space_filling') {
          const vdw = VDW_RADII[atom.element] || 1.7;
          radius = vdw * 0.48;
        } else if (renderMode === 'wireframe') {
          radius = 0.18;
        } else {
          // Ball and stick
          radius = atom.element === 'H' ? 0.28 : 0.45;
        }

        const mat = new THREE.MeshStandardMaterial({
          color: hexColor,
          roughness: 0.2,
          metalness: 0.1,
          wireframe: renderMode === 'wireframe',
        });

        const sphere = new THREE.Mesh(sphereGeoHigh, mat);
        sphere.position.set(pos.x, pos.y, pos.z);
        sphere.scale.set(radius, radius, radius);
        group.add(sphere);
      });

      // Render Bonds (Ball & Stick and Wireframe modes)
      if (renderMode !== 'space_filling') {
        const bondMat = new THREE.MeshStandardMaterial({
          color: 0x94a3b8,
          roughness: 0.35,
          metalness: 0.15,
          wireframe: renderMode === 'wireframe',
        });

        graph.bonds.forEach((bond) => {
          const p1 = positions3D.get(bond.a);
          const p2 = positions3D.get(bond.b);
          if (!p1 || !p2) return;

          const v1 = new THREE.Vector3(p1.x, p1.y, p1.z);
          const v2 = new THREE.Vector3(p2.x, p2.y, p2.z);
          const distance = v1.distanceTo(v2);
          const midPoint = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);

          const dir = new THREE.Vector3().subVectors(v2, v1).normalize();
          const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

          // Find orthogonal vector perpendicular to bond axis
          const arbitrary = Math.abs(dir.y) < 0.85 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
          const ortho = new THREE.Vector3().crossVectors(dir, arbitrary).normalize();

          const bondRadius = renderMode === 'wireframe' ? 0.03 : 0.07;
          const multiOffset = 0.12;

          const createCylinder = (offsetVector: THREE.Vector3) => {
            const cylinder = new THREE.Mesh(cylinderGeo, bondMat);
            cylinder.scale.set(bondRadius, distance, bondRadius);
            cylinder.position.copy(midPoint).add(offsetVector);
            cylinder.quaternion.copy(quat);
            group.add(cylinder);
          };

          if (bond.order === 1) {
            createCylinder(new THREE.Vector3(0, 0, 0));
          } else if (bond.order === 2) {
            createCylinder(ortho.clone().multiplyScalar(multiOffset));
            createCylinder(ortho.clone().multiplyScalar(-multiOffset));
          } else if (bond.order === 3) {
            createCylinder(new THREE.Vector3(0, 0, 0));
            createCylinder(ortho.clone().multiplyScalar(multiOffset * 1.4));
            createCylinder(ortho.clone().multiplyScalar(-multiOffset * 1.4));
          }
        });
      }
    }, [graph, renderMode]);

    const t = {
      ballStick: lang === 'kk' ? 'Шаро-өзекшелі' : lang === 'ru' ? 'Шаро-стержневая' : 'Ball & Stick',
      spaceFilling: lang === 'kk' ? 'Көлемдік (Ван-дер-Ваальс)' : lang === 'ru' ? 'Объёмная (Ван-дер-Ваальс)' : 'Space-filling',
      wireframe: lang === 'kk' ? 'Қаңқалық' : lang === 'ru' ? 'Каркасная' : 'Wireframe',
      autoRotate: lang === 'kk' ? 'Авто-айналу' : lang === 'ru' ? 'Авто-вращение' : 'Auto-rotate',
    };

    return (
      <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-950 shadow-2xl flex flex-col">
        {/* Controls Overlay */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 shadow-md">
          <button
            type="button"
            onClick={() => setRenderMode('ball_stick')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              renderMode === 'ball_stick'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.ballStick}
          </button>
          <button
            type="button"
            onClick={() => setRenderMode('space_filling')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              renderMode === 'space_filling'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.spaceFilling}
          </button>
          <button
            type="button"
            onClick={() => setRenderMode('wireframe')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              renderMode === 'wireframe'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.wireframe}
          </button>

          <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />

          {/* Auto rotate toggle */}
          <button
            type="button"
            onClick={() => setAutoRotate((a) => !a)}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              autoRotate ? 'text-teal-400 bg-teal-950/40' : 'text-slate-400 hover:text-white'
            }`}
            title={t.autoRotate}
          >
            {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Guide */}
        <div className="absolute bottom-3 right-3 z-10 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-800/80 text-[11px] text-slate-400 select-none pointer-events-none">
          {lang === 'kk'
            ? '🖱️ Айналдыру: тінтуір / саусақпен сүйреу | Масштаб: дөңгелек'
            : lang === 'ru'
            ? '🖱️ Вращение: перетаскивание мыши/пальца | Масштаб: колёсико'
            : '🖱️ Rotate: drag mouse/finger | Zoom: scroll wheel'}
        </div>

        {/* 3D WebGL Canvas Container */}
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      </div>
    );
  }
);

MoleculeViewer3D.displayName = 'MoleculeViewer3D';
