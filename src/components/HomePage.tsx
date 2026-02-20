import { motion } from 'motion/react';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import logoImage from '../assets/file-flakes/logoImage.png';

interface HomePageProps {
  onSectionClick: (section: string) => void;
}

const sections = [
  'DinoNugget',
  'Fry Daggers',
  'Ozempic Bear',
  'Luxury Tax',
  'Home Gnomes',
  'Heavy Ring',
  'Piggy Bank',
  'File Flakes',
  'Multiverse Black Market',
];

// Her başlığın intro ekranındaki rengi
const sectionColors: Record<string, string> = {
  'DinoNugget': '#f9a70f',     // turuncu
  'Fry Daggers': '#333333',    // siyah yerine koyu gri
  'Ozempic Bear': '#dd0707',   // kırmızı
  'Luxury Tax': '#333333',     // siyah yerine koyu gri
  'Home Gnomes': '#73a83b',     // yeşil
  'Heavy Ring': '#999999',     // gri gümüş
  'Piggy Bank': '#deacb0',     // gradient'in orta rengi
  'File Flakes': '#FFC107',    // sarı
  'Multiverse Black Market': '#000000', // pure black
};

// Section Title with marquee for overflow
function SectionTitle({ 
  section, 
  index, 
  hoveredSection, 
  onMouseEnter, 
  onMouseLeave, 
  onClick 
}: {
  section: string;
  index: number;
  hoveredSection: string | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [scrollDistance, setScrollDistance] = useState(0);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && containerRef.current) {
        const textWidth = textRef.current.scrollWidth;
        const containerWidth = containerRef.current.clientWidth;
        
        if (textWidth > containerWidth) {
          setIsOverflowing(true);
          setScrollDistance(textWidth + 20); // +20 for gap between loops
        } else {
          setIsOverflowing(false);
        }
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    
    const timer = setTimeout(checkOverflow, 100);
    
    return () => {
      window.removeEventListener('resize', checkOverflow);
      clearTimeout(timer);
    };
  }, [section]);

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.05, duration: 0.4 }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="block text-left w-full transition-all duration-300 cursor-pointer px-4 py-1"
      style={{ 
        fontFamily: 'BrutalistFont, Arial Black, sans-serif', 
        fontWeight: 900,
        color: hoveredSection === section ? sectionColors[section] : '#000000'
      }}
    >
      <div className="flex items-center text-[32px] md:text-[56px] lg:text-[72px] leading-[1.2] tracking-tight">
        {/* Fixed number part */}
        <span className="shrink-0">#{index + 1}&nbsp;</span>
        
        {/* Text container with overflow */}
        <div 
          ref={containerRef}
          className="overflow-hidden whitespace-nowrap flex-1"
        >
          {isOverflowing ? (
            // Marquee loop for overflowing text
            <motion.div
              className="inline-flex"
              animate={{
                x: hoveredSection === section ? [0, -20, 0] : [0, -scrollDistance]
              }}
              transition={
                hoveredSection === section
                  ? {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  : {
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                      repeatType: "loop"
                    }
              }
            >
              <span ref={textRef} className="inline-block whitespace-nowrap pr-5">
                {section}
              </span>
              <span className="inline-block whitespace-nowrap pr-5">
                {section}
              </span>
            </motion.div>
          ) : (
            // Normal text for non-overflowing
            <motion.span
              ref={textRef}
              className="inline-block whitespace-nowrap"
              animate={hoveredSection === section ? {
                x: [0, -20, 0],
              } : {
                x: 0
              }}
              transition={{
                duration: 2,
                repeat: hoveredSection === section ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              {section}
            </motion.span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

export default function HomePage({ onSectionClick }: HomePageProps) {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [scrollOpacity, setScrollOpacity] = useState(1);

  // Scroll listener to calculate blur opacity
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate how close we are to the bottom (0 = top, 1 = bottom)
      const scrollPercentage = scrollY / (documentHeight - windowHeight);
      
      // Fade out blur when we're in the last 20% of the page
      const fadeStart = 0.7; // Start fading at 70% scroll
      const opacity = scrollPercentage < fadeStart 
        ? 1 
        : Math.max(0, 1 - ((scrollPercentage - fadeStart) / (1 - fadeStart)));
      
      setScrollOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoize handlers
  const handleMouseEnter = useCallback((section: string) => {
    setHoveredSection(section);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredSection(null);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-white p-8 md:p-16 relative"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-4 md:space-y-2 md:-mt-10"
        >
          {sections.map((section, index) => (
            <SectionTitle
              key={section}
              section={section}
              index={index}
              hoveredSection={hoveredSection}
              onMouseEnter={() => handleMouseEnter(section)}
              onMouseLeave={handleMouseLeave}
              onClick={() => onSectionClick(section)}
            />
          ))}
        </motion.div>
      </div>

      {/* Logo - Bottom center on mobile, bottom right on desktop - Fixed position */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:right-16 md:translate-x-0 z-50"
      >
        <img
          src={logoImage}
          alt="Logo"
          className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] object-contain"
        />
      </motion.div>

      {/* Bottom Blur Gradient - Fades out when scrolling to bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollOpacity }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none"
        style={{
          height: '95px',
          background: 'linear-gradient(to top, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.4) 40%, transparent 100%)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          maskImage: 'linear-gradient(to top, black 0%, rgba(0, 0, 0, 0.3) 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, rgba(0, 0, 0, 0.3) 100%)',
        }}
      />
    </motion.div>
  );
}