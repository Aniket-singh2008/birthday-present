/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Heart, RotateCcw } from 'lucide-react';
import { MatrixRainCanvas, StarryNightCanvas } from './components/BackgroundCanvases';
import { BirthdayCatSvg } from './components/Artworks';
import { BookCard } from './components/BookCard';
import { HeartFinale } from './components/HeartFinale';
import { romanticAudio } from './utils/audioPlayer';
import { DEFAULT_ROMANTIC_PHOTOS } from './utils/defaultArtworks';

// ==========================================
// 💖 CONFIGURATION - EDIT YOUR DETAILS HERE
// ==========================================
export const CONFIG = {
  // Birthday person's name
  name: 'Neha',

  // Countdown & text items for Scene 1 Matrix digital rain intro
  countdownItems: ['3', '2', '1', 'Happy', 'Birthday', 'Neha', '💖'],
  countdownDurationMs: 1100, // Duration per item in ms

  // Scene 2: Cat display duration (seconds)
  catDurationSec: 4.5,
  catGifUrl: '/images/cat.gif',

  // Scene 3: Card front artwork
  cardFrontUrl: '/images/card-front.png',

  // Scene 4: Photo + Message pages
  pages: [
    {
      id: 'p1',
      text: 'Happy birthday my love Neha ❤️',
      leftPhoto: '/images/p1-left.jpg',
      rightPhoto: '/images/p1-right.jpg',
    },
    {
      id: 'p2',
      text: "As long as you're smiling, I'm happy. Stay happy, my love.",
      leftPhoto: '/images/p2-left.jpg',
      rightPhoto: '/images/p2-right.jpg',
    },
  ],

  // Scene 6: Finale text displayed below the pulsing photo heart
  finaleText: 'Happy Birthday Neha ❤️',

  // Default gallery photos for heart tiles (g1.jpg to g20.jpg)
  defaultGalleryPhotos: Array.from(
    { length: 20 },
    (_, i) => `/images/gallery/g${i + 1}.jpg`
  ),

  // Background romantic music file placeholder
  musicUrl: '/music/song.mp3',
};

export default function App() {
  // Current active scene: 1, 2, 3, 4, 5, or 6
  const [scene, setScene] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [catImageError, setCatImageError] = useState(false);

  // Subscribe to audio state
  useEffect(() => {
    const unsubscribe = romanticAudio.subscribe((playing) => {
      setIsAudioPlaying(playing);
    });
    return unsubscribe;
  }, []);

  // Handle Scene 2 auto-transition
  useEffect(() => {
    if (scene === 2) {
      const timer = setTimeout(() => {
        setScene(3);
      }, CONFIG.catDurationSec * 1000);
      return () => clearTimeout(timer);
    }
  }, [scene]);

  const toggleMusic = async () => {
    await romanticAudio.toggle();
  };

  return (
    <main className="relative w-full min-h-screen bg-[#0a0d1a] text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-pink-500 selection:text-white">
      {/* BACKGROUNDS */}
      {scene === 1 ? (
        <MatrixRainCanvas
          name={CONFIG.name}
          items={CONFIG.countdownItems}
          durationPerItem={CONFIG.countdownDurationMs}
          onComplete={() => setScene(2)}
          onSkip={() => setScene(2)}
        />
      ) : (
        <StarryNightCanvas />
      )}

      {/* TOP HEADER BAR (Z-30) */}
      <header className="relative z-30 w-full flex items-center justify-between px-4 sm:px-6 py-3.5 backdrop-blur-xs">
        {/* Brand & Scene Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-script text-xl sm:text-2xl text-pink-300 font-bold drop-shadow-[0_0_14px_rgba(244,63,94,0.7)]">
            <Heart className="w-5 h-5 fill-pink-500 text-pink-500 animate-pulse" />
            <span>For Neha ❤️</span>
          </div>

          {/* Quick Scene Navigation */}
          <nav
            aria-label="Scene navigation"
            className="hidden sm:flex items-center gap-1 ml-4 px-2.5 py-1 rounded-full bg-slate-900/70 border border-slate-800 text-xs font-poppins text-slate-300"
          >
            {[
              { s: 1, label: 'Intro' },
              { s: 2, label: 'Cat' },
              { s: 3, label: 'Card' },
              { s: 4, label: 'Pages' },
              { s: 6, label: 'Heart' },
            ].map(({ s, label }) => (
              <button
                key={s}
                onClick={() => setScene(s as any)}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  scene === s
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-[0_0_12px_rgba(244,63,94,0.8)]'
                    : 'hover:text-pink-300'
                }`}
                title={`Scene ${s}`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Music Play/Pause Button in Top Right Corner */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMusic}
            aria-label={isAudioPlaying ? 'Mute Music' : 'Play Music'}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-xs font-poppins font-bold backdrop-blur-md border transition-all cursor-pointer ${
              isAudioPlaying
                ? 'bg-pink-600/90 text-white border-pink-400 shadow-[0_0_18px_rgba(244,63,94,0.7)] animate-pulse'
                : 'bg-slate-900/80 text-pink-200 border-pink-500/30 hover:bg-pink-950/70'
            }`}
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">Music Playing 🎵</span>
                <span className="inline sm:hidden">🎵</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline">Play Music 🔇</span>
                <span className="inline sm:hidden">🔇</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* SCENE PRESENTATION CONTAINER */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full">
        {/* SCENE 2: BIRTHDAY CAT */}
        {scene === 2 && (
          <section className="flex flex-col items-center justify-center p-4 text-center animate-fade-in select-none">
            <div className="animate-float-bob flex flex-col items-center">
              {!catImageError ? (
                <img
                  src={CONFIG.catGifUrl}
                  alt="Birthday Cat playing guitar"
                  onError={() => setCatImageError(true)}
                  className="w-64 h-64 sm:w-80 sm:h-80 object-contain drop-shadow-[0_10px_35px_rgba(244,63,94,0.4)]"
                />
              ) : (
                <BirthdayCatSvg className="w-64 h-64 sm:w-80 sm:h-80" />
              )}
            </div>

            <div className="mt-6 flex flex-col items-center">
              <span className="font-script text-2xl sm:text-3xl text-pink-300 drop-shadow-[0_0_15px_rgba(244,63,94,0.6)] font-bold">
                A sweet melody for Neha's special day... 🐾✨
              </span>
              <button
                onClick={() => setScene(3)}
                className="mt-4 px-5 py-2 rounded-full text-xs font-poppins font-bold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
              >
                Open Card ➔
              </button>
            </div>
          </section>
        )}

        {/* SCENE 3, 4, 5: THE CARD, PHOTO PAGES & CLOSING FLIP */}
        {(scene === 3 || scene === 4 || scene === 5) && (
          <BookCard
            scene={scene}
            pages={CONFIG.pages}
            onOpenCard={() => setScene(4)}
            onFinishPages={() => setScene(5)}
            onScene5Complete={() => setScene(6)}
          />
        )}

        {/* SCENE 6: PHOTO HEART FINALE */}
        {scene === 6 && (
          <HeartFinale
            finalText={CONFIG.finaleText}
            defaultPhotos={CONFIG.defaultGalleryPhotos}
            onReplay={() => setScene(1)}
          />
        )}
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 w-full py-2.5 text-center text-xs text-slate-400 font-poppins pointer-events-none">
        <span>Made with all my love for Neha's Birthday ❤️</span>
      </footer>
    </main>
  );
}
