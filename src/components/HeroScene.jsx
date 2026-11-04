import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/*
 * Hero 3D accent: an antique-gold Aari needle "stitched" through the portrait frame,
 * trailing a wine silk thread and a fine gold zari thread, with a pearl floral motif.
 * Rendering pauses whenever the hero is off-screen; reduced motion renders a single still frame.
 */

const GOLD = '#C9A06E';
const WINE = '#941313';
const CORAL = '#D4454F';

function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
      room.traverse((o) => { o.geometry?.dispose?.(); o.material?.dispose?.(); });
    };
  }, [gl, scene]);
  return null;
}

/** Needle built between a tip and an eye point (scene units). */
function Needle({ tip, eye }) {
  const gold = useMemo(() => new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.26 }), []);
  useEffect(() => () => gold.dispose(), [gold]);
  const { pos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...tip);
    const b = new THREE.Vector3(...eye);
    const dir = b.clone().sub(a);
    const l = dir.length();
    return {
      len: l,
      pos: a.clone().add(b).multiplyScalar(0.5),
      quat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()),
    };
  }, [tip, eye]);
  const h = len / 2;
  return (
    <group position={pos} quaternion={quat}>
      <mesh material={gold}>
        <cylinderGeometry args={[0.04, 0.026, len - 0.16, 24, 1]} />
      </mesh>
      <mesh material={gold} position={[0, -h + 0.04, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.026, 0.2, 16]} />
      </mesh>
      <mesh material={gold} position={[0.03, -h - 0.04, 0]} rotation={[0, 0, Math.PI * 0.15]}>
        <torusGeometry args={[0.034, 0.01, 8, 16, Math.PI]} />
      </mesh>
      <mesh material={gold} position={[0, h - 0.16, 0]} scale={[0.75, 2, 1]}>
        <torusGeometry args={[0.042, 0.012, 10, 24]} />
      </mesh>
    </group>
  );
}

/** A silk thread whose control points sway gently; geometry is rebuilt only while animating. */
function Thread({ points, radius, material, sway = 0.08, speed = 0.6, phase = 0, animate }) {
  const mesh = useRef();
  const base = useMemo(() => points.map((p) => new THREE.Vector3(...p)), [points]);
  const work = useMemo(() => base.map((v) => v.clone()), [base]);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(work, false, 'catmullrom', 0.5), [work]);

  const build = (t) => {
    base.forEach((v, i) => {
      const k = i / (base.length - 1);
      const w = Math.sin(k * Math.PI); // ends stay anchored
      work[i].set(
        v.x + Math.sin(t * speed + i * 0.9 + phase) * sway * w,
        v.y + Math.cos(t * speed * 0.8 + i * 1.3 + phase) * sway * 0.6 * w,
        v.z + Math.sin(t * speed * 0.7 + i) * sway * 0.5 * w
      );
    });
    const next = new THREE.TubeGeometry(curve, 96, radius, 8, false);
    mesh.current.geometry.dispose();
    mesh.current.geometry = next;
  };

  useEffect(() => {
    build(0);
    const m = mesh.current;
    return () => m?.geometry.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame(({ clock }) => {
    if (animate) build(clock.elapsedTime);
  });

  return <mesh ref={mesh} material={material}><bufferGeometry /></mesh>;
}

function PearlMotif(props) {
  const pearl = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#FFF4E8', roughness: 0.18, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.1, sheen: 0.6, sheenColor: new THREE.Color('#F9DFD4') }), []);
  const bead = useMemo(() => new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.3 }), []);
  const coral = useMemo(() => new THREE.MeshStandardMaterial({ color: CORAL, metalness: 0.2, roughness: 0.35 }), []);
  useEffect(() => () => { pearl.dispose(); bead.dispose(); coral.dispose(); }, [pearl, bead, coral]);
  const ring = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);
  return (
    <group {...props}>
      {ring.map((a) => (
        <mesh key={a} material={pearl} position={[Math.cos(a) * 0.26, Math.sin(a) * 0.26, 0]}>
          <sphereGeometry args={[0.075, 24, 16]} />
        </mesh>
      ))}
      {ring.map((a) => (
        <mesh key={`c${a}`} material={coral} position={[Math.cos(a + Math.PI / 8) * 0.44, Math.sin(a + Math.PI / 8) * 0.44, 0]}>
          <sphereGeometry args={[0.032, 12, 10]} />
        </mesh>
      ))}
      <mesh material={bead} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.03, 32]} />
      </mesh>
    </group>
  );
}

function Scene({ animate }) {
  const group = useRef();
  const pointer = useRef({ x: 0, y: 0 });
  const silk = useMemo(() => new THREE.MeshPhysicalMaterial({ color: WINE, roughness: 0.45, sheen: 1, sheenRoughness: 0.35, sheenColor: new THREE.Color(CORAL) }), []);
  const zari = useMemo(() => new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.3 }), []);
  useEffect(() => () => { silk.dispose(); zari.dispose(); }, [silk, zari]);

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame(({ clock }) => {
    if (!animate || !group.current) return;
    const g = group.current;
    g.rotation.y += (pointer.current.x * 0.12 - g.rotation.y) * 0.04;
    g.rotation.x += (pointer.current.y * 0.06 - g.rotation.x) * 0.04;
    g.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.03;
  });

  // Needle pierces the arch's top-right shoulder; threads drape down the right edge.
  const tip = [1.0, 1.42, 0.5];
  const eye = [2.05, 2.4, 0.5];
  const threadStart = [1.98, 2.33, 0.5];
  return (
    <group ref={group}>
      <Needle tip={tip} eye={eye} />
      <Thread
        animate={animate}
        material={silk}
        radius={0.016}
        points={[threadStart, [2.12, 1.9, 0.5], [1.98, 1.1, 0.4], [1.82, 0.2, 0.5], [1.95, -0.75, 0.4], [1.72, -1.5, 0.5], [1.2, -1.95, 0.6], [0.55, -2.1, 0.55]]}
      />
      <Thread
        animate={animate}
        material={zari}
        radius={0.006}
        sway={0.1}
        phase={1.7}
        points={[threadStart, [2.05, 1.7, 0.45], [2.08, 0.85, 0.3], [1.95, -0.15, 0.45], [2.05, -1.1, 0.35], [1.8, -1.8, 0.45]]}
      />
      <PearlMotif position={[-1.8, 0.12, 0.4]} rotation={[0.15, 0.25, 0]} scale={0.85} />
    </group>
  );
}

export default function HeroScene({ reduced }) {
  const wrap = useRef(null);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const animate = inView && !reduced;

  return (
    <div ref={wrap} className={`hero-scene${ready ? ' is-ready' : ''}`} aria-hidden="true">
      <Canvas
        frameloop={animate ? 'always' : 'demand'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 8.8], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          setReady(true);
        }}
      >
        <ambientLight intensity={0.5} color="#FBF0E5" />
        <directionalLight position={[3, 4, 5]} intensity={1.6} color="#FFF1DE" />
        <directionalLight position={[-4, -2, 2]} intensity={0.5} color={CORAL} />
        <Environment />
        <Scene animate={animate} />
      </Canvas>
    </div>
  );
}
