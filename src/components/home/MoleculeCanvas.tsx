import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const MoleculeCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x14b8a6, 4, 50); // Teal light
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x7c3aed, 4, 50); // Violet light
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Atom definitions (Organic molecule: Central carbon ring with functional groups)
    const atomDefs = [
      // Central 6-ring
      { pos: [0, 2.2, 0], color: 0x14b8a6, radius: 0.65, name: 'C' },
      { pos: [1.9, 1.1, 0], color: 0x38bdf8, radius: 0.7, name: 'N' },
      { pos: [1.9, -1.1, 0], color: 0x14b8a6, radius: 0.65, name: 'C' },
      { pos: [0, -2.2, 0], color: 0x14b8a6, radius: 0.65, name: 'C' },
      { pos: [-1.9, -1.1, 0], color: 0x38bdf8, radius: 0.7, name: 'N' },
      { pos: [-1.9, 1.1, 0], color: 0x14b8a6, radius: 0.65, name: 'C' },
      // Side groups (Oxygen, Hydrogen, Methyl)
      { pos: [0, 3.8, 0.4], color: 0xef4444, radius: 0.75, name: 'O' },
      { pos: [3.4, 1.8, -0.3], color: 0xe2e8f0, radius: 0.45, name: 'H' },
      { pos: [3.4, -1.8, 0.3], color: 0x8b5cf6, radius: 0.65, name: 'C' },
      { pos: [0, -3.8, -0.4], color: 0xef4444, radius: 0.75, name: 'O' },
      { pos: [-3.4, -1.8, 0.2], color: 0xe2e8f0, radius: 0.45, name: 'H' },
      { pos: [-3.4, 1.8, -0.2], color: 0x8b5cf6, radius: 0.65, name: 'C' },
      // Out-of-plane satellite atoms for 3D depth
      { pos: [0, 0, 1.8], color: 0xf59e0b, radius: 0.55, name: 'P' },
      { pos: [0, 0, -1.8], color: 0x10b981, radius: 0.55, name: 'S' },
      { pos: [1.2, 0, 2.7], color: 0xe2e8f0, radius: 0.4, name: 'H' },
      { pos: [-1.2, 0, -2.7], color: 0xe2e8f0, radius: 0.4, name: 'H' },
    ];

    const sphereGeo = new THREE.SphereGeometry(1, 24, 24);

    // Create atom meshes
    atomDefs.forEach((atom) => {
      const mat = new THREE.MeshStandardMaterial({
        color: atom.color,
        roughness: 0.2,
        metalness: 0.3,
        emissive: atom.color,
        emissiveIntensity: 0.2,
      });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.scale.setScalar(atom.radius);
      mesh.position.set(atom.pos[0], atom.pos[1], atom.pos[2]);
      rootGroup.add(mesh);
    });

    // Create chemical bonds (cylinders connecting atoms within distance threshold)
    const bondMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
      opacity: 0.75,
    });

    const cylinderGeo = new THREE.CylinderGeometry(0.12, 0.12, 1, 12);

    for (let i = 0; i < atomDefs.length; i++) {
      for (let j = i + 1; j < atomDefs.length; j++) {
        const p1 = new THREE.Vector3(...atomDefs[i].pos);
        const p2 = new THREE.Vector3(...atomDefs[j].pos);
        const dist = p1.distanceTo(p2);

        // Connect only close neighbors
        if (dist > 1.2 && dist < 2.9) {
          const midpoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
          const orientation = new THREE.Matrix4();
          const target = new THREE.Vector3().subVectors(p2, p1).normalize();
          const up = new THREE.Vector3(0, 1, 0);

          orientation.lookAt(p1, p2, up);
          const bondMesh = new THREE.Mesh(cylinderGeo, bondMat);
          bondMesh.scale.set(1, dist, 1);
          bondMesh.position.copy(midpoint);
          bondMesh.quaternion.setFromUnitVectors(up, target);
          rootGroup.add(bondMesh);
        }
      }
    }

    // Add glowing particle cloud around the molecule
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 16;
      particlePositions[i + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x14b8a6,
      size: 0.18,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    // Mouse drag interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0.2;
    let targetRotationY = 0.3;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.007;
      targetRotationX += deltaY * 0.007;
      previousMousePosition = { x: clientX, y: clientY };
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

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging) {
        targetRotationY += 0.004;
      }

      rootGroup.rotation.y += (targetRotationY - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (targetRotationX - rootGroup.rotation.x) * 0.05;

      particles.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    animate();

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
      sphereGeo.dispose();
      cylinderGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      bondMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[340px] sm:min-h-[420px] md:min-h-[480px] cursor-grab active:cursor-grabbing ${className}`}
      title="3D Молекула — тышқанмен немесе саусақпен айналдыруға болады"
    />
  );
};
