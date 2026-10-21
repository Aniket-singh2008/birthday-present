import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Heart } from 'lucide-react';
import { CardFrontHandsHeartSvg, PhotoSlot } from './Artworks';
import { savePhotosToStorage, getPhotosFromStorage } from '../utils/storage';

export interface PageItem {
  id: string;
  text: string;
  leftPhoto: string;
  rightPhoto: string;
}

export interface BookCardProps {
  scene: 3 | 4 | 5;
  pages: PageItem[];
  onOpenCard: () => void;
  onFinishPages: () => void;
  onScene5Complete: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  scene,
  pages,
  onOpenCard,
  onFinishPages,
  onScene5Complete,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [customPhotos, setCustomPhotos] = useState<Record<string, string>>({});
  const [pageTransitioning, setPageTransitioning] = useState(false);

  // Load custom page photos from storage on mount
  useEffect(() => {
    async function loadPagePhotos() {
      const stored = await getPhotosFromStorage<Record<string, string>>('page_photos');
      if (stored) {
        setCustomPhotos(stored);
      }
    }
    loadPagePhotos();
  }, []);

  const handleSavePhoto = async (key: string, dataUrl: string) => {
    const updated = { ...customPhotos, [key]: dataUrl };
    setCustomPhotos(updated);
    await savePhotosToStorage('page_photos', updated);
  };

  const currentPage = pages[currentPageIndex] || pages[0];

  // Typewriter effect for Scene 4
  useEffect(() => {
    if (scene !== 4) return;
    setDisplayedText('');
    const fullText = currentPage.text;
    let index = 0;

    const timer = setInterval(() => {
      index++;
      setDisplayedText(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(timer);
      }
    }, 45);

    return () => clearInterval(timer);
  }, [scene, currentPageIndex, currentPage.text]);

  // Handle Scene 5 fly-away animation
  useEffect(() => {
    if (scene === 5) {
      const timer = setTimeout(() => {
        onScene5Complete();
      }, 1900);
      return () => clearTimeout(timer);
    }
  }, [scene, onScene5Complete]);

  const handleNextPage = () => {
    if (pageTransitioning) return;
    if (currentPageIndex < pages.length - 1) {
      setPageTransitioning(true);
      setTimeout(() => {
        setCurrentPageIndex((prev) => prev + 1);
        setPageTransitioning(false);
      }, 300);
    } else {
      onFinishPages();
    }
  };

  const handlePrevPage = () => {
    if (pageTransitioning || currentPageIndex <= 0) return;
    setPageTransitioning(true);
    setTimeout(() => {
      setCurrentPageIndex((prev) => prev - 1);
      setPageTransitioning(false);
    }, 300);
  };

