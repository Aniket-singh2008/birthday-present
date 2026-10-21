import React, { useEffect, useRef } from 'react';

/**
 * SCENE 1: Matrix Digital Rain Canvas with Centered Animated Text Sequence
 */
export const MatrixRainCanvas: React.FC<{
  name: string;
  items: string[];
  durationPerItem?: number;
  onComplete: () => void;
  onSkip: () => void;
}> = ({ name, items, durationPerItem = 1100, onComplete, onSkip }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [animatingIn, setAnimatingIn] = React.useState(true);

  // Digital Rain animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const chars = '0123456789ABCDEF♥♡✦💖AYAﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = Array.from({ length: columns }, () => Math.random() * -50);
    const speeds: number[] = Array.from({ length: columns }, () => 0.7 + Math.random() * 1.4);

    const render = () => {
      // Semi-transparent dark wash for trailing effect
      ctx.fillStyle = 'rgba(10, 13, 26, 0.22)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head of the drop is bright white/pink
        ctx.fillStyle = Math.random() > 0.85 ? '#ffffff' : '#f43f5e';
        ctx.shadowColor = '#fb7185';
        ctx.shadowBlur = 8;
        ctx.fillText(text, x, y);

        // Reset shadow
        ctx.shadowBlur = 0;

        // Second character behind head in deeper pink/magenta
        if (drops[i] > 1) {
          const trailText = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillStyle = '#ec4899';
          ctx.fillText(trailText, x, y - fontSize);
        }

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += speeds[i];
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Text Sequence Step Controller
  useEffect(() => {
    setAnimatingIn(true);
    const fadeTimer = setTimeout(() => {
      setAnimatingIn(false);
    }, durationPerItem - 220);

    const stepTimer = setTimeout(() => {
      if (currentIndex < items.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onComplete();
      }
    }, durationPerItem);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(stepTimer);
    };
  }, [currentIndex, items, durationPerItem, onComplete]);

  const currentItem = items[currentIndex] || '';
  const isHeart = currentItem === '💖' || currentItem === '❤️';

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-[#0a0d1a]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Vignette & subtle center glow */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#0a0d1a]/50 to-[#0a0d1a] pointer-events-none" />

      {/* Big Animated Center Text */}
      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none px-4">
        <div
          className={`transition-all duration-300 transform ${
            animatingIn ? 'opacity-100 scale-100 filter-none' : 'opacity-0 scale-110 blur-sm'
          }`}
        >
          {isHeart ? (
            <div className="text-8xl sm:text-9xl animate-heartbeat drop-shadow-[0_0_35px_rgba(244,63,94,0.9)]">
              💖
            </div>
          ) : (
            <h1
              className="font-poppins font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500 drop-shadow-[0_0_35px_rgba(244,63,94,0.9)] tracking-wide text-6xl sm:text-8xl md:text-9xl py-4"
            >
              {currentItem}
            </h1>
          )}
        </div>
      </div>

      {/* Skip button in bottom corner */}
      <button
        onClick={onSkip}
        className="absolute bottom-6 right-6 z-20 px-4 py-2 rounded-full font-poppins text-xs font-semibold text-pink-300 bg-pink-950/50 border border-pink-500/40 hover:bg-pink-900/70 transition-all backdrop-blur-md cursor-pointer"
      >
        Skip intro ➔
      </button>
    </div>
  );
};

/**
 * Twinkling Starfield and Floating Hearts Canvas (Active for Scenes 2 through 6)
 */
export const StarryNightCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars Generation
    interface Star {
      x: number;
      y: number;
      radius: number;
      baseAlpha: number;
      twinkleSpeed: number;
      phase: number;
      color: string;
    }

    const starCount = Math.min(180, Math.floor((width * height) / 6000));
    const starColors = ['#ffffff', '#fff1f2', '#ffe4e6', '#fef08a', '#e0e7ff'];
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.6 + Math.random() * 1.6,
      baseAlpha: 0.2 + Math.random() * 0.7,
      twinkleSpeed: 0.02 + Math.random() * 0.04,
      phase: Math.random() * Math.PI * 2,
      color: starColors[Math.floor(Math.random() * starColors.length)],
    }));

    // Floating Hearts Generation
    interface FloatingHeart {
      x: number;
      y: number;
      size: number;
      speedY: number;
      swaySpeed: number;
      swayWidth: number;
      phase: number;
      color: string;
      alpha: number;
    }

    const heartColors = ['#f43f5e', '#ec4899', '#fb7185', '#ef4444', '#fb923c'];
    const heartCount = Math.min(26, Math.floor(width / 50));
    const hearts: FloatingHeart[] = Array.from({ length: heartCount }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * height,
      size: 10 + Math.random() * 18,
      speedY: 0.6 + Math.random() * 1.2,
      swaySpeed: 0.015 + Math.random() * 0.025,
      swayWidth: 20 + Math.random() * 40,
      phase: Math.random() * Math.PI * 2,
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
      alpha: 0.3 + Math.random() * 0.5,
    }));

    const drawHeart = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      alpha: number
    ) => {
      context.save();
      context.globalAlpha = alpha;
      context.fillStyle = color;
      context.shadowColor = color;
      context.shadowBlur = 6;
      context.beginPath();
      const topCurveHeight = size * 0.3;
      context.moveTo(x, y + topCurveHeight);
      // top left curve
      context.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
      // bottom left curve
      context.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + size, x, y + size * 1.2);
      // bottom right curve
      context.bezierCurveTo(x, y + size, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
      // top right curve
      context.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
      context.closePath();
      context.fill();
      context.restore();
    };

    let tick = 0;

    const render = () => {
      tick++;
      ctx.fillStyle = '#0a0d1a';
      ctx.fillRect(0, 0, width, height);

      // Render Stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const alpha = Math.max(0.05, Math.min(1, s.baseAlpha + Math.sin(tick * s.twinkleSpeed + s.phase) * 0.35));
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Render Floating Hearts
      for (let i = 0; i < hearts.length; i++) {
        const h = hearts[i];
        h.y -= h.speedY;
        const currentX = h.x + Math.sin(tick * h.swaySpeed + h.phase) * h.swayWidth;

        // Fade in when entering from bottom, fade out near top
        let currentAlpha = h.alpha;
        if (h.y < 100) {
          currentAlpha = (h.y / 100) * h.alpha;
        } else if (h.y > height - 60) {
          currentAlpha = ((height - h.y) / 60) * h.alpha;
        }

        drawHeart(ctx, currentX, h.y, h.size, h.color, Math.max(0, currentAlpha));

        // Recycle heart when it exits the top
        if (h.y < -40) {
          h.y = height + 20 + Math.random() * 80;
          h.x = Math.random() * width;
          h.speedY = 0.6 + Math.random() * 1.2;
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />;
};
