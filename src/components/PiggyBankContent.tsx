import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { ChevronUp, X } from 'lucide-react';
import logoImage from '../assets/piggy-bank/logoImage.png';
import piggyImage1 from '../assets/piggy-bank/piggyImage1.png';
import piggyImage2 from '../assets/piggy-bank/piggyImage2.png';
import tapToSaveImage from '../assets/piggy-bank/tapToSaveImage.png';
import only400Image from '../assets/piggy-bank/only400Image.png';
import displayOnlyImage from '../assets/piggy-bank/displayOnlyImage.png';
import cursorImage from '../assets/piggy-bank/cursorImage.png';
import collectorsImage from '../assets/piggy-bank/collectorsImage.png';
import seeThePieceImage from '../assets/piggy-bank/seeThePieceImage.png';
import productImage1 from '../assets/piggy-bank/productImage1.png';
import productImage2 from '../assets/piggy-bank/productImage2.png';
import productImage3 from '../assets/piggy-bank/productImage3.png';

interface PiggyBankContentProps {
  onBack: () => void;
}

interface FloatingMoney {
  id: number;
  amount: number;
  x: number;
  y: number;
}

export default function PiggyBankContent({ onBack }: PiggyBankContentProps) {
  const [showManifesto, setShowManifesto] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'TR'>('EN');
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [totalMoney, setTotalMoney] = useState(0);
  const [lastAdded, setLastAdded] = useState<number | null>(null);
  const [floatingMoney, setFloatingMoney] = useState<FloatingMoney[]>([]);
  const [nextId, setNextId] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showProductPopup, setShowProductPopup] = useState(false);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState<number | null>(null);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Listen to scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current && !isExpanded) {
        const scrollTop = scrollRef.current.scrollTop;
        if (scrollTop > 100) {
          setIsExpanded(true);
        }
      }
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isExpanded]);

  const manifestoContent = {
    EN: {
      title: "CONTACTLESS PIGGY BANK™",
      text: "Piggy Bank is a \"piggy bank\" made for people who can't even be bothered to save money. No coin slot. No opening. No function at all. You can't put anything inside because there's literally nowhere to put it; on top there's only a contactless payment symbol, meaning you can tap your card—but of course nothing will happen. Piggy Bank is an object that mocks our economic habits. It doesn't save, it doesn't work, it doesn't do anything. But it's $400. Because why not?"
    },
    TR: {
      title: "CONTACTLESS PIGGY BANK™",
      text: "Piggy Bank, para biriktirmeye tamamen üşenen insanlar için yapılmış bir \"kumbara.\" Bozuk para yarığı yok. Açılan bir kapağı yok. Hiçbir işlevi yok. İçine hiçbir şey koyamazsın, çünkü koyacak yer yok; üstünde sadece temassız ödeme logosu var, yani kartını dokundurabilirsin ama elbette hiçbir şey olmaz. Piggy Bank, ekonomik davranışlarımızla dalga geçen bir nesne. Biriktirmiyor, çalışmıyor, işlevi yok. Ama 400 dolar. Çünkü neden olmasın?"
    }
  };

  const selectedManifesto = manifestoContent[language];

  // Handle pig click - adds random money
  const handlePigClick = (event: React.MouseEvent<HTMLImageElement>) => {
    // Generate random amount between $1 and $200
    const amount = Math.floor(Math.random() * 200) + 1;
    
    // Add to total
    setTotalMoney(prev => prev + amount);
    
    // Show last added amount in top-right
    setLastAdded(amount);
    setTimeout(() => setLastAdded(null), 700);

    // Create floating money popup at cursor
    const newFloating: FloatingMoney = {
      id: nextId,
      amount,
      x: mousePosition.x,
      y: mousePosition.y,
    };
    
    setFloatingMoney(prev => [...prev, newFloating]);
    setNextId(prev => prev + 1);

    // Remove floating money after animation
    setTimeout(() => {
      setFloatingMoney(prev => prev.filter(f => f.id !== newFloating.id));
    }, 600);
  };

  // Scroll functions for product carousel
  const scrollCarousel = (direction: 'left' | 'right') => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    const scrollAmount = scrollContainer.clientWidth * 0.9;
    const targetScroll = direction === 'left' 
      ? scrollContainer.scrollLeft - scrollAmount
      : scrollContainer.scrollLeft + scrollAmount;
    
    scrollContainer.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  const productImages = [productImage1, productImage2, productImage3];

  return (
    <div 
      ref={scrollRef}
      className="relative h-screen w-full overflow-y-auto overflow-x-hidden"
      style={{
        background: 'linear-gradient(to bottom, #e9d88e 0%, #deacb0 50%, #bcd7d4 100%)',
        cursor: (showManifesto || showProductPopup) ? 'default' : (isExpanded ? `url(${cursorImage}), auto` : 'default'),
      }}
    >
      {/* Invisible spacer to enable scrolling */}
      <div className="h-[200vh] relative">
        {/* Content wrapper - fixed positioning with max-width container */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Max-width container for ultra-wide screens */}
          <div className="absolute inset-0 max-w-[1920px] mx-auto pointer-events-none">
            {/* Floating money popups above cursor */}
            <AnimatePresence>
              {floatingMoney.map(money => (
                <motion.div
                  key={money.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: [0, 1, 1, 0],
                    scale: [0.8, 1.2, 1.2, 1],
                    x: mousePosition.x - money.x,
                    y: mousePosition.y - money.y - 60
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    opacity: { duration: 0.6, ease: "easeOut" },
                    scale: { duration: 0.6, ease: "easeOut" },
                    x: { duration: 0, ease: "linear" },
                    y: { duration: 0, ease: "linear" }
                  }}
                  className="fixed z-[200]"
                  style={{
                    left: money.x,
                    top: money.y,
                    fontFamily: 'Arial Black, sans-serif',
                    fontWeight: 900,
                    fontSize: '32px',
                    color: '#2EE062',
                    textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                    pointerEvents: 'none',
                    WebkitTextStroke: '1px rgba(0,0,0,0.2)',
                  }}
                >
                  +${money.amount}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Money Counter - Top Right below BACK - Only show when expanded */}
            <AnimatePresence>
              {isExpanded && (
                <>
                  {/* Desktop Money Counter - Top Right */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.3 }}
                    className="hidden md:block absolute top-[clamp(70px,18vh,80px)] right-[clamp(16px,4vw,32px)] z-50 pointer-events-none"
                  >
                    {/* "Piggy Bank:" label */}
                    <div
                      className="text-black mb-1"
                      style={{
                        fontFamily: 'Arial Black, sans-serif',
                        fontWeight: 900,
                        fontSize: 'clamp(12px, 3vw, 18px)',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.15)',
                        textAlign: 'right',
                        opacity: 0.8,
                      }}
                    >
                      Piggy Bank:
                    </div>

                    {/* Total Money Display */}
                    <div
                      className="text-black"
                      style={{
                        fontFamily: 'Arial Black, sans-serif',
                        fontWeight: 900,
                        fontSize: 'clamp(22px, 6vw, 40px)',
                        textShadow: '3px 3px 6px rgba(0,0,0,0.2)',
                        textAlign: 'right',
                        WebkitTextStroke: '1px rgba(0,0,0,0.1)',
                      }}
                    >
                      ${totalMoney}
                    </div>

                    {/* Green popup under total - shows last added */}
                    <AnimatePresence>
                      {lastAdded !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: -5, scale: 0.8 }}
                          animate={{ opacity: [0, 1, 1, 0], y: 0, scale: [0.8, 1.1, 1.1, 1] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                          style={{
                            fontFamily: 'Arial Black, sans-serif',
                            fontWeight: 900,
                            fontSize: 'clamp(14px, 4.5vw, 24px)',
                            color: '#2EE062',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                            textAlign: 'right',
                            marginTop: '-4px',
                            WebkitTextStroke: '1px rgba(0,0,0,0.15)',
                          }}
                        >
                          +${lastAdded}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* BACK and MANIFESTO buttons - TOP RIGHT - Fixed */}
            <div 
              className={`absolute top-[clamp(16px,4vw,32px)] right-[clamp(16px,4vw,32px)] z-50 flex items-center gap-[clamp(8px,2vw,16px)] ${(showManifesto || showProductPopup) ? 'pointer-events-none' : 'pointer-events-auto'}`}
            >
              {/* MANIFESTO button */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="border-2 border-black px-[clamp(12px,3vw,16px)] py-1 rounded-full hover:bg-black hover:text-white transition-all duration-200 bg-transparent text-black"
                style={{ 
                  fontFamily: 'Arial Black, sans-serif', 
                  fontWeight: 900,
                  fontSize: 'clamp(11px, 3vw, 14px)',
                }}
                onClick={() => setShowManifesto(!showManifesto)}
              >
                MANIFESTO
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onClick={onBack}
                className="hover:opacity-50 transition-opacity duration-200 text-black"
                style={{ 
                  fontFamily: 'Arial Black, sans-serif', 
                  fontWeight: 900,
                  fontSize: 'clamp(18px, 5vw, 24px)',
                }}
              >
                BACK →
              </motion.button>
            </div>

            {/* Logo - starts center, moves to top center on expand */}
            <motion.div
              animate={{
                y: isExpanded ? (typeof window !== 'undefined' && window.innerWidth < 768 ? -230 : -340) : 0,
                scale: isExpanded ? (typeof window !== 'undefined' && window.innerWidth < 768 ? 0.8 : 0.65) : 1,
              }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[90vw] md:w-[910px]"
            >
              <motion.img
                src={logoImage}
                alt="The Contactless Piggy Bank"
                className="w-full h-auto select-none pointer-events-none"
                loading="eager"
                fetchpriority="high"
                animate={{
                  y: [0, -8, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "reverse"
                }}
              />
            </motion.div>

            {/* Swipe up arrow - disappears on expand */}
            <AnimatePresence>
              {!isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 cursor-pointer"
                  onClick={() => setIsExpanded(true)}
                >
                  <motion.div
                    animate={{
                      y: [0, -10, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-white"
                  >
                    <ChevronUp size={48} strokeWidth={3} />
                  </motion.div>
                  <span 
                    className="text-white text-[14px] tracking-wider"
                    style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
                  >
                    SWIPE UP
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Piggy Bank Images - appear after expand */}
            <AnimatePresence>
              {isExpanded && (
                <>
                  {/* Left side - Piggy Banks */}
                  <div className="absolute inset-0 flex items-center justify-center md:justify-start md:pl-16">
                    <div className="relative">
                      {/* Piggy 1 - Left side, larger */}
                      <motion.div
                        initial={{ opacity: 0, x: -100, y: 50 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{
                          duration: 0.8,
                          delay: 0.3,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                        className="relative"
                        style={{
                          width: 'clamp(280px, 75vw, 600px)',
                        }}
                      >
                        <motion.img
                          src={piggyImage1}
                          alt="Contactless Piggy Bank"
                          className="w-full h-auto select-none"
                          style={{ 
                            pointerEvents: 'auto',
                            cursor: `url(${cursorImage}), auto`
                          }}
                          loading="lazy"
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                          animate={{
                            y: [0, -8, 0]
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatType: "reverse"
                          }}
                          whileTap={{ 
                            scale: [1, 1.05, 1],
                            transition: { 
                              duration: 0.3,
                              ease: [0.34, 1.56, 0.64, 1]
                            }
                          }}
                          onClick={handlePigClick}
                        />
                        
                        {/* Piggy 2 - Right bottom corner of Piggy 1, attached */}
                        <motion.div
                          initial={{ opacity: 0, x: 100, y: 50 }}
                          animate={{ opacity: 1, x: 0, y: 0 }}
                          transition={{
                            duration: 0.8,
                            delay: 0.5,
                            ease: [0.22, 1, 0.36, 1]
                          }}
                          className="absolute bottom-0 -right-[clamp(32px,9vw,80px)]"
                          style={{
                            width: 'clamp(90px, 25vw, 213px)',
                          }}
                        >
                          <motion.img
                            src={piggyImage2}
                            alt="Contactless Piggy Bank with WiFi"
                            className="w-full h-auto select-none"
                            style={{ 
                              pointerEvents: 'auto',
                              cursor: `url(${cursorImage}), auto`
                            }}
                            loading="lazy"
                            animate={{
                              y: [0, -6, 0]
                            }}
                            transition={{
                              duration: 3.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                              repeatType: "reverse",
                              delay: 0.3
                            }}
                            whileTap={{ 
                              scale: [1, 1.05, 1],
                              transition: { 
                                duration: 0.3,
                                ease: [0.34, 1.56, 0.64, 1]
                              }
                            }}
                            onClick={handlePigClick}
                          />
                          
                          {/* Tap to Save Nothing - Top right diagonal of WiFi Piggy */}
                          <motion.img
                            src={tapToSaveImage}
                            alt="Tap to Save Nothing"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
                            transition={{
                              opacity: { duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] },
                              scale: { duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] },
                              y: {
                                duration: 3.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                                repeatType: "reverse",
                                delay: 0.5
                              }
                            }}
                            className="hidden md:block absolute -top-20 md:-top-40 -right-24 md:-right-48 w-[110px] md:w-[240px] h-auto select-none pointer-events-none z-50"
                            loading="lazy"
                          />
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Right side - Text Images */}
                  <div className="absolute inset-0 hidden md:flex flex-col items-end justify-center pr-8 md:pr-16 gap-3">
                    {/* ONLY $400 - Right side center */}
                    <motion.img
                      src={only400Image}
                      alt="Only $400"
                      initial={{ opacity: 0, x: 100, y: 50 }}
                      animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
                      transition={{
                        opacity: { duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] },
                        x: { duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] },
                        y: {
                          duration: 4.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          repeatType: "reverse",
                          delay: 0.6
                        }
                      }}
                      className="w-[200px] md:w-[300px] h-auto select-none pointer-events-none"
                      style={{ transform: 'scale(0.67)' }}
                      loading="lazy"
                    />

                    {/* See the Piece - Below Only $400 */}
                    <motion.img
                      src={seeThePieceImage}
                      alt="See the Piece"
                      initial={{ opacity: 0, x: 100, y: 50 }}
                      animate={{ 
                        opacity: [0.8, 1, 0.8],
                        x: 0, 
                        y: [0, -5, 0],
                        filter: [
                          'drop-shadow(0 0 0px rgba(255, 255, 255, 0))',
                          'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))',
                          'drop-shadow(0 0 0px rgba(255, 255, 255, 0))'
                        ]
                      }}
                      transition={{
                        opacity: { 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                        x: { duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] },
                        y: {
                          duration: 3.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                          repeatType: "reverse",
                          delay: 0.8
                        },
                        filter: {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                      }}
                      onClick={() => setShowProductPopup(true)}
                      className="w-[160px] md:w-[240px] h-auto select-none cursor-pointer"
                      style={{ 
                        pointerEvents: 'auto',
                        transform: 'scale(1.2) translateY(-50px)'
                      }}
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Display Only - Bottom Right */}
                  <motion.div
                    initial={{ opacity: 0, x: 100, y: 50 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.8,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="absolute bottom-8 md:bottom-12 right-8 md:right-16 hidden md:block"
                  >
                    <motion.img
                      src={displayOnlyImage}
                      alt="Display Only - No Savings Required"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 3.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatType: "reverse",
                        delay: 0.4
                      }}
                      className="w-[120px] md:w-[173px] h-auto select-none pointer-events-none"
                      loading="lazy"
                    />
                  </motion.div>

                  {/* Collector's Edition - Bottom Left */}
                  <motion.div
                    initial={{ opacity: 0, x: -100, y: 50 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.9,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="absolute bottom-8 md:bottom-12 left-8 md:left-16 hidden md:block"
                  >
                    <motion.img
                      src={collectorsImage}
                      alt="Collector's Edition"
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatType: "reverse",
                        delay: 0.2
                      }}
                      className="w-[150px] md:w-[220px] h-auto select-none pointer-events-none"
                      loading="lazy"
                    />
                  </motion.div>

                  {/* MOBILE ONLY - Text Images */}
                  {/* Tap to Save Nothing - Top right, stuck to right edge */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.7,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="md:hidden absolute top-[28%] right-[clamp(8px,2vw,16px)]"
                    style={{
                      width: 'clamp(75px, 23vw, 110px)',
                    }}
                  >
                    <motion.img
                      src={tapToSaveImage}
                      alt="Tap to Save Nothing"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 3.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatType: "reverse",
                        delay: 0.5
                      }}
                      className="w-full h-auto select-none pointer-events-none"
                      loading="lazy"
                    />
                  </motion.div>

                  {/* Collector's Edition - Top left of pigs */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.8,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="md:hidden absolute top-[32%] left-[clamp(8px,2vw,16px)]"
                    style={{
                      width: 'clamp(100px, 32vw, 150px)',
                    }}
                  >
                    <motion.img
                      src={collectorsImage}
                      alt="Collector's Edition"
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatType: "reverse",
                        delay: 0.2
                      }}
                      className="w-full h-auto select-none pointer-events-none"
                      loading="lazy"
                    />
                  </motion.div>

                  {/* Display Only - Bottom left, stuck to left edge */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.9,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="md:hidden absolute bottom-[28%] left-[clamp(8px,2vw,16px)]"
                    style={{
                      width: 'clamp(85px, 27vw, 130px)',
                    }}
                  >
                    <motion.img
                      src={displayOnlyImage}
                      alt="Display Only - No Savings Required"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 3.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatType: "reverse",
                        delay: 0.4
                      }}
                      className="w-full h-auto select-none pointer-events-none"
                      loading="lazy"
                    />
                  </motion.div>

                  {/* Only $400 - Bottom center, below pigs */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 1.0,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="md:hidden absolute bottom-[1.5%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-0"
                  >
                    <motion.img
                      src={only400Image}
                      alt="Only $400"
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 4.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatType: "reverse",
                        delay: 0.6
                      }}
                      className="w-[clamp(180px,60vw,280px)] h-auto select-none pointer-events-none -mb-2"
                      loading="lazy"
                    />

                    {/* See the Piece - Below Only $400 on mobile */}
                    <motion.img
                      src={seeThePieceImage}
                      alt="See the Piece"
                      animate={{ 
                        opacity: [0.8, 1, 0.8],
                        y: [0, -5, 0],
                        filter: [
                          'drop-shadow(0 0 0px rgba(255, 255, 255, 0))',
                          'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))',
                          'drop-shadow(0 0 0px rgba(255, 255, 255, 0))'
                        ]
                      }}
                      transition={{
                        opacity: { 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                        y: {
                          duration: 3.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                          repeatType: "reverse",
                          delay: 0.8
                        },
                        filter: {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                      }}
                      onClick={() => setShowProductPopup(true)}
                      className="w-[clamp(140px,48vw,220px)] h-auto select-none cursor-pointer -mb-1"
                      style={{ pointerEvents: 'auto' }}
                      loading="lazy"
                    />

                    {/* Mobile Money Counter - Below See the Piece */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 1.2 }}
                      className="pointer-events-none"
                    >
                      {/* "Piggy Bank:" label */}
                      <div
                        className="text-black mb-1"
                        style={{
                          fontFamily: 'Arial Black, sans-serif',
                          fontWeight: 900,
                          fontSize: 'clamp(12px, 3vw, 18px)',
                          textShadow: '2px 2px 4px rgba(0,0,0,0.15)',
                          textAlign: 'center',
                          opacity: 0.8,
                        }}
                      >
                        Piggy Bank:
                      </div>

                      {/* Total Money Display */}
                      <div
                        className="text-black"
                        style={{
                          fontFamily: 'Arial Black, sans-serif',
                          fontWeight: 900,
                          fontSize: 'clamp(22px, 6vw, 40px)',
                          textShadow: '3px 3px 6px rgba(0,0,0,0.2)',
                          textAlign: 'center',
                          WebkitTextStroke: '1px rgba(0,0,0,0.1)',
                        }}
                      >
                        ${totalMoney}
                      </div>

                      {/* Green popup under total - shows last added */}
                      <AnimatePresence>
                        {lastAdded !== null && (
                          <motion.div
                            initial={{ opacity: 0, y: -5, scale: 0.8 }}
                            animate={{ opacity: [0, 1, 1, 0], y: 0, scale: [0.8, 1.1, 1.1, 1] }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            style={{
                              fontFamily: 'Arial Black, sans-serif',
                              fontWeight: 900,
                              fontSize: 'clamp(14px, 4.5vw, 24px)',
                              color: '#2EE062',
                              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                              textAlign: 'center',
                              marginTop: '-4px',
                              WebkitTextStroke: '1px rgba(0,0,0,0.15)',
                            }}
                          >
                            +${lastAdded}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Manifesto Pop-up */}
            <AnimatePresence>
              {showManifesto && (
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
                    cursor: 'default !important',
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
                        fontFamily: 'Arial, sans-serif',
                        fontWeight: 'bold',
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
                          fontFamily: 'Arial Black, sans-serif',
                          fontWeight: 900,
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
                          fontFamily: 'Arial Black, sans-serif',
                          fontWeight: 900,
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
                      {selectedManifesto.title}
                    </h2>

                    <p
                      className="text-[14px] md:text-[16px] leading-relaxed text-white/90"
                      style={{
                        fontFamily: 'Arial, sans-serif',
                      }}
                    >
                      {selectedManifesto.text}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product Popup */}
            <AnimatePresence>
              {showProductPopup && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 z-[150] flex items-center justify-center p-6 pointer-events-auto"
                  onClick={() => setShowProductPopup(false)}
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.10)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    cursor: 'default !important',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="relative max-w-6xl w-full"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      cursor: 'default',
                    }}
                  >
                    {/* Close X button - Top Right */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowProductPopup(false);
                      }}
                      className="absolute -top-12 right-0 text-white hover:opacity-70 transition-opacity z-10 cursor-pointer"
                      style={{
                        pointerEvents: 'auto',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={32} strokeWidth={2.5} />
                    </button>

                    {/* Content Box - Centered */}
                    <div className="flex flex-col items-center text-center">
                      {/* Images Carousel - Mobile Optimized with Navigation */}
                      <div className="relative w-full mb-6 md:mb-8">
                        {/* Left Arrow - Mobile */}
                        <button
                          onClick={() => scrollCarousel('left')}
                          className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-all"
                          style={{
                            pointerEvents: 'auto',
                            cursor: 'pointer',
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <path d="M15 18l-6-6 6-6" />
                          </svg>
                        </button>

                        {/* Scrollable Container */}
                        <div 
                          ref={scrollRef}
                          className="w-full overflow-x-auto md:overflow-visible pb-2 snap-x snap-mandatory"
                          style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            WebkitOverflowScrolling: 'touch',
                          }}
                        >
                          <style>{`
                            .w-full.overflow-x-auto::-webkit-scrollbar {
                              display: none;
                            }
                          `}</style>
                          <div className="flex gap-2 md:gap-4 justify-start md:justify-center px-0 md:px-4">
                            {productImages.map((img, index) => (
                              <img
                                key={index}
                                src={img}
                                alt={`Contactless Piggy Bank ${index + 1}`}
                                className="w-[85vw] md:w-[clamp(180px,28vw,380px)] h-auto object-contain snap-center flex-shrink-0 cursor-pointer"
                                loading="lazy"
                                onClick={() => setFullscreenImageIndex(index)}
                                style={{
                                  pointerEvents: 'auto',
                                }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Right Arrow - Mobile */}
                        <button
                          onClick={() => scrollCarousel('right')}
                          className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-all"
                          style={{
                            pointerEvents: 'auto',
                            cursor: 'pointer',
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>
                      </div>

                      {/* Title */}
                      <h2
                        className="text-white mb-2"
                        style={{
                          fontFamily: 'Arial Black, sans-serif',
                          fontWeight: 900,
                          fontSize: 'clamp(20px, 5vw, 32px)',
                          letterSpacing: '0.5px',
                        }}
                      >
                        CONTACTLESS PIGGY BANK
                      </h2>

                      {/* Price */}
                      <div
                        className="text-white mb-3 md:mb-4"
                        style={{
                          fontFamily: 'Arial Black, sans-serif',
                          fontWeight: 900,
                          fontSize: 'clamp(18px, 4.5vw, 28px)',
                          letterSpacing: '0.5px',
                        }}
                      >
                        $400
                      </div>

                      {/* Description */}
                      <p
                        className="text-white/80 mb-4 md:mb-6 max-w-lg"
                        style={{
                          fontFamily: 'Arial, sans-serif',
                          fontSize: 'clamp(12px, 3.5vw, 14px)',
                          lineHeight: '1.5',
                        }}
                      >
                        Piggy Bank is a concrete sculpture that pretends to be a piggy bank,
                        <br />
                        but refuses to save anything.
                      </p>

                      {/* BUY Button */}
                      <button
                        className="px-6 py-2 bg-white text-black hover:bg-black hover:text-white transition-all duration-200 border-2 border-white rounded-full"
                        style={{
                          fontFamily: 'Arial Black, sans-serif',
                          fontWeight: 900,
                          fontSize: 'clamp(11px, 3vw, 13px)',
                          letterSpacing: '0.5px',
                        }}
                      >
                        SOLD OUT
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fullscreen Image Viewer */}
            <AnimatePresence>
              {fullscreenImageIndex !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 pointer-events-auto"
                  onClick={() => setFullscreenImageIndex(null)}
                  style={{
                    cursor: 'default',
                  }}
                >
                  {/* Close X button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullscreenImageIndex(null);
                    }}
                    className="absolute top-4 right-4 text-white hover:opacity-70 transition-opacity z-10 cursor-pointer"
                    style={{
                      pointerEvents: 'auto',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={40} strokeWidth={2.5} />
                  </button>

                  {/* Left Arrow */}
                  {fullscreenImageIndex > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFullscreenImageIndex(fullscreenImageIndex - 1);
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all cursor-pointer"
                      style={{
                        pointerEvents: 'auto',
                        cursor: 'pointer',
                      }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                  )}

                  {/* Right Arrow */}
                  {fullscreenImageIndex < productImages.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFullscreenImageIndex(fullscreenImageIndex + 1);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all cursor-pointer"
                      style={{
                        pointerEvents: 'auto',
                        cursor: 'pointer',
                      }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  )}

                  {/* Fullscreen Image */}
                  <motion.img
                    key={fullscreenImageIndex}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    src={productImages[fullscreenImageIndex]}
                    alt={`Fullscreen Product View ${fullscreenImageIndex + 1}`}
                    className="max-w-[95vw] max-h-[95vh] object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />

                  {/* Image counter */}
                  <div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full"
                    style={{
                      fontFamily: 'Arial Black, sans-serif',
                      fontWeight: 900,
                    }}
                  >
                    {fullscreenImageIndex + 1} / {productImages.length}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}