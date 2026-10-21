import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Plus } from 'lucide-react';

/**
 * Hand-crafted charming Cat with Birthday Candles and Guitar
 */
export const BirthdayCatSvg: React.FC<{ className?: string }> = ({ className = 'w-64 h-64' }) => {
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_10px_25px_rgba(244,63,94,0.35)]"
      >
        <defs>
          <radialGradient id="catBody" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffeedd" />
            <stop offset="100%" stopColor="#f3d5ba" />
          </radialGradient>
          <linearGradient id="guitarBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <linearGradient id="candleRainbow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="75%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* Floating halo glow */}
        <circle cx="160" cy="180" r="110" fill="#f43f5e" fillOpacity="0.08" filter="blur(20px)" />

        {/* CANDLES ON HEAD SPELLING "HAPPY BIRTHDAY" */}
        <g id="candles">
          {/* Candle Cake Arc on head */}
          <path
            d="M 105 102 Q 160 88 215 102"
            stroke="#fbbf24"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Individual Mini Candle Sticks with colorful letters */}
          {[
            { x: 108, y: 72, h: 26, color: '#f43f5e', letter: 'H' },
            { x: 122, y: 64, h: 30, color: '#fb923c', letter: 'A' },
            { x: 136, y: 58, h: 32, color: '#facc15', letter: 'P' },
            { x: 150, y: 56, h: 34, color: '#4ade80', letter: 'P' },
            { x: 164, y: 56, h: 34, color: '#38bdf8', letter: 'Y' },
            { x: 178, y: 58, h: 32, color: '#818cf8', letter: 'B' },
            { x: 192, y: 64, h: 30, color: '#c084fc', letter: 'D' },
            { x: 206, y: 72, h: 26, color: '#f472b6', letter: '!' },
          ].map((c, i) => (
            <g key={i}>
              {/* Flame */}
              <path
                d={`M ${c.x} ${c.y - 12} C ${c.x - 3} ${c.y - 6}, ${c.x + 3} ${c.y - 6}, ${c.x} ${c.y - 12}`}
                fill="#ffedd5"
              />
              <circle
                cx={c.x}
                cy={c.y - 8}
                r="3.5"
                fill="#f59e0b"
                className="animate-pulse"
                style={{ animationDuration: `${0.8 + (i % 4) * 0.2}s` }}
              />
              {/* Stick */}
              <line
                x1={c.x}
                y1={c.y - 4}
                x2={c.x}
                y2={c.y + c.h - 10}
                stroke={c.color}
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Letter Tag */}
              <circle cx={c.x} cy={c.y + 8} r="5.5" fill="#ffffff" />
              <text
                x={c.x}
                y={c.y + 11}
                textAnchor="middle"
                fontSize="8"
                fontWeight="900"
                fill={c.color}
                fontFamily="sans-serif"
              >
                {c.letter}
              </text>
            </g>
          ))}
        </g>

        {/* CAT BODY */}
        {/* Tail */}
        <path
          d="M 90 250 C 60 270 45 230 55 210 C 60 200 70 205 68 215 C 64 228 80 248 100 242"
          fill="#f3d5ba"
          stroke="#e0b892"
          strokeWidth="3"
        />

        {/* Ears */}
        {/* Left Ear */}
        <polygon
          points="105,120 120,70 145,110"
          fill="#f3d5ba"
          stroke="#e0b892"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <polygon points="112,112 122,82 138,105" fill="#fbcfe8" />

        {/* Right Ear */}
        <polygon
          points="175,110 200,70 215,120"
          fill="#f3d5ba"
          stroke="#e0b892"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <polygon points="182,105 198,82 208,112" fill="#fbcfe8" />

        {/* Head */}
        <ellipse cx="160" cy="140" rx="55" ry="46" fill="url(#catBody)" stroke="#e0b892" strokeWidth="3" />

        {/* Eyes (Happy Closed Curls) */}
        <path
          d="M 132 134 Q 140 144 148 134"
          stroke="#4b5563"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 172 134 Q 180 144 188 134"
          stroke="#4b5563"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cheeks Blush */}
        <ellipse cx="126" cy="146" rx="9" ry="6" fill="#f43f5e" fillOpacity="0.4" />
        <ellipse cx="194" cy="146" rx="9" ry="6" fill="#f43f5e" fillOpacity="0.4" />

        {/* Nose & Mouth */}
        <polygon points="157,143 163,143 160,147" fill="#f43f5e" />
        <path
          d="M 160 147 Q 153 155 148 150 M 160 147 Q 167 155 172 150"
          stroke="#4b5563"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Whiskers */}
        <line x1="105" y1="140" x2="120" y2="143" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
        <line x1="102" y1="150" x2="120" y2="149" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
        <line x1="200" y1="143" x2="215" y2="140" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
        <line x1="200" y1="149" x2="218" y2="150" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

        {/* Torso */}
        <ellipse cx="160" cy="225" rx="58" ry="52" fill="url(#catBody)" stroke="#e0b892" strokeWidth="3" />
        {/* Belly patch */}
        <ellipse cx="160" cy="235" rx="34" ry="32" fill="#ffffff" fillOpacity="0.6" />

        {/* GUITAR */}
        <g id="guitar" transform="rotate(-18 160 215)">
          {/* Guitar Neck */}
          <rect x="90" y="200" width="85" height="10" rx="3" fill="#78350f" />
          {/* Headstock */}
          <rect x="74" y="197" width="18" height="16" rx="3" fill="#b45309" />
          <circle cx="80" cy="201" r="2" fill="#fef3c7" />
          <circle cx="86" cy="201" r="2" fill="#fef3c7" />
          <circle cx="80" cy="209" r="2" fill="#fef3c7" />
          <circle cx="86" cy="209" r="2" fill="#fef3c7" />

          {/* Guitar Body */}
          <path
            d="M 155 180 C 185 180 205 195 205 215 C 205 224 195 232 205 245 C 205 265 185 275 155 275 C 130 275 125 258 135 245 C 125 232 125 220 135 205 C 128 190 135 180 155 180 Z"
            fill="url(#guitarBody)"
            stroke="#78350f"
            strokeWidth="3"
          />
          {/* Sound hole */}
          <circle cx="165" cy="225" r="14" fill="#3f1d0b" />
          <circle cx="165" cy="225" r="16" stroke="#fde68a" strokeWidth="1.5" fill="none" />

          {/* Strings */}
          <line x1="84" y1="203" x2="190" y2="223" stroke="#fef3c7" strokeWidth="1" strokeOpacity="0.9" />
          <line x1="84" y1="205" x2="190" y2="225" stroke="#fef3c7" strokeWidth="1" strokeOpacity="0.9" />
          <line x1="84" y1="207" x2="190" y2="227" stroke="#fef3c7" strokeWidth="1" strokeOpacity="0.9" />
        </g>

        {/* Paws strumming guitar */}
        {/* Left Paw holding neck */}
        <ellipse cx="120" cy="195" rx="10" ry="8" fill="#ffeedd" stroke="#e0b892" strokeWidth="2" />
        {/* Right Paw picking strings */}
        <ellipse cx="185" cy="210" rx="10" ry="9" fill="#ffeedd" stroke="#e0b892" strokeWidth="2" />

        {/* Music Notes Floating */}
        <text x="75" y="140" fill="#fb7185" fontSize="18" className="animate-bounce" style={{ animationDuration: '1.4s' }}>
          ♪
        </text>
        <text x="235" y="150" fill="#f43f5e" fontSize="22" className="animate-bounce" style={{ animationDuration: '1.9s' }}>
          ♫
        </text>
        <text x="210" y="240" fill="#fda4af" fontSize="16" className="animate-pulse">
          ♥
        </text>
      </svg>
    </div>
  );
};