  const leftKey = `${currentPage.id}_left`;
  const rightKey = `${currentPage.id}_right`;
  const currentLeftPhoto = customPhotos[leftKey] || currentPage.leftPhoto;
  const currentRightPhoto = customPhotos[rightKey] || currentPage.rightPhoto;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[82vh] px-4 py-8 select-none">
      {/* 3D BOOK CONTAINER */}
      <div className="perspective-1000 w-full flex items-center justify-center">
        {/* SCENE 3: The Unopened Card */}
        {scene === 3 && (
          <div className="flex flex-col items-center animate-fade-in">
            <div
              onClick={onOpenCard}
              className="w-72 sm:w-80 md:w-96 h-[400px] sm:h-[450px] bg-[#fbf3dc] rounded-2xl shadow-[0_15px_40px_rgba(244,63,94,0.35),0_4px_12px_rgba(0,0,0,0.3)] border-2 border-[#e8d8be] cursor-pointer hover:scale-102 transition-transform duration-300 flex flex-col items-center justify-center overflow-hidden p-4 relative group"
            >
              {/* Card Cover Art */}
              <CardFrontHandsHeartSvg className="w-full h-full" />

              {/* Decorative corner trims */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#b59d80]/60 rounded-tl-sm pointer-events-none" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#b59d80]/60 rounded-tr-sm pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#b59d80]/60 rounded-bl-sm pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#b59d80]/60 rounded-br-sm pointer-events-none" />
            </div>

            {/* Pulsing Hint below card */}
            <button
              onClick={onOpenCard}
              className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#fbf3dc]/95 text-[#6b4c35] text-sm font-poppins font-bold shadow-xl hover:bg-[#fbf3dc] transition-all animate-soft-pulse cursor-pointer border border-[#e8d8be]"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Tap to open ❤️</span>
            </button>
          </div>
        )}

        {/* SCENE 4: Open Card Pages (Message + Photos) */}
        {scene === 4 && (
          <div
            className={`w-full max-w-2xl bg-[#fbf3dc] rounded-2xl shadow-[0_20px_50px_rgba(244,63,94,0.4),0_6px_20px_rgba(0,0,0,0.25)] border-2 border-[#e8d8be] p-5 sm:p-7 flex flex-col gap-5 transition-all duration-300 ${
              pageTransitioning ? 'opacity-40 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            {/* TOP: Message Box with tiny pink heart in top-right */}
            <div className="relative bg-[#fffdf5] rounded-xl p-4 sm:p-6 border border-[#e6d5ba] shadow-xs min-h-[90px] flex items-center">
              <span className="absolute top-3 right-3 text-sm text-pink-500 animate-pulse">
                💖
              </span>

              {/* Typewriter text in script handwriting font */}
              <p className="font-script text-2xl sm:text-3xl md:text-4xl text-[#4a2e1b] leading-relaxed pr-6 font-semibold">
                {displayedText}
                <span className="cursor-blink inline-block w-1.5 h-6 bg-pink-500 ml-1 align-middle" />
              </p>
            </div>

            {/* BOTTOM: Photo Box showing TWO photos side-by-side with thin divider */}
            <div className="relative bg-[#fffdf5] rounded-xl p-3 sm:p-4 border border-[#e6d5ba] shadow-xs">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 relative">
                {/* Thin vertical divider in center */}
                <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-[1.5px] bg-[#dfcfb5]/80 pointer-events-none z-10" />

                {/* Left Photo */}
                <div className="flex flex-col items-center">
                  <PhotoSlot
                    src={currentLeftPhoto}
                    fallbackFilename={`/images/p${currentPageIndex + 1}-left.jpg`}
                    label="Left Photo"
                  />
                </div>

                {/* Right Photo */}
                <div className="flex flex-col items-center">
                  <PhotoSlot
                    src={currentRightPhoto}
                    fallbackFilename={`/images/p${currentPageIndex + 1}-right.jpg`}
                    label="Right Photo"
                  />
                </div>
              </div>
            </div>

            {/* Page Navigation & Next Action */}
            <div className="flex items-center justify-between pt-2 font-poppins">
              <button
                onClick={handlePrevPage}
                disabled={currentPageIndex === 0}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#6b4c35] border border-[#d6c4a8] transition-opacity cursor-pointer ${
                  currentPageIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-80 hover:opacity-100 hover:bg-[#f2e6cb]'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="text-xs font-bold text-[#8c6d53] tracking-wider font-mono">
                Page {currentPageIndex + 1} / {pages.length}
              </div>

              <button
                onClick={handleNextPage}
                className="flex items-center gap-1 px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>{currentPageIndex < pages.length - 1 ? 'Next Page' : 'Turn to Finale ➔'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SCENE 5: The Closing Flip */}
        {scene === 5 && (
          <div className="w-72 sm:w-80 md:w-96 h-[400px] sm:h-[450px] bg-[#fbf3dc] rounded-2xl shadow-[0_20px_50px_rgba(244,63,94,0.6)] border-2 border-[#e8d8be] flex flex-col items-center justify-center p-4 relative animate-[flyAway_1.8s_cubic-bezier(0.25,1,0.5,1)_forwards]">
            <CardFrontHandsHeartSvg className="w-full h-full" />
            <div className="absolute inset-0 bg-pink-500/10 rounded-2xl pointer-events-none" />
          </div>
        )}
      </div>

      <style>{`
        @keyframes flyAway {
          0% {
            transform: scale(1) translateY(0) rotateY(0deg);
            opacity: 1;
          }
          40% {
            transform: scale(0.85) translateY(-30px) rotateY(-360deg);
            opacity: 0.9;
          }
          100% {
            transform: scale(0.12) translateY(-700px) rotateY(-720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
