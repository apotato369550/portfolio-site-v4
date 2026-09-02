import { useEffect, useRef } from 'react';

const FONT_SIZE = 16;
const GLYPHS = ['0', '1'];
const GLYPH_ALPHA = 0.22;
const RESIZE_DEBOUNCE_MS = 150;

function randomGlyph() {
  return GLYPHS[Math.random() > 0.5 ? 1 : 0];
}

export default function MatrixRain({
  tailLengthMin = 15,
  tailLengthMax = 30,
  dropDensityStep = FONT_SIZE * 1.4,
  gapMinRows = 3,
  gapMaxRows = 15,
  resetProbability = 0.9,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let lanes;
    let dropX;
    let dropRow;
    let dropTrail;
    let dropTrailLength;
    let width;
    let height;
    let rafId;
    let resizeTimeout;

    function randomGapRows() {
      return -(gapMinRows + Math.random() * (gapMaxRows - gapMinRows));
    }

    function spawnLane(i) {
      dropX[i] = Math.random() * width;
      dropRow[i] = randomGapRows();
      dropTrail[i] = [];
      dropTrailLength[i] = tailLengthMin + Math.random() * (tailLengthMax - tailLengthMin);
    }

    function setup() {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lanes = Math.floor(width / dropDensityStep);
      dropX = new Array(lanes);
      dropRow = new Array(lanes);
      dropTrail = new Array(lanes);
      dropTrailLength = new Array(lanes);
      for (let i = 0; i < lanes; i++) spawnLane(i);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, width, height);
    }

    function draw() {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${FONT_SIZE}px monospace`;

      for (let i = 0; i < lanes; i++) {
        const trail = dropTrail[i];
        const maxLength = dropTrailLength[i];
        trail.unshift(randomGlyph());
        if (trail.length > maxLength) trail.length = Math.floor(maxLength);

        for (let k = 0; k < trail.length; k++) {
          const alpha = GLYPH_ALPHA * (1 - k / maxLength);
          const y = (dropRow[i] - k) * FONT_SIZE;
          ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
          ctx.fillText(trail[k], dropX[i], y);
        }

        const headY = dropRow[i] * FONT_SIZE;
        if (headY > height && Math.random() > resetProbability) {
          spawnLane(i);
        } else {
          dropRow[i]++;
        }
      }
      rafId = requestAnimationFrame(draw);
    }

    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setup, RESIZE_DEBOUNCE_MS);
    }

    setup();
    rafId = requestAnimationFrame(draw);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [tailLengthMin, tailLengthMax, dropDensityStep, gapMinRows, gapMaxRows, resetProbability]);

  return <canvas ref={canvasRef} className="matrix-rain" aria-hidden="true" />;
}
