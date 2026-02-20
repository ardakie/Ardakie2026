import { motion } from 'motion/react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import bearImage from '../assets/ozempic-bear/bearImage.png';
import maskImage from '../assets/ozempic-bear/maskImage.png';
import bearImageMobile from '../assets/ozempic-bear/bearImageMobile.png';
import maskImageMobile from '../assets/ozempic-bear/maskImageMobile.png';
import logoImage from '../assets/ozempic-bear/logoImage.png';
import inspectImage from '../assets/ozempic-bear/inspectImage.png';
import inspectSlide1 from '../assets/ozempic-bear/inspectSlide1.png';
import inspectSlide2 from '../assets/ozempic-bear/inspectSlide2.png';

interface OzempicBearContentProps {
  onBack: () => void;
}

export default function OzempicBearContent({ onBack }: OzempicBearContentProps) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [inspectMode, setInspectMode] = useState(false);
  const [magnifyPosition, setMagnifyPosition] = useState({ x: 0, y: 0, imgX: 0, imgY: 0, imgWidth: 0, imgLeft: 0, imgTop: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showManifesto, setShowManifesto] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'TR'>('EN');
  const heroRef = useRef<HTMLDivElement>(null);
  const inspectRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskDataRef = useRef<ImageData | null>(null);

  const inspectSlides = [inspectSlide1, inspectSlide2];

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load mask image and create canvas for pixel detection
  useEffect(() => {
    const currentMaskImage = isMobile ? maskImageMobile : maskImage;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentMaskImage;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        maskDataRef.current = ctx.getImageData(0, 0, img.width, img.height);
        canvasRef.current = canvas;
      }
    };
  }, [isMobile]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (heroRef.current && maskDataRef.current && canvasRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Convert mouse position to mask image coordinates
      const scaleX = canvasRef.current.width / rect.width;
      const scaleY = canvasRef.current.height / rect.height;
      const maskX = Math.floor(x * scaleX);
      const maskY = Math.floor(y * scaleY);
      
      // Check if coordinates are within bounds
      if (maskX >= 0 && maskX < canvasRef.current.width && 
          maskY >= 0 && maskY < canvasRef.current.height) {
        
        // Get pixel data (R, G, B, A)
        const pixelIndex = (maskY * canvasRef.current.width + maskX) * 4;
        const alpha = maskDataRef.current.data[pixelIndex + 3];
        
        // Show tooltip only if alpha > 0 (not transparent)
        if (alpha > 0) {
          setTooltipVisible(true);
          setTooltipPosition({ x, y });
        } else {
          setTooltipVisible(false);
        }
      } else {
        setTooltipVisible(false);
      }
    }
  }, []);

  const tooltipTexts = [
    "OZEMPIC BEAR",
  ];

  const [currentTooltip] = useState(tooltipTexts[0]);

  const handleMagnifierMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (inspectRef.current) {
      const container = inspectRef.current;
      const img = container.querySelector('img') as HTMLImageElement;
      
      if (img) {
        const containerRect = container.getBoundingClientRect();
        
        // Mouse position relative to container
        const mouseX = e.clientX - containerRect.left;
        const mouseY = e.clientY - containerRect.top;
        
        // Calculate the actual rendered image dimensions and position due to object-cover
        const containerAspect = containerRect.width / containerRect.height;
        const imgAspect = img.naturalWidth / img.naturalHeight;
        
        let renderedWidth, renderedHeight, offsetX, offsetY;
        
        if (containerAspect > imgAspect) {
          // Container is wider - image fills width
          renderedWidth = containerRect.width;
          renderedHeight = containerRect.width / imgAspect;
          offsetX = 0;
          offsetY = (containerRect.height - renderedHeight) / 2;
        } else {
          // Container is taller - image fills height
          renderedHeight = containerRect.height;
          renderedWidth = containerRect.height * imgAspect;
          offsetX = (containerRect.width - renderedWidth) / 2;
          offsetY = 0;
        }
        
        setMagnifyPosition({ 
          x: mouseX, 
          y: mouseY,
          imgX: mouseX - offsetX,
          imgY: mouseY - offsetY,
          imgWidth: renderedWidth,
          imgLeft: offsetX,
          imgTop: offsetY
        });
      }
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const endX = e.changedTouches[0].clientX;
    setTouchEndX(endX);
    
    if (touchStartX && endX) {
      const swipeDistance = touchStartX - endX;
      if (swipeDistance > 50 && currentSlideIndex < inspectSlides.length - 1) {
        setCurrentSlideIndex(currentSlideIndex + 1);
      } else if (swipeDistance < -50 && currentSlideIndex > 0) {
        setCurrentSlideIndex(currentSlideIndex - 1);
      }
    }
  }, [touchStartX, currentSlideIndex, inspectSlides.length]);

  const goToNextSlide = () => {
    if (currentSlideIndex < inspectSlides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  return (
    <div className="relative bg-white text-black">
      {/* Max-width container for ultra-wide screens */}
      <div className="max-w-[1920px] mx-auto relative min-h-screen">
        {/* LOGO - TOP LEFT (absolute instead of fixed) */}
        <div className="absolute top-6 left-6 z-20">
          <img 
            src={logoImage} 
            alt="Logo" 
            className="w-36 h-36"
            loading="eager"
            fetchpriority="high"
          />
        </div>

        {/* BACK BUTTON - TOP RIGHT (absolute instead of fixed) */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-4">
          {/* MANIFESTO button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="border-2 border-black px-4 py-1 rounded-full hover:bg-black hover:text-white transition-all duration-200 bg-transparent text-black"
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
            onClick={() => {
              if (isMobile && inspectMode) {
                setInspectMode(false);
              } else {
                onBack();
              }
            }}
            className="hover:opacity-50 transition-opacity duration-200 text-black"
            style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
          >
            <span className="text-[24px]">BACK →</span>
          </motion.button>
        </div>

        {/* DROP BADGE - TOP RIGHT BELOW BACK (absolute instead of fixed) */}
        <div className="absolute top-20 right-6 z-20">
          <span
            className="px-4 py-1 rounded-full border-2 border-black text-black bg-white text-[10px] tracking-wider"
            style={{ fontFamily: 'Arial, sans-serif', fontWeight: 500 }}
          >
            DROP #03 – SOLD OUT
          </span>
        </div>

        {/* CLOSE PREVIEW BUTTON - BELOW DROP BADGE */}
        {showPreview && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPreview(false)}
            className="absolute top-32 right-6 z-50 hover:opacity-70 transition-opacity"
          >
            <X className="w-10 h-10 text-black stroke-white" strokeWidth={3} style={{ filter: 'drop-shadow(0 0 2px white)' }} />
          </motion.button>
        )}

        {/* INSPECT MODE - FULLSCREEN */}
        {inspectMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[5] bg-white overflow-y-auto md:overflow-hidden"
          >
            {/* DESKTOP: Magnifier Mode */}
            {!isMobile && (
              <div
                ref={inspectRef}
                className="relative w-full h-full flex items-center justify-center cursor-none"
                onMouseMove={handleMagnifierMove}
                onMouseEnter={() => setShowMagnifier(true)}
                onMouseLeave={() => setShowMagnifier(false)}
              >
                <img
                  src={inspectImage}
                  alt="Inspect Object"
                  className="w-full h-full object-cover"
                />

                {/* MAGNIFIER */}
                {showMagnifier && (
                  <div
                    className="absolute pointer-events-none rounded-full border-4 border-black overflow-hidden bg-white"
                    style={{
                      width: '200px',
                      height: '200px',
                      left: `${magnifyPosition.x - 100}px`,
                      top: `${magnifyPosition.y - 100}px`,
                      backgroundImage: `url(${inspectImage})`,
                      backgroundSize: `${magnifyPosition.imgWidth * 3}px auto`,
                      backgroundPosition: `${-magnifyPosition.imgX * 3 + 100}px ${-magnifyPosition.imgY * 3 + 100}px`,
                      backgroundRepeat: 'no-repeat',
                      boxShadow: '0 0 20px rgba(0,0,0,0.3)',
                    }}
                  />
                )}
              </div>
            )}

            {/* MOBILE: Slider Mode */}
            {isMobile && (
              <>
                <div className="flex flex-col min-h-screen">
                  {/* IMAGE SLIDER */}
                  <div className="relative w-full">
                    <div
                      className="relative w-full overflow-hidden"
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                    >
                      <motion.div
                        className="flex"
                        animate={{ x: `-${currentSlideIndex * 100}%` }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      >
                        {inspectSlides.map((slide, index) => (
                          <button
                            key={index}
                            onClick={() => setShowPreview(true)}
                            className="w-full flex-shrink-0"
                          >
                            <img
                              src={slide}
                              alt={`Inspect slide ${index + 1}`}
                              className="w-full h-auto"
                            />
                          </button>
                        ))}
                      </motion.div>

                      {/* LEFT ARROW */}
                      {currentSlideIndex > 0 && (
                        <button
                          onClick={goToPrevSlide}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 border-2 border-black rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
                        >
                          <ChevronLeft className="w-8 h-8 text-black" />
                        </button>
                      )}

                      {/* RIGHT ARROW */}
                      {currentSlideIndex < inspectSlides.length - 1 && (
                        <button
                          onClick={goToNextSlide}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 border-2 border-black rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
                        >
                          <ChevronRight className="w-8 h-8 text-black" />
                        </button>
                      )}
                    </div>

                    {/* DOTS INDICATOR */}
                    <div className="flex justify-center gap-2 py-4 bg-white">
                      {inspectSlides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlideIndex(index)}
                          className={`w-3 h-3 rounded-full border-2 border-black transition-colors ${
                            index === currentSlideIndex ? 'bg-black' : 'bg-white'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* DOSAGE CARD BELOW SLIDER */}
                  <div className="px-6 pb-24 pt-6 bg-white">
                    <div className="w-full max-w-[280px] mx-auto">
                      {/* CARD BACKGROUND AND CONTENT */}
                      <div className="border-2 border-black bg-white p-5">
                        <h3
                          className="text-[13px] tracking-wider mb-5 pb-2 border-b border-black"
                          style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
                        >
                          OZEMPIC BEAR
                        </h3>

                        <div className="space-y-1.5" style={{ fontFamily: 'Arial, sans-serif' }}>
                          <div className="flex justify-between text-[11px] border-b border-black/20 pb-1.5">
                            <span>PRICE:</span>
                            <span className="font-bold">$500</span>
                          </div>
                          <div className="flex justify-between text-[11px] border-b border-black/20 pb-1.5">
                            <span>SERVINGS PER SCULPTURE:</span>
                            <span>1</span>
                          </div>
                          <div className="space-y-0.5 text-[11px] border-b border-black/20 pb-1.5">
                            <div className="flex justify-between">
                              <span>MATERIAL:</span>
                              <span className="text-right">TRANSPARENT EPOXY + RESIN</span>
                            </div>
                            <div className="flex justify-between">
                              <span>WEIGHT:</span>
                              <span className="text-right">HEAVY ENOUGH</span>
                            </div>
                            <div className="flex justify-between">
                              <span>CONTAINS:</span>
                              <span className="text-right">1 OZEMPIC SYRINGE (NON-FUNCTIONAL)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* BUTTONS */}
                      <div className="pt-1.5">
                        <button
                          className="w-full py-2 border-2 border-black bg-transparent text-black text-[11px] tracking-wider hover:bg-black hover:text-white transition-colors text-center"
                          style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
                        >
                          SOLD OUT
                        </button>
                        <button
                          onClick={() => setInspectMode(false)}
                          className="w-full py-2 border-2 border-black bg-[#dd0707] text-black text-[11px] tracking-wider hover:bg-[#dd0707]/90 transition-colors text-center mt-1.5"
                          style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
                        >
                          RETURN BACK
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FULLSCREEN PREVIEW MODAL */}
                {showPreview && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black z-50"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                  >
                    {/* IMAGE CONTAINER */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={inspectSlides[currentSlideIndex]}
                        alt={`Preview ${currentSlideIndex + 1}`}
                        className="w-full h-full object-contain"
                      />

                      {/* CLOSE BUTTON - INSIDE IMAGE TOP RIGHT */}
                      <button
                        onClick={() => setShowPreview(false)}
                        className="absolute top-6 right-6 hover:opacity-70 transition-opacity z-10"
                      >
                        <X className="w-10 h-10 text-black" strokeWidth={3} />
                      </button>

                      {/* LEFT ARROW */}
                      {currentSlideIndex > 0 && (
                        <button
                          onClick={goToPrevSlide}
                          className="absolute left-6 hover:opacity-70 transition-opacity"
                        >
                          <ChevronLeft className="w-12 h-12 text-white" strokeWidth={3} />
                        </button>
                      )}

                      {/* RIGHT ARROW */}
                      {currentSlideIndex < inspectSlides.length - 1 && (
                        <button
                          onClick={goToNextSlide}
                          className="absolute right-6 hover:opacity-70 transition-opacity"
                        >
                          <ChevronRight className="w-12 h-12 text-white" strokeWidth={3} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* MAIN CONTENT */}
        <div className="min-h-screen">
          {/* HERO SECTION */}
          <section className="min-h-screen flex flex-col">
            {/* Hero Image with Tooltip - FULL WIDTH */}
            <div
              ref={heroRef}
              className="relative w-full flex-1 cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setTooltipVisible(true)}
              onMouseLeave={() => setTooltipVisible(false)}
            >
              <img
                src={isMobile ? bearImageMobile : bearImage}
                alt="Ozempic Bear"
                className="w-full h-full object-cover"
                loading="eager"
                fetchpriority="high"
              />

              {/* FAKE DOSAGE CARD - STICKY CENTER LEFT - Hide on mobile when inspect mode */}
              {!(isMobile && inspectMode) && (
                <div 
                  className="fixed left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 top-1/2 -translate-y-1/2 w-[280px] md:w-[435px] z-10"
                >
                  {/* TRANSPARENCY TOGGLE - TOP RIGHT */}
                  <button
                    onClick={() => setIsTransparent(!isTransparent)}
                    className={`absolute -top-3 -right-3 px-3 py-1 rounded-full border-2 border-black text-[9px] md:text-[10px] tracking-wider transition-colors z-10 ${
                      isTransparent
                        ? 'bg-[#dd0707] text-black hover:bg-[#dd0707]/90'
                        : 'bg-white text-black hover:bg-black hover:text-white'
                    }`}
                    style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700 }}
                  >
                    {isTransparent ? 'MAKE VISIBLE' : 'MAKE TRANSPARENT'}
                  </button>

                  {/* CARD BACKGROUND AND CONTENT */}
                  <div className={`border-2 border-black bg-white p-5 md:p-7 transition-opacity duration-300 ${
                    isTransparent ? 'opacity-30' : 'opacity-100'
                  }`}>
                    <h3
                      className="text-[13px] md:text-[16px] tracking-wider mb-5 md:mb-7 pb-2 border-b border-black"
                      style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
                    >
                      OZEMPIC BEAR
                    </h3>

                    <div className="space-y-1.5 md:space-y-2" style={{ fontFamily: 'Arial, sans-serif' }}>
                      <div className="flex justify-between text-[11px] md:text-[14px] border-b border-black/20 pb-1.5 md:pb-2">
                        <span>PRICE:</span>
                        <span className="font-bold">$500</span>
                      </div>
                      <div className="flex justify-between text-[11px] md:text-[14px] border-b border-black/20 pb-1.5 md:pb-2">
                        <span>SERVINGS PER SCULPTURE:</span>
                        <span>1</span>
                      </div>
                      <div className="space-y-0.5 md:space-y-1 text-[11px] md:text-[14px] border-b border-black/20 pb-1.5 md:pb-2">
                        <div className="flex justify-between">
                          <span>MATERIAL:</span>
                          <span className="text-right">TRANSPARENT EPOXY + RESIN</span>
                        </div>
                        <div className="flex justify-between">
                          <span>WEIGHT:</span>
                          <span className="text-right">HEAVY ENOUGH</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CONTAINS:</span>
                          <span className="text-right">1 OZEMPIC SYRINGE (NON-FUNCTIONAL)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BUTTONS - ALWAYS VISIBLE */}
                  <div className="pt-1.5 md:pt-2">
                    <button
                      className="w-full py-2 md:py-3 border-2 border-black bg-transparent text-black text-[11px] md:text-[14px] tracking-wider hover:bg-black hover:text-white transition-colors text-center"
                      style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
                    >
                      SOLD OUT
                    </button>
                    <button
                      onClick={() => setInspectMode(!inspectMode)}
                      className={`w-full py-2 md:py-3 border-2 border-black text-[11px] md:text-[14px] tracking-wider transition-colors text-center mt-1.5 md:mt-2 ${
                        inspectMode 
                          ? 'bg-[#dd0707] text-black hover:bg-[#dd0707]/90' 
                          : 'bg-black text-white hover:bg-black/80'
                      }`}
                      style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
                    >
                      {inspectMode ? 'RETURN BACK' : 'INSPECT OBJECT'}
                    </button>
                  </div>
                </div>
              )}

              {/* Tooltip bubble */}
              {tooltipVisible && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute pointer-events-none bg-white border-[5px] border-black rounded-2xl px-10 py-5 text-[28px] tracking-wide shadow-2xl"
                  style={{
                    left: `${tooltipPosition.x + 50}px`,
                    top: `${tooltipPosition.y - 100}px`,
                    fontFamily: 'Arial Black, sans-serif',
                    fontWeight: 900,
                  }}
                >
                  {currentTooltip}
                  {/* Speech bubble tail */}
                  <div
                    className="absolute w-8 h-8 bg-white border-l-[5px] border-b-[5px] border-black transform rotate-45"
                    style={{
                      left: '-20px',
                      top: '50%',
                      marginTop: '-16px',
                    }}
                  />
                </motion.div>
              )}
            </div>
          </section>
        </div>

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
                #3 OZEMPIC BEAR
              </h2>
              <p
                className="text-[14px] md:text-[16px] leading-relaxed text-white"
                style={{
                  fontFamily: 'Arial, sans-serif',
                }}
              >
                {language === 'EN'
                  ? "Ozempic Bear is an ironic reflection of how quickly and naturally weight-loss medications have entered our lives. Designed as a heavier version of a normal gummy bear, this figure represents today's \"instant results\" culture. This sculpture neither defends the innocence of sugar nor highlights the promise of the drug. It presents both exactly as they are, side by side, without intervention. It shows the consequences of excess and the attempt to \"fix\" those consequences with yet another form of excess."
                  : "Ozempic Bear, kilo verme ilaçlarının hayatımıza ne kadar hızlı ve doğal bir şekilde girdiğinin ironik bir yansıması. Normal bir jelibon ayısının daha ağır versiyonu olarak tasarlanan bu figür, günümüzün 'anında sonuç' kültürünü temsil ediyor. Bu heykel ne şekerin masumiyetini savunuyor ne de ilacın vaadini öne çıkarıyor. Her ikisini de oldukları gibi, yan yana, müdahale etmeden sunuyor. Aşırılığın sonuçlarını ve o sonuçları başka bir aşırılık biçimiyle 'düzeltme' girişimini gösteriyor."
                }
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}