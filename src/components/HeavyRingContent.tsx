import { motion, useMotionValue, useTransform, useInView } from 'motion/react';
import { useState, useRef, useEffect, memo, useMemo } from 'react';
import ringImage from '../assets/heavy-ring/ringImage.png';
import weightsMaskImage from '../assets/heavy-ring/weightsMaskImage.png';
import backgroundWithWeights from '../assets/heavy-ring/backgroundWithWeights.png';
import backgroundWithWeightsMobile from '../assets/heavy-ring/backgroundWithWeightsMobile.png';
import chainLinkHorizontal from '../assets/heavy-ring/chainLinkHorizontal.png';
import chainLinkVertical from '../assets/heavy-ring/chainLinkVertical.png';
import slide2Image from '../assets/heavy-ring/slide2Image.png';
import carouselImage1 from '../assets/heavy-ring/carouselImage1.png';
import carouselImage2 from '../assets/heavy-ring/carouselImage2.png';
import logoImage from '../assets/heavy-ring/logoImage.png';
import newBackgroundDesktop from '../assets/heavy-ring/newBackgroundDesktop.png';
import newMaskDesktop from '../assets/heavy-ring/newMaskDesktop.png';

interface HeavyRingContentProps {
  onBack: () => void;
}

// Helper function to create chain links between two points - Memoized for performance
const ChainLinks = memo(({ x1, y1, x2, y2, isMobile }: { x1: number; y1: number; x2: number; y2: number; isMobile: boolean }) => {
  const links = useMemo(() => {
    // Round positions to reduce unnecessary re-renders on mobile - more aggressive rounding
    const roundedX1 = isMobile ? Math.round(x1 / 8) * 8 : x1;
    const roundedY1 = isMobile ? Math.round(y1 / 8) * 8 : y1;
    const roundedX2 = isMobile ? Math.round(x2 / 8) * 8 : x2;
    const roundedY2 = isMobile ? Math.round(y2 / 8) * 8 : y2;
    
    const dx = roundedX2 - roundedX1;
    const dy = roundedY2 - roundedY1;
    const straightDistance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    
    // Define minimum and maximum chain lengths
    const minChainDistance = 80;
    const maxChainDistance = 200;
    const baseChainLength = isMobile ? 180 : 450;
    
    // Calculate tension ratio
    const tensionRatio = Math.min(Math.max((straightDistance - minChainDistance) / (maxChainDistance - minChainDistance), 0), 1);
    
    // Dynamic sag based on tension
    const maxSagAmount = isMobile ? 25 : 80;
    const currentSagAmount = maxSagAmount * (1 - tensionRatio);
    
    // Chain length available for rendering
    const effectiveChainLength = baseChainLength - (baseChainLength - straightDistance) * tensionRatio;
    
    // Link dimensions - restore original link count
    const linkWidth = isMobile ? 14 : 20;
    const linkHeight = isMobile ? 21 : 30;
    const overlapAmount = linkHeight / 4;
    const linkSpacing = linkHeight - overlapAmount; // Same for mobile and desktop
    const numLinks = Math.floor(effectiveChainLength / linkSpacing);
    
    const linksArray = [];
    
    // Create catenary curve
    for (let i = 0; i < numLinks; i++) {
      const t = i / (numLinks - 1 || 1);
      
      // Linear interpolation for base position
      const baseX = roundedX1 + dx * t;
      const baseY = roundedY1 + dy * t;
      
      // Add parabolic sag
      const sag = currentSagAmount * Math.sin(t * Math.PI);
      
      // Calculate perpendicular direction for sag
      const perpAngle = angle + Math.PI / 2;
      const px = baseX + Math.cos(perpAngle) * sag;
      const py = baseY + Math.sin(perpAngle) * sag;
      
      // Calculate local tangent angle
      const tangentSlope = currentSagAmount > 0 ? Math.cos(t * Math.PI) * Math.PI : 0;
      const localTangentAngle = angle + (currentSagAmount > 0 ? Math.atan(tangentSlope * currentSagAmount / straightDistance) : 0);
      
      // Alternate between orientations
      const isAlongChain = i % 2 === 0;
      
      if (isAlongChain) {
        const rotationDeg = (localTangentAngle * 180) / Math.PI;
        linksArray.push(
          <image
            key={i}
            href={chainLinkHorizontal}
            x={px - linkWidth / 2}
            y={py - linkHeight / 2}
            width={linkWidth}
            height={linkHeight}
            transform={`rotate(${rotationDeg} ${px} ${py})`}
            style={{ opacity: 0.95 }}
          />
        );
      } else {
        const rotationDeg = (localTangentAngle * 180) / Math.PI + 180;
        linksArray.push(
          <image
            key={i}
            href={chainLinkVertical}
            x={px - linkWidth / 2}
            y={py - linkHeight / 2}
            width={linkWidth}
            height={linkHeight}
            transform={`rotate(${rotationDeg} ${px} ${py})`}
            style={{ opacity: 0.95 }}
          />
        );
      }
    }
    
    return linksArray;
  }, [x1, y1, x2, y2, isMobile]);
  
  return <>{links}</>;
});

