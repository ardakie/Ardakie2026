import { motion, useInView } from 'motion/react';
import { useState, useRef, useCallback, useEffect } from 'react';
import luxuryTaxImageDesktop from '../assets/luxury-tax/luxuryTaxImageDesktop.webp';
import luxuryTaxImageMobile from '../assets/luxury-tax/luxuryTaxImageMobile.webp';
import luxuryTaxImage2Desktop from '../assets/luxury-tax/luxuryTaxImage2Desktop.webp';
import luxuryTaxImage2Mobile from '../assets/luxury-tax/luxuryTaxImage2Mobile.webp';
import luxuryTaxImage3Desktop from '../assets/luxury-tax/luxuryTaxImage3Desktop.webp';
import luxuryTaxImage3Mobile from '../assets/luxury-tax/luxuryTaxImage3Mobile.webp';
import cursorImagePath from '../assets/luxury-tax/cursorImagePath.webp';
import logoImage from '../assets/luxury-tax/logoImage.webp';

interface LuxuryTaxContentProps {
  onBack: () => void;
}

function SlideContent({ slide, index, netWorth, setNetWorth, isFocused, setIsFocused, showResult, handleCalculate, handlePayNow }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.65, once: false });

  // Custom cursor URL for all interactive elements
  const customCursorStyle = { cursor: `url(${cursorImagePath}), auto` };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={{ 
        opacity: isInView ? 1 : 0.3, 
        y: isInView ? 0 : 60,
        scale: isInView ? 1 : 0.95
      }}
      transition={{ 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1]
      }}
      className="w-full h-full flex items-center justify-center gpu-accelerated"
    >
      {slide.type === 'image' ? (
        <>
          {/* Mobile image */}
          <img 
            src={luxuryTaxImageMobile} 
            alt="Luxury Tax Block" 
            className="w-full h-full object-cover md:hidden"
            loading="eager"
            fetchpriority="high"
          />
          {/* Desktop image */}
          <img 
            src={slide.content} 
            alt="Luxury Tax Block" 
            className="w-full h-full object-cover hidden md:block"
            loading="eager"
            fetchpriority="high"
          />
        </>
      ) : slide.type === 'calculator' ? (
        <div className="w-full max-w-xl px-8">
          <div className="w-full space-y-6 md:space-y-8">
            {/* Headline */}
            <h1
              className="text-center text-[28px] md:text-[32px] leading-[1.1] tracking-tight"
              style={{ fontFamily: 'BrutalistFont, Arial Black, Arial, Helvetica, sans-serif', fontWeight: 900 }}
            >
              Enter Your Net Worth:
            </h1>

            {/* Input field */}
            <div className="w-full">
              <input
                type="tel"
                inputMode="numeric"
                value={netWorth}
                onChange={(e) => setNetWorth(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="$0"
                className="w-full px-6 py-6 md:px-4 md:py-4 text-[22px] md:text-[20px] transition-colors duration-200"
                style={{
                  fontFamily: 'Arial, sans-serif',
                  border: isFocused ? '2px solid #ff0000' : '2px solid #000000',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>

            {/* Calculate button */}
            <div className="w-full">
              <button
                onClick={handleCalculate}
                className="w-full bg-black text-white py-6 md:py-4 text-center hover:opacity-90 active:opacity-70 transition-opacity duration-200 text-[24px] md:text-[24px]"
                style={{
                  fontFamily: 'BrutalistFont, Arial Black, Arial, Helvetica, sans-serif',
                  fontWeight: 900,
                  cursor: `url(${cursorImagePath}), auto`
                }}
              >
                CALCULATE
              </button>
            </div>

            {/* Result box */}
            {showResult && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full bg-white py-8 text-center space-y-6"
              >
                <div>
                  <div
                    className="text-[22px] md:text-[28px] mb-2 px-4"
                    style={{
                      fontFamily: 'BrutalistFont, Arial Black, Arial, Helvetica, sans-serif',
                      fontWeight: 900,
                    }}
                  >
                    You should pay: $999 Luxury Tax.
                  </div>
                  <div
                    className="text-[16px] md:text-[16px]"
                    style={{
                      fontFamily: 'Arial, sans-serif',
                      color: '#999999',
                    }}
                  >
                    (calculated fairly)
                  </div>
                </div>
                
                {/* Pay Now button */}
                <button
                  onClick={handlePayNow}
                  className="w-full bg-white text-black py-6 md:py-4 text-center hover:bg-black hover:text-white active:bg-black active:text-white transition-all duration-200 text-[24px] md:text-[24px]"
                  style={{
                    fontFamily: 'BrutalistFont, Arial Black, Arial, Helvetica, sans-serif',
                    fontWeight: 900,
                    border: '2px solid #000000',
                    cursor: `url(${cursorImagePath}), auto`
                  }}
                >
                  PAY NOW
                </button>
              </motion.div>
            )}
          </div>
        </div>
      ) : slide.type === 'image2' ? (
        <>
          {/* Mobile image */}
          <img 
            src={luxuryTaxImage2Mobile} 
            alt="Luxury Tax Block" 
            className="w-full h-full object-cover md:hidden"
            loading="lazy"
          />
          {/* Desktop image */}
          <img 
            src={slide.content} 
            alt="Luxury Tax Block" 
            className="w-full h-full object-cover hidden md:block"
            loading="lazy"
          />
        </>
      ) : slide.type === 'image3' ? (
        <>
          {/* Mobile image */}
          <img 
            src={luxuryTaxImage3Mobile} 
            alt="Luxury Tax Block" 
            className="w-full h-full object-cover md:hidden"
            loading="lazy"
          />
          {/* Desktop image */}
          <img 
            src={slide.content} 
            alt="Luxury Tax Block" 
            className="w-full h-full object-cover hidden md:block"
            loading="lazy"
          />
        </>
      ) : (
        <div
          className={`text-center text-[48px] md:text-[100px] lg:text-[130px] xl:text-[150px] tracking-tight max-w-7xl px-8 md:px-16 ${
            index === 3 ? 'leading-[0.95] md:leading-[0.9]' : 'leading-[0.95] md:leading-[1.0]'
          }`}
          style={{
            fontFamily: 'BrutalistFont, Arial Black, Arial, Helvetica, sans-serif',
            fontWeight: 900,
          }}
        >
          {slide.main}
          {slide.sub && (
            <div className="text-[24px] md:text-[32px] leading-[1.0] md:leading-[1.1] tracking-tight max-w-7xl mt-4"
              style={{
                fontFamily: 'BrutalistFont, Arial Black, Arial, Helvetica, sans-serif',
                fontWeight: 900,
              }}
            >
              {slide.sub}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function LuxuryTaxContent({ onBack }: LuxuryTaxContentProps) {
  const [netWorth, setNetWorth] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showManifesto, setShowManifesto] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'TR'>('EN');

  const cursorImage = cursorImagePath;
  const containerRef = useRef<HTMLDivElement>(null);
  const currentSlideRef = useRef(0);

  // Define slides array
  const textSlides = [
    { type: 'image', content: luxuryTaxImageDesktop },
    { type: 'text', main: "1.2 KG OF PURE DISGUSTING WEALTH.", sub: null },
    { type: 'text', main: "TAX AND PAIN ALL IN ONE BLOCK.", sub: null },
    { type: 'text', main: "IF YOU DROP IT, IT WILL BREAK YOUR FLOOR.", sub: "(WE TESTED.)" },
    { type: 'text', main: "THIS IS WHAT MONEY SHOULD FEEL LIKE.", sub: null },
    { type: 'calculator', content: null },
    { type: 'image2', content: luxuryTaxImage2Desktop },
    { type: 'image3', content: luxuryTaxImage3Desktop }
  ];

  // Track current slide with scroll event for instant response
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPosition = container.scrollTop;
      const slideHeight = container.clientHeight;
      const newSlide = Math.round(scrollPosition / slideHeight);
      
      if (newSlide !== currentSlideRef.current) {
        currentSlideRef.current = newSlide;
        setCurrentSlide(newSlide);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array - no re-creation

  // Memoize handlers
  const handleCalculate = useCallback(() => {
    if (netWorth.trim()) {
      setShowResult(true);
    }
  }, [netWorth]);

  const handlePayNow = useCallback(() => {
    // Scroll to next slide (image2)
    const slides = document.querySelectorAll('.snap-slide');
    if (slides[6]) {
      slides[6].scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleSlideEnter = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white h-screen overflow-y-scroll snap-y snap-mandatory"
      style={{ cursor: `url(${cursorImage}), auto` }}
      ref={containerRef}
    >
      {/* Max-width container for ultra-wide screens */}
      <div className="max-w-[1920px] mx-auto relative">
        {/* BACK and MANIFESTO buttons - Top Right (fixed, stays in place) */}
        <div className="fixed top-8 right-1/2 translate-x-1/2 max-w-[1920px] w-full z-50 pointer-events-none">
          <div className="absolute top-0 right-8 flex items-center gap-4 pointer-events-auto">
            {/* MANIFESTO button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="border-2 border-black px-4 py-1 rounded-full hover:bg-black hover:text-white transition-all duration-200 bg-transparent text-black"
              style={{ 
                fontFamily: 'BrutalistFont, Arial Black, Arial, Helvetica, sans-serif', 
                fontWeight: 900,
                cursor: `url(${cursorImage}), auto`
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
              className="hover:opacity-50 transition-opacity duration-200 text-black"
              style={{ 
                fontFamily: 'BrutalistFont, Arial Black, Arial, Helvetica, sans-serif', 
                fontWeight: 900,
                cursor: `url(${cursorImage}), auto`
              }}
            >
              <span className="text-[24px]">BACK →</span>
            </motion.button>
          </div>
        </div>

        {/* Logo - fixed to stay visible during scroll but within max-width, scales down on scroll */}
        <div className="fixed top-8 left-1/2 -translate-x-1/2 max-w-[1920px] w-full z-40 pointer-events-none">
          <div className="absolute top-0 left-8 pointer-events-auto">
            <motion.img
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                scale: currentSlide === 0 ? 1 : 0.5
              }}
              transition={{ delay: 0.2, scale: { duration: 0.15 } }}
              src={logoImage}
              alt="Logo"
              className="w-[200px] h-[200px] md:w-[280px] md:h-[280px] object-contain origin-top-left"
              loading="eager"
              fetchpriority="high"
            />
          </div>
        </div>

        {/* Fixed Product Info - Only visible on image2 and image3 slides */}
        {(currentSlide === 6 || currentSlide === 7) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 flex items-end justify-center md:items-center md:justify-start z-40 pointer-events-none pb-16 md:pb-0 pl-0 md:pl-24"
          >
            <div className="text-center md:text-left space-y-3 pointer-events-none">
              {/* Title */}
              <h1
                className="text-[24px] md:text-[40px] tracking-tight"
                style={{
                  fontFamily: 'BrutalistFont, Arial Black, Arial, Helvetica, sans-serif',
                  fontWeight: 900,
                }}
              >
                Luxury Tax
              </h1>

              {/* Price */}
              <div className="space-y-0.5">
                <div
                  className="text-[24px] md:text-[40px]"
                  style={{
                    fontFamily: 'BrutalistFont, Arial Black, Arial, Helvetica, sans-serif',
                    fontWeight: 900,
                  }}
                >
                  $1.000
                </div>
                <div
                  className="text-[10px] md:text-[12px]"
                  style={{
                    fontFamily: 'Arial, sans-serif',
                    fontStyle: 'italic',
                    fontWeight: 300,
                  }}
                >
                  (tax included)
                </div>
              </div>

              {/* Buy Now Button */}
              <button
                className="px-8 py-2 bg-white text-black border-4 border-black hover:bg-black hover:text-white transition-all duration-200 text-[16px] md:text-[20px] pointer-events-auto"
                style={{
                  fontFamily: 'Arial Black, sans-serif',
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                }}
              >
                SOLD OUT
              </button>
            </div>
          </motion.div>
        )}

        {/* Slides */}
        {textSlides.map((slide, index) => (
          <div
            key={index}
            className="snap-slide w-full h-screen snap-start snap-always flex items-center justify-center"
            onTouchStart={() => handleSlideEnter(index)}
            onMouseEnter={() => handleSlideEnter(index)}
          >
            <SlideContent
              slide={slide}
              index={index}
              netWorth={netWorth}
              setNetWorth={setNetWorth}
              isFocused={isFocused}
              setIsFocused={setIsFocused}
              showResult={showResult}
              handleCalculate={handleCalculate}
              handlePayNow={handlePayNow}
            />
          </div>
        ))}

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
              cursor: `url(${cursorImage}), auto`
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
                  cursor: `url(${cursorImage}), auto`
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
                    cursor: `url(${cursorImage}), auto`
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
                    cursor: `url(${cursorImage}), auto`
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
                  fontFamily: 'BrutalistFont, Arial Black, Arial, Helvetica, sans-serif',
                  fontWeight: 900,
                }}
              >
                #4 LUXURY TAX
              </h2>
              <p
                className="text-[14px] md:text-[16px] leading-relaxed text-white"
                style={{
                  fontFamily: 'Arial, sans-serif',
                }}
              >
                {language === 'EN' 
                  ? "This object serves as a reminder of the privileges that come with high income a physical expression that says, \"if you're wealthy, this is the cost.\" It transforms the illusion of luxury embedded in conspicuous consumption into a heavy, tangible mass. This sculpture is not a reward; it is an obligation whose very ownership is an irony. And if it feels unnecessary, expensive, or absurd to you, then it has achieved its purpose, because true luxury is often irrational and excessive."
                  : "Bu nesne, yüksek gelirle gelen ayrıcalıkların bir hatırlatıcısı; eğer zenginseniz, bedeliniz budur diyen fiziksel bir ifade. Gösterişçi tüketimin içine gömülü lüks yanılsamasını ağır, somut bir kütleye dönüştürür. Bu heykel bir ödül değil; sahip olmak bile ironik bir yükümlülük. Eğer size gereksiz, pahalı ya da absürt geliyorsa, amacına ulaşmış demektir çünkü gerçek lüks genellikle mantıksız ve aşırıdır."
                }
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}