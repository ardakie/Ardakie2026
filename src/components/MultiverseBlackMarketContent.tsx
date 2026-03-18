import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChevronUp, ChevronDown, Power } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import EntryVerificationPopup from './EntryVerificationPopup';
import wishTotemImage from '../assets/multiverse-black-market/wishTotemImage.webp';
import silvaLeafImage from '../assets/multiverse-black-market/silvaLeafImage.webp';
import silenceCanImage from '../assets/multiverse-black-market/silenceCanImage.webp';
import logoImage from '../assets/file-flakes/logoImage.webp';
import posterImage from '../assets/five-minutes-silence/posterImage.png';

interface MultiverseBlackMarketContentProps {
  onBack: () => void;
}

// 3 product data
const products = [
  {
    id: 1,
    seller: '@SilenceVault',
    universe: 'U-34',
    title: '5 MINUTE SILENCE CAN™',
    image: silenceCanImage,
    origin: 'Universe-34 / Scream Core',
    type: 'Canned Silence Capsule',
    value: '$400',
    status: 'BANNED IN ITS HOME UNIVERSE. Confiscated as contraband in 7 dimensions.',
    description: '5 Minute Silence is a rare product imported from a universe where everyone never stops screaming, where communication is not speech but pure vocal force. In that world, silence is a myth, a rumor at best. The atmosphere vibrates constantly; thinking, hearing, even sleeping is a struggle. When this can is opened, the fabric of sound collapses, the screaming voices are swallowed in an instant, and for the first time, five minutes of absolute silence emerges. No more, no less. When the duration ends, the universe returns to its normal noise, and the screams continue exactly where they left off. It is not a true "escape," but for a mind drowning in noise, it is a moment, however brief, to breathe again.',
    risk: 3,
    trace: 'BANNED'
  },
  {
    id: 2,
    seller: '@AstraNine',
    universe: 'U-4Y',
    title: 'OVERUSED WISH TOTEM™',
    image: wishTotemImage,
    origin: 'Gilded-Region 34 / Overuse Cluster',
    type: 'Mis-Cracked Interdimensional Artifact',
    value: '$450',
    status: 'Exhausted. Non-functional. Collectible.',
    description: 'This totem is a prestige object from Gilded-Region 34, worn down by excessive wish usage. This piece is a rare variant, cracked along an incorrect axis. Such fractures occur only when someone from outside that universe attempts to make a wish. It is currently fully "Wish-Exhausted", meaning all usage capacity has been depleted. It can no longer process wishes and has no functional properties. However, its misaligned fracture geometry significantly increases its collectible value.',
    risk: 3,
    trace: 'FLAGGED'
  },
  {
    id: 3,
    seller: '@VynFold',
    universe: 'U-1R',
    title: 'SILVA-LEAF HYBRID™',
    image: silvaLeafImage,
    origin: 'Resolution-Fault Realm / R-FRAME',
    type: 'Resolution Mismatch Botanical Specimen',
    value: '$700',
    status: 'Unstable. Hybrid Material. Collectible.',
    description: 'This plant emerged during a resolution-collapse event in the R-FRAME universe. Part of the leaf grew in full biological resolution, while the missing data region was auto-filled with the universe\'s inorganic "Silva-Alloy" lattice. The result is a half-organic, half–pixel-metal hybrid. Its rarity and unpredictable geometry make it highly collectible.',
    risk: 2,
    trace: 'CLEAN'
  }
];

const tickerMessages = [
  '[U-4Y] attempted unauthorized listing upload',
  'trace signal detected near [Sector 9]',
  'new buyer ping from [U-Prime]',
  '[WARNING] unstable connection to U-1R',
  'handshake timeout from [U-0B]',
  'risk assessment updated for listing 03',
  '[ALERT] unauthorized access attempt blocked'
];