/**
 * Hand-drawn Card Cover illustration: Two hands holding a red heart on cream card
 */
export const CardFrontHandsHeartSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => {
  return (
    <div className={`relative flex items-center justify-center p-6 ${className}`}>
      <svg
        viewBox="0 0 300 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[340px]"
      >
        <defs>
          <filter id="shadowWarm" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#e11d48" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Delicate decorative line frame */}
        <rect
          x="14"
          y="14"
          width="272"
          height="332"
          rx="14"
          fill="none"
          stroke="#c9b79c"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Top small greeting text */}
        <text
          x="150"
          y="54"
          textAnchor="middle"
          fill="#6b4c35"
          fontSize="17"
          fontFamily="'Dancing Script', cursive"
          fontWeight="600"
          letterSpacing="1"
        >
          A Special Birthday Card
        </text>

        {/* Soft background glow */}
        <circle cx="150" cy="175" r="55" fill="#ffe4e6" fillOpacity="0.7" />

        {/* THE RED HEART */}
        <g filter="url(#shadowWarm)" className="animate-soft-pulse origin-center">
          <path
            d="M 150 148
               C 150 135, 132 118, 114 118
               C 92 118, 76 138, 76 160
               C 76 188, 110 215, 150 236
               C 190 215, 224 188, 224 160
               C 224 138, 208 118, 186 118
               C 168 118, 150 135, 150 148 Z"
            fill="#e11d48"
          />
          {/* Heart highlight shine */}
          <path
            d="M 104 134 C 114 126, 128 126, 134 132"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            strokeOpacity="0.75"
          />
        </g>

        {/* LEFT HAND GENTLY CUPPING THE HEART */}
        <path
          d="M 38 220
             C 65 210, 85 212, 108 205
             C 118 202, 130 196, 138 206
             C 142 212, 138 220, 126 226
             C 112 234, 96 238, 80 248
             C 66 256, 48 268, 32 276"
          stroke="#4a2e1b"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Left Thumb */}
        <path
          d="M 88 190 C 102 182, 118 184, 128 195"
          stroke="#4a2e1b"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* RIGHT HAND GENTLY CUPPING THE HEART */}
        <path
          d="M 262 220
             C 235 210, 215 212, 192 205
             C 182 202, 170 196, 162 206
             C 158 212, 162 220, 174 226
             C 188 234, 204 238, 220 248
             C 234 256, 252 268, 268 276"
          stroke="#4a2e1b"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Right Thumb */}
        <path
          d="M 212 190 C 198 182, 182 184, 172 195"
          stroke="#4a2e1b"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Tiny stars & sparkles */}
        <g fill="#f59e0b" opacity="0.8">
          <circle cx="70" cy="100" r="2.5" />
          <circle cx="230" cy="95" r="2.5" />
          <circle cx="65" cy="165" r="2" />
          <circle cx="235" cy="170" r="2" />
          <path d="M 150 90 Q 150 98 154 98 Q 150 98 150 106 Q 150 98 146 98 Q 150 98 150 90 Z" />
        </g>

        {/* Romantic subscript */}
        <text
          x="150"
          y="312"
          textAnchor="middle"
          fill="#785942"
          fontSize="15"
          fontFamily="'Dancing Script', cursive"
          fontWeight="600"
        >
          With all my love & heart
        </text>
      </svg>
    </div>
  );
};

