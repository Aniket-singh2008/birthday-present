import React, { useState, useEffect } from 'react';
import { RotateCcw, X, Heart, Grid } from 'lucide-react';
import { getPhotosFromStorage } from '../utils/storage';
import { DEFAULT_ROMANTIC_PHOTOS } from '../utils/defaultArtworks';

export interface HeartFinaleProps {
  finalText: string;
  defaultPhotos: string[];
  onReplay: () => void;
}

interface TileInfo {
  id: number;
  t: number;
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  rotation: number;
  imgSrc: string;
  isCustom: boolean;
  isInterior?: boolean;
}

export const HeartFinale: React.FC<HeartFinaleProps> = ({
  finalText,
  defaultPhotos,
  onReplay,
}) => {
  const [tiles, setTiles] = useState<TileInfo[]>([]);
  const [assembled, setAssembled] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [showGalleryView, setShowGalleryView] = useState(false);

  // Fallback photo pool: uses provided defaultPhotos or built-in vector photos
  const fallbackPool =
    defaultPhotos && defaultPhotos.length > 0 ? defaultPhotos : DEFAULT_ROMANTIC_PHOTOS;

  // Load custom photos from IndexedDB on mount (preserving all user uploaded photos!)
  useEffect(() => {
    async function loadStored() {
      let overrides: Record<number, string> = {};
      let bulk: string[] = [];

      try {
        const storedTiles = await getPhotosFromStorage<Record<number, string>>('heart_tile_overrides');
        if (storedTiles && typeof storedTiles === 'object') {
          overrides = storedTiles;
        }
        const storedBulk = await getPhotosFromStorage<string[]>('heart_photos');
        if (storedBulk && Array.isArray(storedBulk) && storedBulk.length > 0) {
          bulk = storedBulk;
        }
      } catch (e) {
        console.error('Error loading stored photos:', e);
      }

      buildHeartTiles(bulk, overrides);
    }
    loadStored();
  }, []);

  // Construct heart tiles using parametric equation
  const buildHeartTiles = (bulk: string[], overrides: Record<number, string>) => {
    setAssembled(false);

    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
    const scale = isMobile ? 8.2 : isTablet ? 11.2 : 13.2;

    const availablePhotos = bulk.length > 0 ? bulk : fallbackPool;
    const count = isMobile ? 26 : 34;
    const newTiles: TileInfo[] = [];

    // Parametric heart:
    // x = 16 sin^3(t)
    // y = -(13 cos t - 5 cos 2t - 2 cos 3t - cos 4t)
    for (let i = 0; i < count; i++) {
      const t = (i / count) * (Math.PI * 2);
      const mathX = 16 * Math.pow(Math.sin(t), 3);
      const mathY = -(
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
      );

      const angle = Math.random() * Math.PI * 2;
      const distance = 460 + Math.random() * 300;
      const startX = Math.cos(angle) * distance;
      const startY = Math.sin(angle) * distance;
      const rotation = (Math.random() - 0.5) * 18;

      const customImg = overrides[i];
      const defaultImg = availablePhotos[i % availablePhotos.length];

      newTiles.push({
        id: i,
        t,
        targetX: mathX * scale,
        targetY: mathY * scale + 15,
        startX,
        startY,
        rotation,
        imgSrc: customImg || defaultImg,
        isCustom: !!customImg,
      });
    }

    // Interior sweet spot tiles
    const interiorCount = isMobile ? 4 : 7;
    for (let j = 0; j < interiorCount; j++) {
      const id = count + j;
      const t = (j / interiorCount) * (Math.PI * 2);
      const mathX = 16 * Math.pow(Math.sin(t), 3) * 0.52;
      const mathY =
        -(
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)
        ) * 0.52;

      const angle = Math.random() * Math.PI * 2;
      const distance = 480 + Math.random() * 200;
      const startX = Math.cos(angle) * distance;
      const startY = Math.sin(angle) * distance;
      const rotation = (Math.random() - 0.5) * 16;

      const customImg = overrides[id];
      const defaultImg = availablePhotos[(count + j) % availablePhotos.length];

      newTiles.push({
        id,
        t,
        targetX: mathX * scale,
        targetY: mathY * scale + 15,
        startX,
        startY,
        rotation,
        imgSrc: customImg || defaultImg,
        isCustom: !!customImg,
        isInterior: true,
      });
    }

    setTiles(newTiles);

    setTimeout(() => {
      setAssembled(true);
    }, 100);
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-10 px-4 z-10 select-none">
      {/* Main Heart Canvas Container with heartbeat animation */}
      <div
        className={`relative flex items-center justify-center transition-all duration-700 ${
          assembled ? 'animate-heartbeat' : ''
        }`}
        style={{ width: 'min(92vw, 560px)', height: 'min(80vw, 480px)' }}
      >
        {tiles.map((tile) => {
          const x = assembled ? tile.targetX : tile.startX;
          const y = assembled ? tile.targetY : tile.startY;
          const rot = assembled ? tile.rotation : tile.rotation * 4;
          const opacity = assembled ? 1 : 0;
          const scale = assembled ? 1 : 0.4;
          const isCustom = tile.isCustom;

          return (
            <div
              key={`${tile.id}-${tile.imgSrc.slice(0, 30)}`}
              onClick={() => setLightboxPhoto(tile.imgSrc)}
              style={{
                transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`,
                transition: 'transform 1.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                opacity,
              }}
              className={`absolute w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl overflow-hidden cursor-pointer shadow-[0_4px_16px_rgba(244,63,94,0.5)] border-[2.5px] ${
                isCustom ? 'border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.8)] z-20' : 'border-white'
              } hover:scale-135 hover:z-40 transition-transform duration-200 group bg-slate-900`}
              title="Tap to view full size"
            >
              <img
                src={tile.imgSrc}
                alt={`Photo #${tile.id + 1}`}
                onError={(e) => {
                  const fallback = DEFAULT_ROMANTIC_PHOTOS[tile.id % DEFAULT_ROMANTIC_PHOTOS.length];
                  if ((e.target as HTMLImageElement).src !== fallback) {
                    (e.target as HTMLImageElement).src = fallback;
                  }
                }}
                className="w-full h-full object-cover group-hover:brightness-110"
              />

              {/* Gentle romantic shine overlay on hover */}
              <div className="absolute inset-0 bg-pink-500/15 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* Romantic Finale Text Under Heart */}
      <div className="mt-8 text-center z-20 flex flex-col items-center">
        <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-pink-400 drop-shadow-[0_2px_20px_rgba(244,63,94,0.8)] font-bold">
          {finalText}
        </h2>
        <p className="font-poppins text-xs sm:text-sm text-pink-200/90 mt-1.5 flex items-center justify-center gap-1.5">
          <span>❤️ Tap any photo to view full size</span>
        </p>
      </div>

      {/* Floating Bottom Action Bar (Locked Mode: View Only) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-900/90 border border-pink-500/50 shadow-[0_8px_32px_rgba(244,63,94,0.4)] backdrop-blur-md">
        {/* View All Photos Grid */}
        <button
          onClick={() => setShowGalleryView(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full font-poppins font-semibold text-xs sm:text-sm text-pink-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 cursor-pointer whitespace-nowrap transition-colors"
        >
          <Grid className="w-4 h-4" />
          <span>All Photos Grid</span>
        </button>

        {/* Replay full experience */}
        <button
          onClick={onReplay}
          title="Replay from Scene 1"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full font-poppins font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-400 hover:to-rose-500 active:scale-95 shadow-[0_0_16px_rgba(244,63,94,0.6)] cursor-pointer whitespace-nowrap transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Replay Experience</span>
        </button>
      </div>

      {/* MODAL: PHOTO GALLERY GRID VIEW (LOCKED/VIEW-ONLY) */}
      {showGalleryView && (
        <div
          onClick={() => setShowGalleryView(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full max-h-[85vh] rounded-2xl overflow-hidden bg-slate-900 border-2 border-pink-500 p-5 flex flex-col"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
                <h3 className="font-poppins text-lg font-bold text-white">
                  All {tiles.length} Heart Memories
                </h3>
              </div>
              <button
                onClick={() => setShowGalleryView(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:bg-pink-600 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[65vh] py-4 grid grid-cols-4 sm:grid-cols-6 gap-2.5">
              {tiles.map((tile) => (
                <div
                  key={tile.id}
                  onClick={() => {
                    setShowGalleryView(false);
                    setLightboxPhoto(tile.imgSrc);
                  }}
                  className="group relative aspect-square rounded-xl overflow-hidden border-2 border-slate-700 hover:border-pink-400 cursor-pointer bg-slate-950"
                  title="Click to view full size"
                >
                  <img src={tile.imgSrc} alt={`#${tile.id + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX POPUP (VIEW ONLY) */}
      {lightboxPhoto && (
        <div
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/92 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full max-h-[85vh] rounded-2xl overflow-hidden bg-slate-900 border-2 border-pink-400 shadow-[0_0_50px_rgba(244,63,94,0.7)] flex flex-col items-center"
          >
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/70 text-white hover:bg-pink-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={lightboxPhoto}
              alt="Memory Fullscreen"
              className="w-full max-h-[75vh] object-contain bg-black"
            />
            <div className="w-full p-3.5 text-center bg-slate-950/90 text-pink-200 text-lg font-script flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
              <span>Happy Birthday Neha ❤️ Forever in my heart</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
