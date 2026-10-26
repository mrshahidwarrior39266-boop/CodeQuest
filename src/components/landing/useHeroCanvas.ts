import { useEffect } from 'react';
import * as THREE from 'three';

// ─── CodeQuest 3D Hero Canvas ───────────────────────────────────────────────
// Renders a live Three.js scene: orbiting particles + floating array bars +
// wireframe icosahedra, all tinted in the Mocha / Platinum / Lavender palette.
// ────────────────────────────────────────────────────────────────────────────

export function useHeroCanvas(canvasRef: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();

    // ── Camera ────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 300);
    camera.position.set(0, 0, 28);

    // ── Colours ───────────────────────────────────────────────────────────
    const C_MOCHA    = new THREE.Color('#6F4E37');
    const C_PLATINUM = new THREE.Color('#E5E4E2');
    const C_LAVENDER = new THREE.Color('#E6E0F0');
    const C_DARK     = new THREE.Color('#3d2a1c');

    // ── Lights ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(C_DARK, 0.6));

    const keyLight = new THREE.PointLight(C_MOCHA, 40, 80);
    keyLight.position.set(10, 12, 10);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(C_LAVENDER, 20, 60);
    fillLight.position.set(-12, -8, 8);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(C_PLATINUM, 15, 50);
    rimLight.position.set(0, 20, -10);
    scene.add(rimLight);

    // ── Floating array bars ───────────────────────────────────────────────
    const barValues = [5, 3, 8, 1, 6, 4, 7, 2];
    const barGroup  = new THREE.Group();
    barGroup.position.set(-8, -1, -4);

    barValues.forEach((val, i) => {
      const height  = val * 0.7;
      const geo     = new THREE.BoxGeometry(0.7, height, 0.7);
      const mat     = new THREE.MeshStandardMaterial({
        color: i === 2 || i === 5 ? C_MOCHA : C_DARK,
        emissive: i === 2 || i === 5 ? C_MOCHA : new THREE.Color('#1a130c'),
        emissiveIntensity: i === 2 || i === 5 ? 0.35 : 0.05,
        roughness: 0.35,
        metalness: 0.6,
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(i * 1.1, height / 2, 0);
      barGroup.add(mesh);

      // Wireframe outline
      const wGeo = new THREE.EdgesGeometry(geo);
      const wMat = new THREE.LineBasicMaterial({
        color: i === 2 || i === 5 ? C_LAVENDER : C_MOCHA,
        transparent: true, opacity: 0.5,
      });
      const wire = new THREE.LineSegments(wGeo, wMat);
      wire.position.copy(mesh.position);
      barGroup.add(wire);
    });
    scene.add(barGroup);

    // ── Wireframe icosahedra ──────────────────────────────────────────────
    const geoIco = new THREE.IcosahedronGeometry(3.5, 1);
    const matIco = new THREE.MeshStandardMaterial({
      color: C_MOCHA,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const ico1 = new THREE.Mesh(geoIco, matIco);
    ico1.position.set(10, 3, -8);
    scene.add(ico1);

    const matIco2 = new THREE.MeshStandardMaterial({
      color: C_LAVENDER,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const ico2 = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2, 1), matIco2);
    ico2.position.set(-10, -2, -6);
    scene.add(ico2);

    // ── Torus (decorative ring) ───────────────────────────────────────────
    const torusGeo = new THREE.TorusGeometry(5, 0.15, 8, 60);
    const torusMat = new THREE.MeshStandardMaterial({
      color: C_MOCHA,
      emissive: C_MOCHA,
      emissiveIntensity: 0.3,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.6,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(0, 0, -12);
    torus.rotation.x = Math.PI / 3;
    scene.add(torus);

    // ── Second torus ─────────────────────────────────────────────────────
    const torus2Geo = new THREE.TorusGeometry(7, 0.08, 6, 80);
    const torus2Mat = new THREE.MeshStandardMaterial({
      color: C_LAVENDER,
      emissive: C_LAVENDER,
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.3,
    });
    const torus2 = new THREE.Mesh(torus2Geo, torus2Mat);
    torus2.position.set(0, 0, -15);
    torus2.rotation.x = -Math.PI / 4;
    torus2.rotation.y = Math.PI / 6;
    scene.add(torus2);

    // ── Orbiting spheres ──────────────────────────────────────────────────
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    const orbitData = [
      { r: 9,  speed: 0.4,  size: 0.25, col: C_MOCHA    },
      { r: 12, speed: -0.25, size: 0.18, col: C_LAVENDER },
      { r: 7,  speed: 0.6,  size: 0.2,  col: C_PLATINUM },
    ];

    const orbits = orbitData.map((d, i) => {
      const g   = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({ color: d.col, emissive: d.col, emissiveIntensity: 0.5 });
      const num = 6;
      for (let j = 0; j < num; j++) {
        const angle = (j / num) * Math.PI * 2;
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(d.size, 8, 8), mat);
        sphere.position.set(Math.cos(angle) * d.r, Math.sin(angle) * d.r * 0.3, Math.sin(angle) * d.r * 0.6);
        g.add(sphere);
      }
      g.rotation.x = (i * Math.PI) / 5;
      orbitGroup.add(g);
      return { group: g, speed: d.speed };
    });

    // ── Particle field ────────────────────────────────────────────────────
    const pCount = 1200;
    const pPositions = new Float32Array(pCount * 3);
    const pColors    = new Float32Array(pCount * 3);
    const colorChoices = [C_MOCHA, C_PLATINUM, C_LAVENDER, C_DARK];

    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3]     = (Math.random() - 0.5) * 80;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;
      const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      pColors[i * 3]     = c.r;
      pColors[i * 3 + 1] = c.g;
      pColors[i * 3 + 2] = c.b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.18, vertexColors: true,
      transparent: true, opacity: 0.65,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Mouse parallax ────────────────────────────────────────────────────
    let mx = 0, my = 0;
    const onMouseMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    // ── Animation loop ────────────────────────────────────────────────────
    let raf: number;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Rotate icosahedra
      ico1.rotation.x = t * 0.12;
      ico1.rotation.y = t * 0.18;
      ico2.rotation.x = -t * 0.15;
      ico2.rotation.z = t * 0.1;

      // Spin toruses
      torus.rotation.z = t * 0.08;
      torus2.rotation.z = -t * 0.06;
      torus2.rotation.x = -Math.PI / 4 + Math.sin(t * 0.15) * 0.2;

      // Float bar group
      barGroup.position.y = -1 + Math.sin(t * 0.5) * 0.8;
      barGroup.rotation.y = Math.sin(t * 0.2) * 0.15;

      // Orbiting spheres
      orbits.forEach(({ group, speed }) => {
        group.rotation.z += speed * 0.005;
        group.rotation.x += speed * 0.003;
      });

      // Drift particles
      particles.rotation.y = t * 0.015;
      particles.rotation.x = t * 0.008;

      // Camera parallax on mouse
      camera.position.x += (mx * 2.5 - camera.position.x) * 0.04;
      camera.position.y += (-my * 1.5 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Pulse key light
      keyLight.intensity = 35 + Math.sin(t * 1.2) * 8;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);
}