/**
 * Resilient Photo Slot with neat gray placeholder box and "+" upload button
 */
export const PhotoSlot: React.FC<{
  src?: string;
  fallbackFilename: string;
  label?: string;
  aspect?: string;
  className?: string;
}> = ({ src, fallbackFilename, label, aspect = 'aspect-[4/5]', className = '' }) => {
  const [loadError, setLoadError] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const hasValidImage = src && !loadError;

  return (
    <>
      <div
        onClick={() => hasValidImage && setFullscreen(true)}
        className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border-2 border-slate-300/40 hover:border-pink-400 bg-slate-900/60 shadow-md ${aspect} ${className}`}
        title={hasValidImage ? "Tap to view full size" : label || fallbackFilename}
      >
        {hasValidImage ? (
          <>
            <img
              src={src}
              alt={label || fallbackFilename}
              onError={() => setLoadError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Subtle soft romantic shine on hover */}
            <div className="absolute inset-0 bg-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-slate-800/80 border border-slate-700 rounded-lg">
            <span className="text-2xl mb-1">❤️</span>
            <span className="text-xs font-semibold text-slate-200 font-poppins">
              {label || 'Cherished Memory'}
            </span>
          </div>
        )}
      </div>

      {fullscreen && hasValidImage && (
        <div
          onClick={() => setFullscreen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full max-h-[85vh] rounded-2xl overflow-hidden bg-slate-900 border-2 border-pink-400 p-2 flex flex-col items-center shadow-2xl"
          >
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 text-white hover:bg-pink-600 transition-colors cursor-pointer"
            >
              ✕
            </button>
            <img src={src} alt="Memory" className="w-full max-h-[75vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
    </>
  );
};
