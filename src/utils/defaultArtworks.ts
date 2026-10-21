/**
 * 20 High-Quality Romantic Vector Photos for the Heart Finale
 * These serve as beautiful, guaranteed default photos so tiles are never broken!
 */

function createRomanticSvgDataUrl(bg1: string, bg2: string, emoji: string, subtitle: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg1}" />
        <stop offset="100%" stop-color="${bg2}" />
      </linearGradient>
    </defs>
    <rect width="200" height="200" fill="url(#grad)" rx="16" />
    <circle cx="100" cy="90" r="54" fill="rgba(255,255,255,0.15)" />
    <text x="100" y="108" font-size="52" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    <text x="100" y="162" font-size="14" font-family="sans-serif" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="1">${subtitle}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const DEFAULT_ROMANTIC_PHOTOS: string[] = [
  createRomanticSvgDataUrl('#f43f5e', '#881337', '👩‍❤️‍👨', 'NEYA & LOVE'),
  createRomanticSvgDataUrl('#ec4899', '#be185d', '🌹', 'RED ROSE'),
  createRomanticSvgDataUrl('#8b5cf6', '#4c1d95', '✨', 'HAPPY BDAY'),
  createRomanticSvgDataUrl('#f97316', '#c2410c', '🌅', 'SUNSET LOVE'),
  createRomanticSvgDataUrl('#e11d48', '#9f1239', '💖', 'FOREVER'),
  createRomanticSvgDataUrl('#06b6d4', '#0e7490', '🏖️', 'SWEET MEMORY'),
  createRomanticSvgDataUrl('#fb7185', '#fda4af', '🎂', 'BIRTHDAY CAKE'),
  createRomanticSvgDataUrl('#d946ef', '#701a75', '💌', 'LOVE LETTER'),
  createRomanticSvgDataUrl('#f43f5e', '#be123c', '🥰', 'SMILE ALWAYS'),
  createRomanticSvgDataUrl('#10b981', '#047857', '🍀', 'MY LUCKY CHARM'),
  createRomanticSvgDataUrl('#6366f1', '#3730a3', '⭐', 'WISH UPON STAR'),
  createRomanticSvgDataUrl('#f43f5e', '#fda4af', '💍', 'TOGETHER'),
  createRomanticSvgDataUrl('#ec4899', '#9d174d', '🧸', 'CUDDLES'),
  createRomanticSvgDataUrl('#f59e0b', '#b45309', '☕', 'WARM MOMENTS'),
  createRomanticSvgDataUrl('#3b82f6', '#1d4ed8', '🌙', 'MOONLIGHT'),
  createRomanticSvgDataUrl('#ec4899', '#e11d48', '💐', 'FLOWERS'),
  createRomanticSvgDataUrl('#14b8a6', '#0f766e', '🎈', 'CELEBRATE'),
  createRomanticSvgDataUrl('#f43f5e', '#4c0519', '🍫', 'SWEET TREATS'),
  createRomanticSvgDataUrl('#8b5cf6', '#db2777', '🎵', 'OUR SONG'),
  createRomanticSvgDataUrl('#e11d48', '#fb7185', '❤️', 'NEYA'),
];