export default function HeavyRingContent({ onBack }: HeavyRingContentProps) {
  const [showManifesto, setShowManifesto] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showCarousel, setShowCarousel] = useState(false);
  const [showDetails, setShowDetails] = useState(false); // Yeni state mobil için
  const [selectedImage, setSelectedImage] = useState<number | null>(null); // Lightbox için
  const [isMobile, setIsMobile] = useState(false);
  const [backgroundScale, setBackgroundScale] = useState(1);
  const [maxTension, setMaxTension] = useState(false);
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false); // Track dragging state for animation
  const [touchStartY, setTouchStartY] = useState<number | null>(null); // Touch tracking için
  const [centerX, setCenterX] = useState(0); // Dynamic center X
  const [centerY, setCenterY] = useState(0); // Dynamic center Y
  
  const slide1Ref = useRef(null);
  const slide2Ref = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef(null);
  const maxWidthContainerRef = useRef<HTMLDivElement>(null); // Max-width container ref
  
  // Ring position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Carousel images
  const carouselImages = [carouselImage1, carouselImage2];
  
  // Navigate carousel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };
  
  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Calculate background scale based on viewport size
  // NEW IMAGE: 4712x1325px (reference size where anchor positions are defined)
  useEffect(() => {
    const updateScale = () => {
      if (isMobile) {
        setBackgroundScale(1);
        return;
      }
      
      const containerHeight = window.innerHeight;
      const referenceHeight = 1325; // New image height
      
      // Image always scales to fit viewport height (object-cover)
      const scale = containerHeight / referenceHeight;
      
      setBackgroundScale(scale);
    };
    
    // Initial update with delay to ensure container is rendered
    setTimeout(updateScale, 100);
    
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [isMobile]);
  
  // Calculate center position based on max-width container
  // This fixes ultra-wide screen issues (5000x1440, etc.)
  useEffect(() => {
    const updateCenter = () => {
      if (maxWidthContainerRef.current) {
        const rect = maxWidthContainerRef.current.getBoundingClientRect();
        // Container merkezini hesapla (container'ın sol kenarından container genişliğinin yarısı)
        const containerCenterX = rect.left + rect.width / 2;
        const containerCenterY = window.innerHeight / 2;
        
        setCenterX(containerCenterX);
        setCenterY(containerCenterY);
      } else {
        // Fallback: viewport merkezi
        setCenterX(window.innerWidth / 2);
        setCenterY(window.innerHeight / 2);
      }
    };
    
    // İlk render'da ve resize'da güncelle
    updateCenter();
    window.addEventListener('resize', updateCenter);
    
    // Bir kere daha güncelle (DOM fully loaded olduktan sonra)
    setTimeout(updateCenter, 100);
    
    return () => window.removeEventListener('resize', updateCenter);
  }, []);
  
  // Drag limit
  const dragLimit = 70; // Maximum distance from center (halved again)
  
  // Weight anchor positions for NEW IMAGE (4712x1325px reference)
  // Estimated positions from mask - will be adjusted based on feedback
  const baseAnchors = {
    north: { x: 0, y: -260 },     // Top center hole
    east: { x: 310, y: 40 },      // Right hole
    south: { x: 0, y: 320 },      // Bottom center hole
    west: { x: -310, y: 40 }      // Left hole
  };
  
  // Scale anchors based on background scale (height-based, no crop offset needed)
  const anchors = useMemo(() => {
    if (isMobile) {
      return {
        north: { x: 0, y: -119.7 },
        east: { x: 141.645, y: 19.95 },
        south: { x: 0, y: 146.3 },
        west: { x: -141.645, y: 19.95 }
      };
    }
    
    // Simply scale the base anchors - no crop adjustment needed with height-based scaling
    return {
      north: { x: baseAnchors.north.x * backgroundScale, y: baseAnchors.north.y * backgroundScale },
      east: { x: baseAnchors.east.x * backgroundScale, y: baseAnchors.east.y * backgroundScale },
      south: { x: baseAnchors.south.x * backgroundScale, y: baseAnchors.south.y * backgroundScale },
      west: { x: baseAnchors.west.x * backgroundScale, y: baseAnchors.west.y * backgroundScale }
    };
  }, [backgroundScale, isMobile]);
  
  // Ring connection holes offset from ring center
  // Mobile ring holes scaled proportionally with ring size (0.665x for mobile)
  const ringHoles = isMobile ? {
    north: { x: 0, y: -58 },
    east: { x: 58, y: 0 },
    south: { x: 0, y: 58 },
    west: { x: -58, y: 0 }
  } : {
    north: { x: 0, y: -88 },
    east: { x: 88, y: 0 },
    south: { x: 0, y: 88 },
    west: { x: -88, y: 0 }
  };

  // Check if slides are in view
  const isSlide1InView = useInView(slide1Ref, { amount: 0.65, once: false });
  const isSlide2InView = useInView(slide2Ref, { amount: 0.65, once: false });

  // Check tension on drag and update ring position for chains - Throttled for performance
  useEffect(() => {
    let rafId: number | null = null;
    let lastUpdate = 0;
    const throttleDelay = isMobile ? 300 : 16; // 300ms mobile (daha agresif), ~60fps desktop
    
    const updateRingPosition = (latestX: number, latestY: number) => {
      const now = performance.now();
      
      // Cancel previous frame if still pending
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      // For mobile, only update if enough time has passed
      if (isMobile && now - lastUpdate < throttleDelay) {
        return;
      }
      
      rafId = requestAnimationFrame(() => {
        if (now - lastUpdate >= throttleDelay) {
          const distance = Math.sqrt(latestX * latestX + latestY * latestY);
          setMaxTension(distance >= dragLimit - 5);
          setRingPos({ x: latestX, y: latestY });
          lastUpdate = now;
        }
      });
    };

    const unsubscribeX = x.on('change', (latestX) => {
      const latestY = y.get();
      updateRingPosition(latestX, latestY);
    });
    
    const unsubscribeY = y.on('change', (latestY) => {
      const latestX = x.get();
      updateRingPosition(latestX, latestY);
    });

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      unsubscribeX();
      unsubscribeY();
    };
  }, [x, y, isMobile, dragLimit]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white h-screen overflow-y-scroll snap-y snap-mandatory"
      style={{
        scrollSnapType: 'y mandatory',
        WebkitOverflowScrolling: 'touch', // iOS için smooth scrolling
        scrollBehavior: 'smooth'
      }}
      ref={containerRef}
    >
      {/* BACK button - Fixed Top Right */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={onBack}
        className="fixed top-8 right-8 z-50 hover:opacity-50 transition-opacity duration-200 text-black"
        style={{ 
          fontFamily: 'BrutalistFont, Arial Black, Arial, Helvetica, sans-serif', 
          fontWeight: 900 
        }}
      >
        <span className="text-[24px]">BACK →</span>
      </motion.button>

      {/* Logo - Fixed Top Left */}
      <motion.img
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        src={logoImage}
        alt="Heavy Ring Logo"
        className="fixed top-6 left-6 z-40 w-20 h-20 cursor-pointer select-none"
        loading="eager"
        fetchpriority="high"
        onClick={onBack}
      />

      {/* Slide 1: Chain Rig Interactive */}
      <div
        ref={slide1Ref}
        className="w-full h-screen snap-start snap-always relative"
      >
        {/* Max-width wrapper for this slide */}
        <div className="max-w-[1920px] mx-auto relative h-full" ref={maxWidthContainerRef}>
          {/* Background with weights and shadows (fixed) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Mobile background image */}
            <img 
              src={backgroundWithWeightsMobile} 
              alt="Background with weights" 
              className="absolute inset-0 w-full h-full object-cover md:hidden"
              loading="eager"
              fetchpriority="high"
            />
            {/* Desktop: NEW wide background - alt üst snapli */}
            <img 
              src={newBackgroundDesktop} 
              alt="Background with weights" 
              className="absolute inset-0 w-full h-full object-cover hidden md:block"
              loading="eager"
              fetchpriority="high"
              ref={backgroundRef}
            />
            {/* Desktop: NEW wide mask - alt üst snapli */}
            <img 
              src={newMaskDesktop} 
              alt="Weights mask" 
              className="absolute inset-0 w-full h-full object-cover hidden md:block"
              loading="eager"
              fetchpriority="high"
            />
          </div>

          {/* Dynamic chains - rendered as SVG lines */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none" 
            style={{ 
              zIndex: 10,
              // GPU Acceleration
              willChange: isDragging && isMobile ? 'opacity, filter' : 'auto',
              transform: 'translate3d(0, 0, 0)',
              contain: 'layout style paint',
              // Performance optimizations for mobile during drag
              opacity: isDragging && isMobile ? 0.3 : 1,
              filter: isDragging && isMobile ? 'blur(2px)' : 'none',
              transition: 'opacity 0.2s ease-out, filter 0.2s ease-out'
            }}
          >
            {/* Shadow filter definition - desktop only */}
            {!isMobile && (
              <defs>
                <filter id="chainShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                </filter>
              </defs>
            )}
            
            <g 
              filter={isMobile ? undefined : "url(#chainShadow)"}
              style={{
                // Additional GPU acceleration for chain group
                willChange: isDragging && isMobile ? 'transform' : 'auto',
                transform: 'translate3d(0, 0, 0)'
              }}
            >
              {/* North chain */}
              <ChainLinks
                x1={centerX + anchors.north.x}
                y1={centerY + anchors.north.y}
                x2={centerX + ringPos.x + ringHoles.north.x}
                y2={centerY + ringPos.y + ringHoles.north.y}
                isMobile={isMobile}
              />
              
              {/* East chain */}
              <ChainLinks
                x1={centerX + anchors.east.x}
                y1={centerY + anchors.east.y}
                x2={centerX + ringPos.x + ringHoles.east.x}
                y2={centerY + ringPos.y + ringHoles.east.y}
                isMobile={isMobile}
              />
              
              {/* South chain */}
              <ChainLinks
                x1={centerX + anchors.south.x}
                y1={centerY + anchors.south.y}
                x2={centerX + ringPos.x + ringHoles.south.x}
                y2={centerY + ringPos.y + ringHoles.south.y}
                isMobile={isMobile}
              />
              
              {/* West chain */}
              <ChainLinks
                x1={centerX + anchors.west.x}
                y1={centerY + anchors.west.y}
                x2={centerX + ringPos.x + ringHoles.west.x}
                y2={centerY + ringPos.y + ringHoles.west.y}
                isMobile={isMobile}
              />
            </g>
          </svg>

          {/* Draggable ring */}
          <motion.div
            drag
            dragConstraints={{
              left: -dragLimit,
              right: dragLimit,
              top: -dragLimit,
              bottom: dragLimit
            }}
            dragElastic={0}
            dragMomentum={false}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 20, power: 0 }}
            style={{ 
              x, 
              y,
              position: 'absolute',
              left: '50%',
              top: '50%',
              translateX: '-50%',
              translateY: '-50%',
              zIndex: 20,
              willChange: 'transform'
            }}
            className="cursor-grab active:cursor-grabbing"
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => {
              setIsDragging(false);
              // Spring back to center only on mobile
              if (isMobile) {
                x.set(0);
                y.set(0);
              }
            }}
          >
            {/* Ring image with pulsing animation */}
            <motion.img 
              src={ringImage} 
              alt="Heavy Ring" 
              className="w-[133px] h-[133px] md:w-[200px] md:h-[200px] object-contain pointer-events-none select-none"
              loading="eager"
              fetchpriority="high"
              draggable={false}
              animate={{
                opacity: isMobile ? 1 : (isDragging ? 1 : [0.4, 1, 0.4])
              }}
              transition={{
                opacity: {
                  duration: isMobile ? 0 : (isDragging ? 0 : 2),
                  repeat: isMobile ? 0 : (isDragging ? 0 : Infinity),
                  ease: "easeInOut"
                }
              }}
              style={{ 
                transform: 'translate3d(0,0,0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
            />
            
            {/* Center text overlay - pulsing animation - desktop only */}
            {!isMobile && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                animate={{
                  opacity: isDragging ? 0 : [0.4, 1, 0.4]
                }}
                transition={{
                  opacity: {
                    duration: isDragging ? 0 : 2,
                    repeat: isDragging ? 0 : Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <span 
                  className="text-black text-center whitespace-nowrap"
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontStyle: 'italic',
                    fontWeight: 300,
                    fontSize: '11px',
                    letterSpacing: '0.3px'
                  }}
                >
                  drag the ring
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* UI Text - Top Left */}
          <div className="absolute top-8 left-8 z-50 space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-black mt-[140px] md:mt-[180px]"
              style={{
                fontFamily: 'Arial Black, sans-serif',
                fontWeight: 900,
                fontSize: '16px',
                lineHeight: '1.2'
              }}
            >
              DRAG THE RING
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-black"
              style={{
                fontFamily: 'Arial Black, sans-serif',
                fontWeight: 900,
                fontSize: '16px',
                lineHeight: '1.2'
              }}
            >
              FEEL THE WEIGHT
            </motion.div>
          </div>

          {/* Scroll indicator - Bottom Center */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12 L12 19 L19 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slide 2: Image Content */}
      <div
        ref={slide2Ref}
        className="w-full h-screen snap-start snap-always flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 relative"
        onWheel={(e) => {
          if (e.deltaY > 0 && !showCarousel) {
            setShowCarousel(true);
          }
        }}
        onTouchStart={(e) => {
          setTouchStartY(e.touches[0].clientY);
        }}
        onTouchMove={(e) => {
          if (touchStartY !== null && !showCarousel) {
            const currentY = e.touches[0].clientY;
            const deltaY = touchStartY - currentY; // Ters çevirdik: yukarı kaydırma pozitif
            // Yukarı swipe (50px+) ile carousel aç
            if (deltaY > 50) {
              setShowCarousel(true);
              setTouchStartY(null); // Reset
            }
          }
        }}
        onTouchEnd={() => {
          setTouchStartY(null); // Reset touch tracking
        }}
      >
        <img 
          src={slide2Image} 
          alt="Heavy Ring Display" 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Scroll indicator - Top Center */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="rotate-180">
              <path d="M5 12 L12 19 L19 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>
        
        {/* Scroll indicator - Bottom Center */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12 L12 19 L19 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Carousel Modal */}
      {showCarousel && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center z-[60] bg-black/40 backdrop-blur-sm"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button - Top Right */}
            <button
              className="absolute top-8 right-8 text-white hover:opacity-70 transition-opacity z-[70]"
              onClick={() => setShowCarousel(false)}
              style={{
                fontFamily: 'Arial Black, sans-serif',
                fontWeight: 900,
                fontSize: '32px'
              }}
            >
              ×
            </button>

            {/* Scrollable Images Container */}
            <div className="relative w-full h-full flex items-start justify-center pt-12 md:pt-16 pb-52 md:pb-60">
              {/* Mobile: Vertical Layout */}
              <div className="flex flex-col md:hidden gap-6 px-3 w-full items-center">
                {carouselImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Ring ${idx + 1}`}
                    className="w-full max-w-sm object-contain cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedImage(idx)}
                  />
                ))}
              </div>
              
              {/* Desktop: Horizontal Scroll */}
              <div className="hidden md:flex gap-8 overflow-x-auto px-8 w-full justify-start items-start scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
                {carouselImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Ring ${idx + 1}`}
                    className="h-[52vh] object-contain flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedImage(idx)}
                  />
                ))}
              </div>
            </div>

            {/* Product Info - Bottom */}
            <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 text-center text-white max-w-2xl px-3 md:px-8">
              <h2 
                className="text-[28px] md:text-[48px] mb-1 md:mb-2"
                style={{
                  fontFamily: 'BrutalistFont, Arial Black, Arial, Helvetica, sans-serif',
                  fontWeight: 900
                }}
              >
                Heavy Ring
              </h2>
              <div 
                className="text-[20px] md:text-[32px] mb-2 md:mb-3"
                style={{
                  fontFamily: 'Arial Black, sans-serif',
                  fontWeight: 900
                }}
              >
                $500
              </div>
              
              {/* Desktop: Full description */}
              <p 
                className="hidden md:block text-[13px] md:text-[16px] mb-4 md:mb-5 leading-relaxed"
                style={{
                  fontFamily: 'Arial, sans-serif',
                  whiteSpace: 'pre-line'
                }}
              >
                This ring wasn't made to be light. it was made to refuse lightness.{'\n'}
                Four concrete 10G blocks add resistance to every movement of the ring.{'\n'}
                {'\n'}
                Details:{'\n'}
                – Micro concrete blocks{'\n'}
                – 925 sterling silver ring body{'\n'}
                – Stainless steel micro chains
              </p>
              
              {/* Mobile: DETAILS button */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="md:hidden bg-white text-black px-6 py-2 mb-3 hover:opacity-70 transition-opacity"
                style={{
                  fontFamily: 'Arial Black, sans-serif',
                  fontWeight: 900,
                  fontSize: '14px'
                }}
              >
                {showDetails ? 'HIDE DETAILS' : 'DETAILS'}
              </button>
              
              {/* Mobile: Expandable description */}
              {showDetails && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden text-[13px] mb-3 leading-relaxed"
                  style={{
                    fontFamily: 'Arial, sans-serif',
                    whiteSpace: 'pre-line'
                  }}
                >
                  This ring wasn't made to be light. it was made to refuse lightness.{'\n'}
                  Four concrete 10G blocks add resistance to every movement of the ring.{'\n'}
                  {'\n'}
                  Details:{'\n'}
                  – Micro concrete blocks{'\n'}
                  – 925 sterling silver ring body{'\n'}
                  – Stainless steel micro chains
                </motion.p>
              )}
              
              <button
                className="bg-black text-white px-8 md:px-12 py-3 md:py-4 hover:opacity-70 transition-opacity flex items-center justify-center mx-auto"
                style={{
                  fontFamily: 'Arial Black, sans-serif',
                  fontWeight: 900,
                  fontSize: '16px',
                  cursor: 'default'
                }}
              >
                SOLD OUT
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center z-[70] bg-black/40 backdrop-blur-sm"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button - Top Right */}
            <button
              className="absolute top-8 right-8 text-white hover:opacity-70 transition-opacity z-[80]"
              onClick={() => setSelectedImage(null)}
              style={{
                fontFamily: 'Arial Black, sans-serif',
                fontWeight: 900,
                fontSize: '32px'
              }}
            >
              ×
            </button>

            {/* Image Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={carouselImages[selectedImage]}
                alt={`Ring ${selectedImage + 1}`}
                className="h-[80vh] md:h-[90vh] object-contain flex-shrink-0"
              />
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}