export default function MultiverseBlackMarketContent({ onBack }: MultiverseBlackMarketContentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [direction, setDirection] = useState(0); // 1 = down, -1 = up
  const [isMobile, setIsMobile] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [showPopup, setShowPopup] = useState(true);
  const [showManifesto, setShowManifesto] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'TR'>('EN');
  
  // Video player states
  const [showVideo, setShowVideo] = useState(true); // Start with video
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const touchStartY = useRef(0);

  const currentProduct = products[currentIndex];
  
  // Video handlers
  const handlePlayVideo = () => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasEnded(false);
          })
          .catch((error) => {
            console.log('Video play was prevented:', error);
          });
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setHasEnded(true);
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
    setIsPlaying(false);
    setHasEnded(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleWatchAds = () => {
    setShowVideo(true);
    setIsPlaying(false);
    setHasEnded(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Video'yu preload et
      video.load();
      
      video.addEventListener('ended', handleVideoEnd);
      return () => video.removeEventListener('ended', handleVideoEnd);
    }
  }, []);

  // Manifesto content
  const manifestoContent = {
    EN: {
      title: "Multiverse Black Market",
      text: "If you're tired of the artworks on Earth, good news: Earth hasn't been inspiring for a long time. Same galleries, same collectors, same objects… Pieces sold at ceiling prices, long after their soul has evaporated. Everyone keeps buying versions of each other; as long as the universe stays the same, the outcome does too. Multiverse Blackmarket exists to break that loop. What you see here are excesses, glitches, or luxurious deviations from other realities. Welcome. Nothing familiar exists here."
    },
    TR: {
      title: "Multiverse Black Market",
      text: "Eğer dünyadaki eserlerden sıkıldıysanız, iyi haber: Dünya uzun süredir ilham vermiyor. Aynı galeriler, aynı koleksiyonerler, aynı objeler… Ruhu çoktan tükenmiş işler tavan fiyatlara satılıyor. Herkes birbirinin versiyonunu satın alıyor; evren aynı kaldığı sürece sonuç da aynı kalıyor. Multiverse Blackmarket bu döngüyü kırmak için var. Burada gördükleriniz diğer gerçekliklerin fazlalıkları, arızaları ya da lüks sapmaları. Hoş geldiniz. Burada tanıdık hiçbir şey yok."
    }
  };

  const selectedManifesto = manifestoContent[language];

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNext = () => {
    if (isScrolling.current) return;
    isScrolling.current = true;
    setDirection(1);

    if (currentIndex === products.length - 1) {
      // Loop glitch
      setIsGlitching(true);
      setTimeout(() => {
        setCurrentIndex(0);
        setIsGlitching(false);
        isScrolling.current = false;
      }, 500);
    } else {
      setCurrentIndex(currentIndex + 1);
      setTimeout(() => {
        isScrolling.current = false;
      }, 600);
    }
  };

  const handlePrev = () => {
    if (isScrolling.current) return;
    isScrolling.current = true;
    setDirection(-1);

    if (currentIndex === 0) {
      setCurrentIndex(products.length - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
    setTimeout(() => {
      isScrolling.current = false;
    }, 600);
  };

  // Wheel event handler
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling.current) return;

      if (e.deltaY > 30) {
        handleNext();
      } else if (e.deltaY < -30) {
        handlePrev();
      }
    };

    const container = containerRef.current;
    // Only enable wheel navigation on desktop and when popup is closed
    if (container && !isMobile && !showPopup) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [currentIndex, isMobile, showPopup]);

  // Touch event handlers
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling.current) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY;

      if (diff > 50) {
        handleNext();
      } else if (diff < -50) {
        handlePrev();
      }
    };

    const container = containerRef.current;
    // Disable touch swipe navigation when popup or manifesto is open
    if (container && !isMobile && !showPopup && !showManifesto) {
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [currentIndex, isMobile, showPopup, showManifesto]);

  // Reset scroll indicator on product change
  useEffect(() => {
    if (isMobile) {
      setShowScrollIndicator(true);
      // Reset scroll position
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [currentIndex, isMobile]);

  return (
    <div 
      ref={containerRef}
      className="h-screen w-screen bg-white relative overflow-hidden"
      style={{ touchAction: 'none' }}
    >
      {/* Entry Verification Popup */}
      <EntryVerificationPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />

      {/* Premium Noise Texture Background - Static for performance */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.04
        }}
      />

      {/* [A] HEADER - Floating Overlay */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed top-0 left-0 right-0 z-[250]"
        style={{
          backgroundColor: showVideo ? 'transparent' : 'rgba(255, 255, 255, 0.95)',
          borderBottom: showVideo ? 'none' : '1px solid rgba(0,0,0,0.05)',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      >
        <div className="max-w-full mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
          {/* Logo */}
          <div 
            style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontWeight: 200,
              fontSize: isMobile ? '12px' : '16px',
              letterSpacing: '0.06em',
              color: showVideo ? '#fff' : '#000'
            }}
          >
            MULTIVERSE BLACKMARKET
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-3">
            {/* MANIFESTO button - Desktop and Mobile */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="border px-3 py-1 rounded-full transition-all duration-200"
              style={{ 
                fontFamily: 'Inter, sans-serif', 
                fontWeight: 600,
                fontSize: isMobile ? '10px' : '12px',
                letterSpacing: '0.03em',
                borderColor: showVideo ? '#fff' : '#000',
                backgroundColor: showVideo ? 'transparent' : 'transparent',
                color: showVideo ? '#fff' : '#000'
              }}
              onMouseEnter={(e) => {
                if (showVideo) {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.color = '#000';
                } else {
                  e.currentTarget.style.backgroundColor = '#000';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = showVideo ? '#fff' : '#000';
              }}
              onClick={() => setShowManifesto(true)}
            >
              MANIFESTO
            </motion.button>

            {/* BACK button */}
            <motion.button 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="group relative" 
              onClick={onBack}
              style={{ 
                fontFamily: 'Inter, sans-serif', 
                fontSize: isMobile ? '11px' : '13px',
                fontWeight: 500,
                color: showVideo ? '#fff' : '#000'
              }}
            >
              BACK
              <div 
                className="absolute bottom-0 left-0 w-0 h-[1px] group-hover:w-full transition-all duration-200"
                style={{
                  backgroundColor: showVideo ? '#fff' : '#000'
                }}
              />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Logo - Floating Element (Desktop only) */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="fixed left-6 z-[250]"
          style={{
            top: '88px',
            width: '120px'
          }}
        >
          <img 
            src={logoImage} 
            alt="Logo" 
            className="w-full h-auto"
            style={{
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))'
            }}
          />
        </motion.div>
      )}

      {/* LEFT PANEL - Floating Overlay (Desktop only) */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="fixed left-6 z-40 bg-white/95 rounded-lg p-4 shadow-lg"
          style={{
            top: '220px',
            width: '200px',
            border: '1px solid rgba(0,0,0,0.05)',
            transform: 'translateZ(0)'
          }}
        >
          <div 
            className="mb-3"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: '#000'
            }}
          >
            SESSION LOG
          </div>
          <div 
            className="space-y-1"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              color: '#666',
              lineHeight: '1.6'
            }}
          >
            <div>{'>'} handshake with universe</div>
            <div className="text-red-600">{'>'} connection: unstable</div>
            <div>{'>'} {products.length} listings detected</div>
          </div>
        </motion.div>
      )}

      {/* RIGHT PANEL - Floating Overlay (Desktop only) */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="fixed right-6 top-24 z-40 space-y-4"
          style={{
            width: '260px'
          }}
        >
          {/* Product Info Panel */}
          <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 shadow-lg" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {/* Title */}
                <h3 
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    letterSpacing: '0.01em',
                    color: '#000',
                    lineHeight: '1.3'
                  }}
                >
                  {currentProduct.title}
                </h3>

                {/* Metadata */}
                <div 
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    color: '#666',
                    lineHeight: '1.6'
                  }}
                >
                  Origin: {currentProduct.origin}
                  <br />
                  Type: {currentProduct.type}
                  <br />
                  Status: {currentProduct.status}
                </div>

                {/* Description */}
                <div 
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    color: '#999',
                    lineHeight: '1.5',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(0,0,0,0.05)'
                  }}
                >
                  {currentProduct.description}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Listing Intel Panel */}
          <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 shadow-lg" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
            <div 
              className="mb-4"
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: '#000'
              }}
            >
              LISTING INTEL
            </div>

            <div className="space-y-4">
              {/* Risk Level */}
              <div>
                <div className="text-xs mb-2" style={{ fontFamily: 'Inter, sans-serif', color: '#666', fontSize: '10px' }}>
                  Risk Level
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((level) => (
                    <motion.div
                      key={`${currentIndex}-${level}`}
                      initial={{ width: 0 }}
                      animate={{ width: '33.33%' }}
                      transition={{ duration: 0.6, delay: 0.1 + level * 0.1 }}
                      className="h-2 rounded-full"
                      style={{
                        background: level <= currentProduct.risk ? '#dc2626' : '#e5e7eb'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Value Index */}
              <div>
                <div className="text-xs mb-2" style={{ fontFamily: 'Inter, sans-serif', color: '#666', fontSize: '10px' }}>
                  Value Index
                </div>
                <div 
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#000'
                  }}
                >
                  {currentProduct.value}
                </div>
              </div>

              {/* Trace Status */}
              <div>
                <div className="text-xs mb-2" style={{ fontFamily: 'Inter, sans-serif', color: '#666', fontSize: '10px' }}>
                  Trace Status
                </div>
                <div 
                  className="px-2.5 py-1 rounded inline-block"
                  style={{
                    background: 
                      currentProduct.trace === 'CLEAN' ? 'rgba(34,197,94,0.1)' :
                      currentProduct.trace === 'FLAGGED' ? 'rgba(234,179,8,0.1)' :
                      'rgba(239,68,68,0.1)',
                    color:
                      currentProduct.trace === 'CLEAN' ? '#22c55e' :
                      currentProduct.trace === 'FLAGGED' ? '#eab308' :
                      '#ef4444',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '10px',
                    fontWeight: 600
                  }}
                >
                  {currentProduct.trace}
                </div>
                
                {/* BUY Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-3 px-4 py-2.5 rounded transition-all duration-200"
                  style={{
                    border: '1.5px solid #000',
                    background: 'transparent',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    color: '#000',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#000';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#000';
                  }}
                >
                  SOLD OUT
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* FULL SCREEN PRODUCT CARD */}
      <div className="h-full w-full flex items-center justify-center pt-20 md:pt-16 pb-12">
        <div className="h-full w-full max-w-2xl px-4 md:px-8 flex flex-col relative">
          {/* Desktop Navigation Buttons - Right side of image */}
          {!isMobile && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                style={{ border: '1px solid rgba(0,0,0,0.05)' }}
              >
                <ChevronUp className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                style={{ border: '1px solid rgba(0,0,0,0.05)' }}
              >
                <ChevronDown className="w-5 h-5" />
              </motion.button>
            </div>
          )}

          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-sm rounded-t-xl" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-2 md:gap-3">
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: isMobile ? '12px' : '14px', fontWeight: 500, color: '#000' }}>
                {currentProduct.seller} — {currentProduct.universe}
              </div>
              {/* WATCH ADS button - only for Silence Can */}
              {currentIndex === 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-red-600 text-red-600 px-2.5 md:px-3 py-1 rounded-full transition-all duration-200 hover:bg-red-600 hover:text-white"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: isMobile ? '9px' : '10px',
                    fontWeight: 700,
                    letterSpacing: '0.05em'
                  }}
                  onClick={handleWatchAds}
                >
                  WATCH ADS
                </motion.button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#999' }}>
                LIVE FEED
              </span>
            </div>
          </div>

          {/* Product Card - Full Height */}
          <div className="flex-1 relative overflow-hidden bg-white rounded-b-xl shadow-2xl">
            {/* Mobile scroll wrapper */}
            {isMobile ? (
              <div 
                ref={scrollContainerRef}
                className="absolute inset-0 overflow-y-auto"
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain'
                }}
                onScroll={() => {
                  const el = scrollContainerRef.current;
                  if (!el) return;
                  const scrollTop = el.scrollTop;
                  const scrollHeight = el.scrollHeight;
                  const clientHeight = el.clientHeight;
                  const isNearBottom = scrollTop + clientHeight >= scrollHeight - 20;
                  setShowScrollIndicator(!isNearBottom);
                }}
              >
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    initial={{ 
                      y: direction > 0 ? '100%' : '-100%',
                      opacity: 0 
                    }}
                    animate={{ 
                      y: 0,
                      opacity: isGlitching ? 0.85 : 1,
                      x: isGlitching ? [0, 2, -2, 0] : 0
                    }}
                    exit={{ 
                      y: direction > 0 ? '-100%' : '100%',
                      opacity: 0 
                    }}
                    transition={{ 
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                    style={{
                      willChange: 'transform, opacity',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
                    className="min-h-full flex flex-col"
                  >
                    {/* Product Image - Fixed aspect */}
                    <div className="relative bg-gray-50" style={{ minHeight: '50vh' }}>
                      <ImageWithFallback
                        src={currentProduct.image}
                        alt={currentProduct.title}
                        className="w-full h-full object-contain"
                        style={{ minHeight: '50vh' }}
                      />
                    </div>

                    {/* Product Info - Extended with padding bottom */}
                    <div className="p-6 space-y-3 bg-white pb-24">
                      {/* Title */}
                      <h2 
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '18px',
                          fontWeight: 600,
                          letterSpacing: '0.01em',
                          color: '#000',
                          lineHeight: '1.2'
                        }}
                      >
                        {currentProduct.title}
                      </h2>

                      {/* Metadata */}
                      <div 
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '11px',
                          color: '#666',
                          lineHeight: '1.6'
                        }}
                      >
                        Origin: {currentProduct.origin}
                        <br />
                        Type: {currentProduct.type}
                        <br />
                        Status: {currentProduct.status}
                      </div>

                      {/* Description */}
                      <div 
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '11px',
                          color: '#999',
                          lineHeight: '1.5'
                        }}
                      >
                        {currentProduct.description}
                      </div>

                      {/* Mobile Intel */}
                      <div className="space-y-3 pt-3 border-t border-gray-100 mt-4">
                        {/* Risk & Trace */}
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div style={{ fontSize: '9px', color: '#999', marginBottom: '4px' }}>Risk</div>
                            <div className="flex gap-1">
                              {[1, 2, 3].map((level) => (
                                <div
                                  key={level}
                                  className="h-1.5 flex-1 rounded-full"
                                  style={{
                                    background: level <= currentProduct.risk ? '#dc2626' : '#e5e7eb'
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div style={{ fontSize: '9px', color: '#999', marginBottom: '4px' }}>Trace</div>
                            <div 
                              className="px-2 py-0.5 rounded inline-block text-center w-full"
                              style={{
                                background: 
                                  currentProduct.trace === 'CLEAN' ? 'rgba(34,197,94,0.1)' :
                                  currentProduct.trace === 'FLAGGED' ? 'rgba(234,179,8,0.1)' :
                                  'rgba(239,68,68,0.1)',
                                color:
                                  currentProduct.trace === 'CLEAN' ? '#22c55e' :
                                  currentProduct.trace === 'FLAGGED' ? '#eab308' :
                                  '#ef4444',
                                fontSize: '9px',
                                fontWeight: 600
                              }}
                            >
                              {currentProduct.trace}
                            </div>
                          </div>
                        </div>

                        {/* Value Index */}
                        <div>
                          <div style={{ fontSize: '9px', color: '#999', marginBottom: '4px' }}>Value Index</div>
                          <div 
                            style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '16px',
                              fontWeight: 600,
                              color: '#000'
                            }}
                          >
                            {currentProduct.value}
                          </div>
                        </div>

                        {/* BUY Button */}
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          className="w-full px-4 py-2.5 rounded transition-all duration-200"
                          style={{
                            border: '1.5px solid #000',
                            background: '#000',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '13px',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            color: '#fff',
                            cursor: 'pointer'
                          }}
                        >
                          SOLD OUT
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  initial={{ 
                    y: '100%',
                    opacity: 0.8
                  }}
                  animate={{ 
                    y: 0,
                    opacity: isGlitching ? 0.85 : 1,
                    x: isGlitching ? [0, 2, -2, 0] : 0
                  }}
                  exit={{ 
                    y: '-20%',
                    opacity: 0,
                    scale: 0.95
                  }}
                  transition={{ 
                    duration: 0.4,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                  style={{
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                  className="absolute inset-0 flex flex-col"
                >
                  {/* Product Image - Full Height */}
                  <div className="flex-1 relative bg-gray-50">
                    <ImageWithFallback
                      src={currentProduct.image}
                      alt={currentProduct.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Bottom Gradient Blur Overlay - Fixed to visible card area (Mobile only) */}
            {isMobile && (
              <AnimatePresence>
                {showScrollIndicator && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-0 right-0 pointer-events-none"
                    style={{
                      height: '80px',
                      zIndex: 30
                    }}
                  >
                    {/* White gradient overlay */}
                    <div 
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 60%, rgba(255,255,255,0.95) 100%)'
                      }}
                    />
                    
                    {/* Backdrop blur with gradient intensity */}
                    <div 
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backdropFilter: 'blur(0px)',
                        WebkitBackdropFilter: 'blur(0px)',
                        maskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)'
                      }}
                    >
                      <div style={{
                        width: '100%',
                        height: '100%',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)'
                      }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Scroll Indicator - Bouncing Arrow (Mobile only) */}
            {isMobile && (
              <AnimatePresence>
                {showScrollIndicator && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ 
                      y: [0, 6, 0],
                      opacity: [0.4, 0.7, 0.4]
                    }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      y: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      },
                      opacity: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                    className="absolute left-1/2 pointer-events-none"
                    style={{
                      bottom: '24px',
                      transform: 'translateX(-50%)',
                      zIndex: 40
                    }}
                  >
                    <ChevronDown 
                      className="w-5 h-5" 
                      style={{ 
                        color: '#666',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                      }} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Hints - Floating (Mobile only) */}
      {isMobile && (
        <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
            style={{ border: '1px solid rgba(0,0,0,0.05)' }}
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
            style={{ border: '1px solid rgba(0,0,0,0.05)' }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        </div>
      )}

      {/* [C] TICKER BAR - Bottom */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 overflow-hidden"
        style={{
          background: '#F5F5F5',
          borderTop: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="whitespace-nowrap py-2"
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: isMobile ? '9px' : '11px',
            color: '#666'
          }}
        >
          {[...tickerMessages, ...tickerMessages].map((msg, i) => (
            <span key={i} className="mx-8">{msg}</span>
          ))}
        </motion.div>
      </div>

      {/* Glitch Overlay */}
      <AnimatePresence>
        {isGlitching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-40"
            style={{
              background: 'linear-gradient(90deg, rgba(255,0,0,0.03), rgba(0,255,0,0.03), rgba(0,0,255,0.03))',
              mixBlendMode: 'screen'
            }}
          />
        )}
      </AnimatePresence>

      {/* Manifesto Popup - Glassmorphism */}
      <AnimatePresence>
        {showManifesto && (
          <>
            {/* Backdrop - %10 opak blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] flex items-center justify-center px-6 pointer-events-auto"
              onClick={() => setShowManifesto(false)}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.10)',
                backdropFilter: 'blur(8px)',
                cursor: 'default',
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
                  cursor: 'default',
                }}
              >
                {/* Close X button */}
                <button
                  onClick={() => setShowManifesto(false)}
                  className="absolute top-6 right-6 text-white hover:opacity-70 transition-opacity text-[24px] cursor-pointer"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 300,
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>

                {/* Language Selector - Top Left */}
                <div className="absolute top-6 left-6 flex items-center gap-2" style={{ pointerEvents: 'auto' }}>
                  <button
                    onClick={() => setLanguage('TR')}
                    className={`text-[14px] transition-opacity cursor-pointer ${language === 'TR' ? 'text-white opacity-100' : 'text-white/50 hover:opacity-70'}`}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      pointerEvents: 'auto',
                      cursor: 'pointer',
                    }}
                  >
                    TR
                  </button>
                  <span className="text-white/50 text-[14px]">—</span>
                  <button
                    onClick={() => setLanguage('EN')}
                    className={`text-[14px] transition-opacity cursor-pointer ${language === 'EN' ? 'text-white opacity-100' : 'text-white/50 hover:opacity-70'}`}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      pointerEvents: 'auto',
                      cursor: 'pointer',
                    }}
                  >
                    EN
                  </button>
                </div>

                {/* Small MANIFESTO label */}
                <div
                  className="text-[10px] md:text-[12px] mb-2 text-white tracking-widest"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    letterSpacing: '0.15em'
                  }}
                >
                  MANIFESTO
                </div>

                <h2
                  className="text-[24px] md:text-[32px] mb-6 tracking-tight text-white"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 200,
                    letterSpacing: '-0.02em'
                  }}
                >
                  {selectedManifesto.title}
                </h2>

                <p
                  className="text-[14px] md:text-[16px] leading-relaxed text-white/90"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 300,
                    lineHeight: '1.7'
                  }}
                >
                  {selectedManifesto.text}
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 5 Minutes Silence Video Player - Fullscreen */}
      <AnimatePresence>
        {showVideo && (
          <div
            className="fixed inset-0 w-full h-full bg-black z-[200]"
          >
            {/* Video Container - Tam ekran */}
            <div className="relative w-full h-full flex items-center justify-center">
              
              {/* Video - İlk karede durur, power'a basınca oynar */}
              <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                preload="auto"
                poster={posterImage}
              >
                <source src="https://github.com/ardawncha/5min/raw/29b6967bdca8607a7fd85e91af6586e05d1c2dc3/20251125_1305_01kax68djqekta0xjmctdnrvhm.mp4" type="video/mp4" />
              </video>

              {/* CLOSE ADS Button - Alt ortada */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCloseVideo}
                  className="px-8 py-3 rounded-full bg-white/10 backdrop-blur-md border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300"
                  style={{
                    fontFamily: 'Arial Black, sans-serif',
                    fontWeight: 900,
                    fontSize: '16px',
                    letterSpacing: '0.05em'
                  }}
                >
                  CLOSE ADS
                </motion.button>
              </motion.div>

              {/* Power Button - Video oynamadığında göster */}
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="absolute bottom-28 left-1/2 -translate-x-1/2 z-50"
                >
                  <button
                    onClick={handlePlayVideo}
                    className="group relative flex flex-col items-center gap-4"
                  >
                    {/* Power Button */}
                    <div className="relative">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-[#8B7355] rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                      
                      {/* Button itself */}
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#8B7355] border-4 border-white shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 group-hover:bg-[#9d8464]"
                      >
                        <Power className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={3} />
                      </motion.div>
                    </div>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}