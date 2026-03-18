import { motion, AnimatePresence, useInView } from 'motion/react';
import { useState, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import daggerImage from '../assets/fry-daggers/daggerImage.webp';
import heroImageMobile from '../assets/fry-daggers/heroImageMobile.webp';
import heroImageDesktop from '../assets/fry-daggers/heroImageDesktop.webp';
import heroImageMobile2 from '../assets/fry-daggers/heroImageMobile2.webp';
import heroImageDesktop2 from '../assets/fry-daggers/heroImageDesktop2.webp';

interface FryDaggersContentProps {
  onBack: () => void;
}

// Scroll reveal component
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function FryDaggersContent({ onBack }: FryDaggersContentProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [fullscreenSlide, setFullscreenSlide] = useState(0);
  const [showManifesto, setShowManifesto] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'TR'>('EN');
  
  // Touch handlers for swipe
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const mobileImages = [heroImageMobile, heroImageMobile2];
  const desktopImages = [heroImageDesktop, heroImageDesktop2];

  const handleScroll = useCallback(() => {
    setShowIntro(false);
  }, []);

  const handleBuyNow = useCallback(() => {
    setShowModal(true);
  }, []);

  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % 2);
  }, []);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + 2) % 2);
  }, []);

  const goToNextFullscreenSlide = useCallback(() => {
    setFullscreenSlide((prev) => (prev + 1) % 2);
  }, []);

  const goToPrevFullscreenSlide = useCallback(() => {
    setFullscreenSlide((prev) => (prev - 1 + 2) % 2);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStart - touchEnd > 75) {
      goToNextSlide();
    }
    if (touchStart - touchEnd < -75) {
      goToPrevSlide();
    }
  }, [touchStart, touchEnd, goToNextSlide, goToPrevSlide]);

  const handleFullscreenTouchEnd = useCallback(() => {
    if (touchStart - touchEnd > 75) {
      goToNextFullscreenSlide();
    }
    if (touchStart - touchEnd < -75) {
      goToPrevFullscreenSlide();
    }
  }, [touchStart, touchEnd, goToNextFullscreenSlide, goToPrevFullscreenSlide]);

  const handleImageClick = useCallback(() => {
    setFullscreenSlide(currentSlide);
    setShowFullscreen(true);
  }, [currentSlide]);

  return (
    <div className="relative bg-black text-white">
      {/* Max-width container for ultra-wide screens */}
      <div className="max-w-[1920px] mx-auto relative">
        {/* BACK BUTTON - TOP RIGHT */}
        <div className="absolute top-8 right-8 z-50 flex items-center gap-4">
          {/* MANIFESTO button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="border-2 border-white px-4 py-1 rounded-full hover:bg-white hover:text-black transition-all duration-200 bg-transparent text-white"
            style={{ 
              fontFamily: 'Arial Black, sans-serif', 
              fontWeight: 900,
            }}
            onClick={() => setShowManifesto(!showManifesto)}
          >
            <span className="text-[14px]">MANIFESTO</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onBack}
            className="hover:opacity-50 transition-opacity duration-200 text-white"
            style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
          >
            <span className="text-[24px]">BACK →</span>
          </motion.button>
        </div>

        {/* CLOSE FULLSCREEN BUTTON - BELOW BACK */}
        {showFullscreen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFullscreen(false)}
            className="absolute top-20 right-8 z-[60] hover:opacity-70 transition-opacity"
          >
            <X className="w-10 h-10 text-white" strokeWidth={3} />
          </motion.button>
        )}

        {/* INTRO OVERLAY */}
        <AnimatePresence>
          {showIntro && (
            <motion.div
              initial={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
              onWheel={handleScroll}
              onTouchMove={handleScroll}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-[200px] h-[2px] bg-gradient-to-r from-transparent via-[#D9D9D9] to-transparent mb-8"
                style={{ boxShadow: '0 0 20px rgba(217, 217, 217, 0.5)' }}
              />
              
              <motion.div
                initial={{ opacity: 0, y: -150, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                className="mb-8"
              >
                <img
                  src={daggerImage}
                  alt="FryDagger"
                  className="w-auto h-[200px]"
                  loading="eager"
                  fetchPriority="high"
                  style={{ filter: 'drop-shadow(0 10px 40px rgba(217, 217, 217, 0.5))' }}
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="text-[24px] md:text-[28px] tracking-tight text-center px-8 mb-4"
                style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900, letterSpacing: '0.02em' }}
              >
                THE MOST EXPENSIVE WAY TO EAT FRIES
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.8 }}
                className="text-[14px] text-[#AAAAAA] mb-4"
                style={{ fontFamily: 'Arial, sans-serif' }}
              >
                Swipe to begin the ritual.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.2, repeat: Infinity, repeatType: 'reverse' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5 L12 19 M12 19 L5 12 M12 19 L19 12" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STICKY BOTTOM BAR */}
        {!showIntro && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-t border-[#333333] flex items-center justify-between px-6 h-16"
          >
            <div className="text-[14px] tracking-wide" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 500 }}>
              FRYDAGGER — <span className="text-[#D9D9D9]">$299</span>
            </div>
            <button
              onClick={handleBuyNow}
              className="bg-[#E53935] hover:bg-[#D32F2F] active:bg-[#C62828] transition-colors px-8 h-full text-[14px] tracking-wider"
              style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
            >
              SOLD OUT
            </button>
          </motion.div>
        )}

        {/* CHECKOUT MODAL */}
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#111111] rounded-lg p-8 max-w-[320px] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                className="text-[16px] text-center mb-6 leading-tight"
                style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
              >
                Do you swear to never touch fries with your bare hands again?
              </h2>

              <div className="space-y-3">
                <button
                  className="w-full bg-[#E53935] hover:bg-[#D32F2F] py-4 text-[14px] tracking-wider transition-colors"
                  style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
                >
                  YES, I SWEAR
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-transparent border-2 border-white hover:bg-white hover:text-black py-4 text-[14px] tracking-wider transition-colors"
                  style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
                >
                  NO, I AM WEAK
                </button>
              </div>

              <p className="text-[10px] text-[#777777] text-center mt-6" style={{ fontFamily: 'Arial, sans-serif' }}>
                By swearing, you accept the terms of the Order of the Fry.
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* MAIN CONTENT */}
        <div className="pb-20 overflow-y-auto h-screen cursor-crosshair">
          {/* HERO SECTION */}
          <section className="min-h-screen flex flex-col items-center justify-center pt-20 pb-12">
            <motion.p
              initial={{ opacity: 0 }}
              animate={!showIntro ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[11px] text-[#B0B0B0] tracking-[0.2em] mb-8 px-6"
              style={{ fontFamily: 'Arial, sans-serif', fontWeight: 300 }}
            >
              THE ORDER OF THE FRY
            </motion.p>

            <div className="mb-8 w-full">
              {/* HERO IMAGE CAROUSEL */}
              <div className="relative w-full px-8">
                {/* Mobile Image */}
                <img
                  src={mobileImages[currentSlide]}
                  alt="FryDagger"
                  className="w-full h-auto md:hidden cursor-pointer"
                  loading="eager"
                  fetchPriority="high"
                  style={{ filter: 'drop-shadow(0 10px 40px rgba(217, 217, 217, 0.3))' }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onClick={handleImageClick}
                />
                {/* Desktop Image */}
                <img
                  src={desktopImages[currentSlide]}
                  alt="FryDagger"
                  className="w-full h-auto hidden md:block cursor-pointer"
                  loading="eager"
                  fetchPriority="high"
                  style={{ filter: 'drop-shadow(0 10px 40px rgba(217, 217, 217, 0.3))' }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onClick={handleImageClick}
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={goToPrevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                >
                  <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />
                </button>
                
                <button
                  onClick={goToNextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                >
                  <ChevronRight className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />
                </button>
                
                {/* Dot Indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {[0, 1].map((index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={!showIntro ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-[22px] md:text-[24px] text-center mb-6 px-4"
              style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
            >
              HIGH-END SILVER FOR LOW-KEY SNACKS
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={!showIntro ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-[14px] md:text-[15px] text-[#E0E0E0] text-center max-w-[320px] mb-8 leading-relaxed px-6"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              A handcrafted miniature silver dagger designed solely for eating fries.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={!showIntro ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              onClick={handleBuyNow}
              className="bg-[#E53935] hover:bg-[#D32F2F] active:bg-[#C62828] px-12 py-4 rounded-lg text-[14px] tracking-wider transition-colors"
              style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
            >
              ENTER THE ORDER — $299
            </motion.button>
          </section>

          {/* RITUAL STEPS - HORIZONTAL SLIDER */}
          <section className="min-h-screen relative">
            <div className="h-screen overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex scrollbar-hide" id="ritual-slider">
              {[
                {
                  title: 'STEP I  CONSECRATION',
                  text: 'Your fries must be purified from mortal hands. The dagger allows no grease, no fingerprints, no dishonor.',
                },
                {
                  title: 'STEP II  SELECTION',
                  text: 'Not every fry is worthy of the dagger. You must choose the chosen ones: the longest, the crispiest, the most golden.',
                },
                {
                  title: 'STEP III  THE STAB',
                  text: 'This is the sacred gesture. A single clean puncture. A metallic whisper. The fry becomes more than food — it becomes a sacrifice.',
                },
                {
                  title: 'STEP IV  ASCENSION',
                  text: 'The fry rises toward enlightenment… and your mouth. Do not rush. Each bite is a ceremony, not a snack.',
                },
              ].map((step, index) => {
                const stepRef = useRef(null);
                const isStepInView = useInView(stepRef, { amount: 0.65, once: false });

                return (
                  <motion.div
                    key={index}
                    ref={stepRef}
                    initial={{ opacity: 0, y: 60 }}
                    animate={{
                      opacity: isStepInView ? 1 : 0.3,
                      y: isStepInView ? 0 : 60,
                      scale: isStepInView ? 1 : 0.95,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex-shrink-0 w-full h-full snap-center flex flex-col items-center justify-center px-6"
                  >
                    <h2
                      className="text-[22px] md:text-[26px] text-center mb-6 tracking-tight"
                      style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
                    >
                      {step.title}
                    </h2>
                    <p
                      className="text-[14px] md:text-[15px] text-[#CCCCCC] text-center max-w-[320px] leading-relaxed mb-8"
                      style={{ fontFamily: 'Arial, sans-serif' }}
                    >
                      {step.text}
                    </p>
                    
                    {/* Scroll indicator dots */}
                    <div className="flex justify-center gap-2">
                      {[0, 1, 2, 3].map((dot) => (
                        <div
                          key={dot}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            dot === index ? 'bg-white' : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => {
                const slider = document.getElementById('ritual-slider');
                if (slider) slider.scrollBy({ left: -slider.clientWidth, behavior: 'smooth' });
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 hover:opacity-70 transition-opacity"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M20 8 L12 16 L20 24" stroke="#999999" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            <button
              onClick={() => {
                const slider = document.getElementById('ritual-slider');
                if (slider) slider.scrollBy({ left: slider.clientWidth, behavior: 'smooth' });
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 hover:opacity-70 transition-opacity"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M12 8 L20 16 L12 24" stroke="#999999" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </section>

          {/* RITUAL HANDBOOK */}
          <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
            <ScrollReveal>
              <h2
                className="text-[16px] md:text-[18px] text-center mb-12 tracking-tight"
                style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
              >
                THE BOOK OF FRY  CHAPTER V: APPLICATIONS
              </h2>

              <div className="space-y-6 max-w-[320px]">
                {[
                  { title: 'The Ritual Stab', desc: 'For the first fry of every meal.' },
                  { title: 'The Blessing of the Fry', desc: 'Hold the dagger above the fries before choosing your sacrifice.' },
                  { title: 'The Banishing of Grease', desc: 'You will never touch fries with your bare hands again.' },
                  { title: 'The Social Flex Ceremony', desc: 'Place the dagger on the table. Say nothing. Let it speak.' },
                ].map((ritual, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-[#C0C0C0] text-[18px] mr-4 mt-1">†</span>
                    <div>
                      <h3
                        className="text-[14px] mb-1"
                        style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
                      >
                        {ritual.title}
                      </h3>
                      <p className="text-[12px] md:text-[13px] text-[#BEBEBE]" style={{ fontFamily: 'Arial, sans-serif' }}>
                        {ritual.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </section>

          {/* FOOTER */}
          <footer className="px-6 py-12 border-t border-[#222222]">
            <div className="max-w-[320px] mx-auto">
              <h3
                className="text-[14px] mb-4"
                style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
              >
                LEGAL
              </h3>
              <ul className="text-[11px] md:text-[12px] text-[#777777] space-y-2" style={{ fontFamily: 'Arial, sans-serif' }}>
                <li>– Do not use as a weapon (except against fries).</li>
                <li>– Eating fries with fingers after purchasing this may be considered sacrilegious.</li>
                <li>– This is not a religion. But it could be.</li>
              </ul>
            </div>
          </footer>
        </div>

        {/* FULLSCREEN IMAGE VIEW */}
        {showFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={() => setShowFullscreen(false)}
          >
            <div className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleFullscreenTouchEnd}
            >
              {/* Mobile Image */}
              <img
                src={mobileImages[fullscreenSlide]}
                alt="FryDagger"
                className="w-full h-full object-contain md:hidden"
                style={{ filter: 'drop-shadow(0 10px 40px rgba(217, 217, 217, 0.3))' }}
              />
              {/* Desktop Image */}
              <img
                src={desktopImages[fullscreenSlide]}
                alt="FryDagger"
                className="w-full h-full object-contain hidden md:block"
                style={{ filter: 'drop-shadow(0 10px 40px rgba(217, 217, 217, 0.3))' }}
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevFullscreenSlide();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
              >
                <ChevronLeft className="w-12 h-12 text-white" strokeWidth={3} />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextFullscreenSlide();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
              >
                <ChevronRight className="w-12 h-12 text-white" strokeWidth={3} />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {[0, 1].map((index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === fullscreenSlide ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Manifesto Pop-up */}
        {showManifesto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-6"
            onClick={() => setShowManifesto(false)}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.10)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 md:p-12 max-w-2xl w-full rounded-3xl relative text-center"
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Close X button */}
              <button
                onClick={() => setShowManifesto(false)}
                className="absolute top-6 right-6 text-white hover:opacity-70 transition-opacity text-[24px]"
                style={{
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: 'bold',
                }}
              >
                ✕
              </button>

              {/* Language Selector - Top Left */}
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <button
                  onClick={() => setLanguage('TR')}
                  className={`text-[14px] transition-opacity ${language === 'TR' ? 'text-white opacity-100' : 'text-white/50 hover:opacity-70'}`}
                  style={{
                    fontFamily: 'Arial Black, sans-serif',
                    fontWeight: 900,
                  }}
                >
                  TR
                </button>
                <span className="text-white/50 text-[14px]">—</span>
                <button
                  onClick={() => setLanguage('EN')}
                  className={`text-[14px] transition-opacity ${language === 'EN' ? 'text-white opacity-100' : 'text-white/50 hover:opacity-70'}`}
                  style={{
                    fontFamily: 'Arial Black, sans-serif',
                    fontWeight: 900,
                  }}
                >
                  EN
                </button>
              </div>

              {/* Small MANIFESTO label */}
              <div
                className="text-[10px] md:text-[12px] mb-2 text-white tracking-widest"
                style={{
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: 'normal',
                }}
              >
                MANIFESTO
              </div>

              <h2
                className="text-[24px] md:text-[32px] mb-6 tracking-tight text-white"
                style={{
                  fontFamily: 'Arial Black, sans-serif',
                  fontWeight: 900,
                }}
              >
                #2 FRYDAGGERS
              </h2>
              <p
                className="text-[14px] md:text-[16px] leading-relaxed text-white"
                style={{
                  fontFamily: 'Arial, sans-serif',
                }}
              >
                {language === 'EN'
                  ? "These silver daggers were created to collide the cheapness of fast food with the grandeur of luxury. Not to keep your fingers clean, but to add an absurd weight to a simple snack. The value of a fry never changes; at most, the object that touches it can. And in that moment, the difference between an ordinary person and the wealthy becomes visible. FryDaggers is the absurd reflection of that difference. This object does not claim functionality. It is not a status symbol. FryDaggers is an object that takes pride in its uselessness, because sometimes an item gains value precisely through the meaninglessness of its purpose."
                  : "Bu gümüş hançerler, fast food'un ucuzluğunu lüksün görkemiyle çarpıştırmak için yaratıldı. Parmaklarınızı temiz tutmak için değil, basit bir atıştırmalığa absürt bir ağırlık eklemek için. Bir patateskızartmasının değeri asla değişmez; en fazla ona dokunan nesne değişebilir. Ve o anda, sıradan bir insan ile zengin arasındaki fark görünür hale gelir. FryDaggers bu farkın absürt yansıması. Bu nesne işlevsellik iddiasında değil. Bir statü sembolü de değil. FryDaggers işe yaramazlığıyla gurur duyan bir nesne çünkü bazen bir eşya değerini tam da amacının anlamsızlığından kazanır."
                }
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}