import { useEffect, useRef } from 'react';

export default function LandscapeBackground() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let width, height, dots, shapes, frame, previous = 0, gridOffset = 0;
    const pathHalfWidth = 2.6;
    const cameraHeight = 2.8;
    function spawnShape(z) {
      const w = .4 + Math.random() * .65;
      return {
        x: (Math.random() * 2 - 1) * (pathHalfWidth - w / 2 - .15),
        z, w, d: .6 + Math.random() * 1.4,
        h: .7 + Math.random() * 2,
        type: ['block', 'prism', 'pyramid'][Math.floor(Math.random() * 3)],
      };
    }
    function drawShapes(dt, horizon) {
      const focal = Math.min(width, height) * .8;
      for (let i = 0; i < shapes.length; i++) {
        shapes[i].z -= dt * 2;
        if (shapes[i].z < 4) shapes[i] = spawnShape(90 + Math.random() * 30);
      }
      // Far-to-near painting keeps nearer solids in front.
      [...shapes].sort((a, b) => b.z - a.z).forEach(shape => {
        const { x, z, w, d, h, type } = shape;
        const project = ([px, py, pz]) => [
          width / 2 + px * focal / pz,
          horizon + (cameraHeight - py) * focal / pz,
        ];
        const base = [[x-w/2,0,z-d/2], [x+w/2,0,z-d/2],
          [x+w/2,0,z+d/2], [x-w/2,0,z+d/2]];
        let vertices, faces;
        if (type === 'pyramid') {
          vertices = [...base, [x,h,z]];
          faces = [[3,2,4], [0,3,4], [1,2,4], [0,1,4]];
        } else if (type === 'prism') {
          vertices = [...base, [x,h,z-d/2], [x,h,z+d/2]];
          faces = [[3,2,5], [0,3,5,4], [1,2,5,4], [0,1,4]];
        } else {
          vertices = [...base, ...base.map(([px,,pz]) => [px,h,pz])];
          faces = [[3,2,6,7], [0,3,7,4], [1,2,6,5], [4,5,6,7], [0,1,5,4]];
        }
        const points = vertices.map(project);
        // Emerge at the horizon, approach centrally, then dissolve before
        // reaching the camera rather than sweeping past its sides.
        const fade = Math.min(1, (120 - z) / 25, (z - 4) / 6);
        ctx.save();
        ctx.globalAlpha = Math.max(0, fade) * .65;
        ctx.lineWidth = 1.4;
        faces.forEach((face, index) => {
          ctx.beginPath();
          face.forEach((v, i) => {
            const [px, py] = points[v];
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          });
          ctx.closePath();
          const shade = [222, 208, 238, 245, 228][index];
          ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
          ctx.fill();
          ctx.strokeStyle = 'rgba(0,0,0,.3)';
          ctx.stroke();
        });
        ctx.restore();
      });
    }
    function resize() {
      width = innerWidth; height = innerHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = width * dpr; canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = Array.from({ length: Math.min(95, Math.max(32, Math.floor(width / 15))) }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - .5) * 10, vy: (Math.random() - .5) * 6,
      }));
      shapes = Array.from({ length: width < 600 ? 4 : 7 }, (_, i) => spawnShape(15 + i * 15));
      draw(0);
    }
    function draw(dt) {
      ctx.clearRect(0, 0, width, height);
      const horizon = height * .5;
      // The path and solids share world-space bounds, so every base stays on it.
      const pathSpread = (height - horizon) * pathHalfWidth / cameraHeight;
      const tracePath = () => {
        ctx.moveTo(width / 2, horizon);
        ctx.lineTo(width / 2 + pathSpread, height);
        ctx.lineTo(width / 2 - pathSpread, height);
        ctx.closePath();
      };
      const surface = ctx.createLinearGradient(0, horizon, 0, height);
      surface.addColorStop(0, 'rgba(0,0,0,0)');
      surface.addColorStop(1, 'rgba(0,0,0,.045)');
      ctx.beginPath(); tracePath();
      ctx.fillStyle = surface; ctx.fill();
      // Perspective grid moves at the same world-space speed as the solids.
      gridOffset = (gridOffset + dt * 2) % 2;
      ctx.save();
      ctx.beginPath(); tracePath(); ctx.clip();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0,0,0,.12)';
      for (let i = 1; i < 8; i++) {
        const x = -pathHalfWidth + i * (pathHalfWidth * 2 / 8);
        ctx.beginPath();
        ctx.moveTo(width / 2, horizon);
        ctx.lineTo(width / 2 + (height - horizon) * x / cameraHeight, height);
        ctx.stroke();
      }
      const focal = Math.min(width, height) * .8;
      for (let z = 2 - gridOffset; z <= 120; z += 2) {
        if (z <= 0) continue;
        const y = horizon + cameraHeight * focal / z;
        const halfWidth = pathHalfWidth * focal / z;
        ctx.beginPath();
        ctx.moveTo(width / 2 - halfWidth, y);
        ctx.lineTo(width / 2 + halfWidth, y);
        ctx.stroke();
      }
      ctx.restore();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0,0,0,.16)';
      ctx.beginPath();
      ctx.moveTo(width / 2 - pathSpread, height);
      ctx.lineTo(width / 2, horizon);
      ctx.lineTo(width / 2 + pathSpread, height);
      ctx.stroke();
      // Constellations can form throughout the void, but never across the path.
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, width, height); tracePath();
      ctx.clip('evenodd');
      for (const dot of dots) {
        dot.x = (dot.x + dot.vx * dt + width) % width;
        dot.y = (dot.y + dot.vy * dt + height) % height;
      }
      // Closed three-edge connections form softly shaded triangular faces.
      // Cache proximity once per frame for both face detection and fading.
      const distances = dots.map((a) => dots.map(b => Math.hypot(a.x - b.x, a.y - b.y)));
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          if (distances[i][j] >= 140) continue;
          for (let k = j + 1; k < dots.length; k++) {
            const longest = Math.max(distances[i][j], distances[i][k], distances[j][k]);
            if (longest >= 140) continue;
            ctx.fillStyle = `rgba(0,0,0,${.075 * (1 - longest / 140)})`;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.lineTo(dots[k].x, dots[k].y);
            ctx.closePath(); ctx.fill();
          }
        }
      }
      dots.forEach((dot, i) => {
        for (let j = i + 1; j < dots.length; j++) {
          const other = dots[j], distance = distances[i][j];
          if (distance < 140) {
            ctx.strokeStyle = `rgba(0,0,0,${.24 * (1 - distance / 140)})`;
            ctx.beginPath(); ctx.moveTo(dot.x, dot.y); ctx.lineTo(other.x, other.y); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(0,0,0,.36)';
        ctx.beginPath(); ctx.arc(dot.x, dot.y, 2.6, 0, Math.PI * 2); ctx.fill();
      });
      ctx.restore();
      drawShapes(dt, horizon);
      const veil = ctx.createLinearGradient(0, 0, width, 0);
      veil.addColorStop(0, 'rgba(255,255,255,0)');
      veil.addColorStop(.3, 'rgba(255,255,255,.65)');
      veil.addColorStop(.7, 'rgba(255,255,255,.65)');
      veil.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = veil; ctx.fillRect(0, 0, width, height);
    }
    function tick(time) {
      draw(previous ? Math.min((time - previous) / 1000, .05) : 0);
      previous = time; frame = requestAnimationFrame(tick);
    }
    function restart() {
      cancelAnimationFrame(frame); previous = 0;
      if (!document.hidden && !motion.matches) frame = requestAnimationFrame(tick);
      else draw(0);
    }
    resize(); restart();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', restart);
    motion.addEventListener('change', restart);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', restart);
      motion.removeEventListener('change', restart);
    };
  }, []);
  return <canvas ref={ref} className="landscape-background" aria-hidden="true" />;
}
