import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import nugget1 from 'figma:asset/87c6e5633d3b86a90a606b4576db9ad8b897bf65.png';
import nugget2 from 'figma:asset/a87e23c7309a855b0053f7c274dca265018f28b9.png';
import nugget3 from 'figma:asset/e0f540fb96bc0ee236bf97932db3e49a4c3ec7e7.png';
import nugget4 from 'figma:asset/1b901894fd12885c5205e8ec935ca0b0fdf63d3c.png';
import nugget5 from 'figma:asset/36849b0161ba777bbf741817f3817f3d9903e79b.png';
import nugget6 from 'figma:asset/8ff963d42fb8356787a618b3a6f4f440b5c86979.png';
import boxImage from 'figma:asset/bdaee6c6bd1633df650705c0e070dc9b548c71df.png';
import dinoLogo from 'figma:asset/011581239f3540ba8af2291c98cfb1d8ff3ce364.png';
import heroBackground from 'figma:asset/4f7be6a6028066a8e1544e366fe8dcab93cf443d.png';
import heroBackgroundMobile from 'figma:asset/0232ca3c7ee03925508aea660aad850786177447.png';
import burntBadge from 'figma:asset/6188d4c3025f609c0ac141d5ffc840a9136523da.png';

interface DinoNuggetContentProps {
  onBack: () => void;
}

// Dino Nugget data - 6 products
const dinoNuggets = [
  { id: 1, image: nugget1, price: '$450', theme: 'normal' },
  { id: 2, image: nugget2, price: '$450', theme: 'normal' },
  { id: 3, image: nugget3, price: '$450', theme: 'normal' },
  { id: 4, image: nugget4, price: '$450', theme: 'normal' },
  { id: 5, image: nugget5, price: '$450', theme: 'normal' },
  { id: 6, image: nugget6, price: '$1,200', theme: 'burnt' }
];

function DinoNuggetContent({ onBack }: DinoNuggetContentProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedNugget, setSelectedNugget] = useState<typeof dinoNuggets[0] | null>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate random order number
  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#FFF7EE] relative">
      {/* Premium Noise Texture */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.04
        }}
      />

      {/* HEADER - Transparent with Logo and Back button */}
      <div className="absolute top-0 left-0 right-0 z-50 px-4 md:px-8 py-6 flex items-start justify-between">
        {/* Logo - Top Left */}
        <motion.img
          initial={{ opacity: 0, y: isMobile ? 0 : -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0.3 : 0.8, delay: isMobile ? 0 : 0.2 }}
          src={dinoLogo}
          alt="Dino Nugget Logo"
          className="w-[180px] md:w-[240px] h-auto select-none pointer-events-none"
          loading="eager"
        />

        {/* Back Button - Top Right */}
        <motion.button
          initial={{ opacity: 0, x: isMobile ? 0 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: isMobile ? 0 : 0.2, duration: isMobile ? 0.3 : 0.5 }}
          onClick={onBack}
          className="hover:opacity-50 transition-opacity duration-200 text-black"
          style={{ 
            fontFamily: 'BrutalistFont, Arial Black, Arial, Helvetica, sans-serif', 
            fontWeight: 900
          }}
        >
          <span className="text-[24px]">BACK →</span>
        </motion.button>
      </div>

      {/* HERO SECTION - Full Screen Image */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: isMobile ? 0.4 : 0.8 }}
        className="relative w-screen overflow-hidden"
        style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}
      >
        <img 
          src={isMobile ? heroBackgroundMobile : heroBackground}
          alt="Dino Nugget Hero"
          className="w-full h-auto"
          style={{ display: 'block' }}
          loading="eager"
          fetchpriority="high"
        />
      </motion.section>

      {/* PRODUCT GRID SECTION */}
      <section id="menu" className="py-16 md:py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-20">
          {/* Desktop Grid - 2 columns */}
          {!isMobile && (
            <div className="grid grid-cols-2 gap-12">
              {dinoNuggets.map((dino, index) => (
                <motion.div
                  key={dino.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative cursor-pointer"
                >
                  {/* Special Tag for Burnt Edition - Positioned absolutely */}
                  {dino.theme === 'burnt' && (
                    <div className="absolute top-4 left-4 z-10">
                      <img 
                        src={burntBadge}
                        alt="Limited Burnt Edition"
                        className="w-[120px] h-auto"
                        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
                      />
                    </div>
                  )}

                  {/* Nugget Image with Shadow */}
                  <motion.img 
                    src={dino.image}
                    alt={`Dino Nugget ${dino.id}`}
                    className="w-full h-auto"
                    whileHover={{ 
                      scale: 1.05,
                      rotate: dino.theme === 'burnt' ? [0, -1, 1, -1, 0] : 0
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      filter: dino.theme === 'burnt' 
                        ? 'drop-shadow(0 20px 40px rgba(226,33,28,0.4))'
                        : 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))'
                    }}
                    onClick={() => setSelectedNugget(dino)}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Mobile Carousel */}
          {isMobile && (
            <div className="space-y-8">
              {dinoNuggets.map((dino, index) => (
                <motion.div
                  key={dino.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="relative"
                >
                  {/* Badge for Burnt Edition */}
                  {dino.theme === 'burnt' && (
                    <div className="absolute top-4 left-4 z-10">
                      <img 
                        src={burntBadge}
                        alt="Limited Burnt Edition"
                        className="w-[120px] h-auto"
                        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Nugget Image */}
                  <img 
                    src={dino.image}
                    alt={`Dino Nugget ${dino.id}`}
                    className="w-full h-auto"
                    style={{
                      filter: dino.theme === 'burnt' 
                        ? 'drop-shadow(0 20px 40px rgba(226,33,28,0.4))'
                        : 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))'
                    }}
                    loading={index < 2 ? "eager" : "lazy"}
                    onClick={() => setSelectedNugget(dino)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* THE BOX SECTION with Float Animation */}
      <section id="box" className="py-16 md:py-24 bg-[#FFC72C]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left - Image with Float Animation */}
            <motion.div
              initial={{ opacity: 0, x: isMobile ? 0 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: isMobile ? 0.5 : 0.8 }}
              className="order-2 md:order-1"
            >
              <motion.img 
                src={boxImage}
                alt="The Big Box"
                className="w-full h-auto"
                style={{ filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.2))' }}
                loading="lazy"
                animate={{
                  y: [0, -15, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>

            {/* Right - Content */}
            <motion.div
              initial={{ opacity: 0, x: isMobile ? 0 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: isMobile ? 0.5 : 0.8 }}
              className="order-1 md:order-2 space-y-6"
            >
              <h2
                className="tracking-tight"
                style={{
                  fontFamily: 'Arial Black, sans-serif',
                  fontSize: isMobile ? '36px' : '48px',
                  fontWeight: 900,
                  color: '#000'
                }}
              >
                THE BIG BOX
              </h2>

              <p
                style={{
                  fontFamily: 'Arial, sans-serif',
                  fontSize: isMobile ? '16px' : '18px',
                  lineHeight: '1.6',
                  color: '#000'
                }}
              >
                Inspired by iconic fast-food packaging but used as an art display object, not trash. This is the gallery your Dino Nugget deserves.
              </p>

              <p
                className="italic pt-4"
                style={{
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '12px',
                  color: '#666'
                }}
              >
                No fries included. Only existential questions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SCROLLING MARQUEE - Infinite Loop */}
      <section className="py-8 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-20">
          <div 
            className="overflow-hidden bg-[#E2211C] py-3 rounded-full"
            style={{ boxShadow: '0 4px 12px rgba(226,33,28,0.3)' }}
          >
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ 
                duration: 10, 
                repeat: Infinity, 
                ease: 'linear',
                repeatType: 'loop'
              }}
              className="whitespace-nowrap flex"
              style={{
                fontFamily: 'Arial Black, sans-serif',
                fontSize: isMobile ? '12px' : '14px',
                fontWeight: 900,
                color: '#FFF',
                letterSpacing: '0.05em'
              }}
            >
              <span>NOT A TOY – NOT FOOD – LIMITED DROP – NOT NUTRITION FACTS – JUST ART – NOT A TOY – NOT FOOD – LIMITED DROP – NOT NUTRITION FACTS – JUST ART – </span>
              <span>NOT A TOY – NOT FOOD – LIMITED DROP – NOT NUTRITION FACTS – JUST ART – NOT A TOY – NOT FOOD – LIMITED DROP – NOT NUTRITION FACTS – JUST ART – </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* LIMITED EDITION NUMBERS */}
      <section className="py-16 md:py-24 bg-[#FFF7EE]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '6', caption: 'Dino Nugget variants' },
              { number: '1', caption: 'Burned special edition' },
              { number: '9', caption: 'Pieces per variant' },
              { number: 'BIG BOX', caption: '*Included', isItalic: true }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div 
                  className="mb-3"
                  style={{
                    fontFamily: 'Arial Black, sans-serif',
                    fontSize: isMobile ? '48px' : '64px',
                    fontWeight: 900,
                    color: '#E2211C',
                    lineHeight: '1'
                  }}
                >
                  {stat.number}
                </div>
                <div 
                  style={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: isMobile ? '13px' : '15px',
                    color: '#000',
                    fontWeight: 600,
                    fontStyle: stat.isItalic ? 'italic' : 'normal'
                  }}
                >
                  {stat.caption}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#E2211C] py-12">
        <div className="max-w-[1440px] mx-auto px-4 md:px-20 text-center">
          <div 
            className="mb-4"
            style={{
              fontFamily: 'Arial Black, sans-serif',
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: 900,
              color: '#FFF'
            }}
          >
            DINO NUGGETS
          </div>
          <p 
            className="mb-6"
            style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.8)'
            }}
          >
            Not a meal. An art object.
          </p>
        </div>
      </footer>

      {/* PRODUCT DETAIL POP-UP */}
      {selectedNugget && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.02)',
            backdropFilter: 'blur(2px)'
          }}
          onClick={() => setSelectedNugget(null)}
        >
          {/* Close Button - Top Right */}
          <button
            onClick={() => setSelectedNugget(null)}
            className="fixed top-4 md:top-8 right-4 md:right-8 z-[1001] w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black text-white hover:bg-gray-800 transition-colors border-2 border-black"
            style={{
              fontFamily: 'Arial Black, sans-serif',
              fontSize: '24px'
            }}
          >
            ×
          </button>

          {/* MOBILE LAYOUT - Single Column */}
          {isMobile && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md max-h-[85vh] overflow-y-auto bg-white rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Receipt */}
              <div 
                className="bg-white p-6 relative overflow-hidden"
                style={{
                  fontFamily: 'Courier New, monospace',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: '#000',
                  paddingTop: '28px',
                  paddingBottom: '28px',
                  clipPath: 'polygon(0 10px, 5% 0, 10% 10px, 15% 0, 20% 10px, 25% 0, 30% 10px, 35% 0, 40% 10px, 45% 0, 50% 10px, 55% 0, 60% 10px, 65% 0, 70% 10px, 75% 0, 80% 10px, 85% 0, 90% 10px, 95% 0, 100% 10px, 100% calc(100% - 10px), 95% 100%, 90% calc(100% - 10px), 85% 100%, 80% calc(100% - 10px), 75% 100%, 70% calc(100% - 10px), 65% 100%, 60% calc(100% - 10px), 55% 100%, 50% calc(100% - 10px), 45% 100%, 40% calc(100% - 10px), 35% 100%, 30% calc(100% - 10px), 25% 100%, 20% calc(100% - 10px), 15% 100%, 10% calc(100% - 10px), 5% 100%, 0 calc(100% - 10px))'
                }}
              >
                {/* Receipt Header */}
                <div className="text-center mb-6" style={{ fontWeight: 'bold' }}>
                  <div style={{ fontSize: '16px', marginBottom: '8px' }}>DINO NUGGETS™ RECEIPT</div>
                  <div style={{ fontSize: '11px' }}>THIS IS NOT FAST FOOD.</div>
                </div>

                {/* Order Info */}
                <div className="mb-4">
                  <div>ORDER: #{orderNumber}</div>
                  <div>DATE: {currentDate}</div>
                </div>

                {/* Divider */}
                <div className="my-4" style={{ borderTop: '1px dashed #000' }} />

                {/* Item Header */}
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  <div className="flex justify-between">
                    <span>ITEM</span>
                    <span>QTY     PRICE</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-2" style={{ borderTop: '1px dashed #000' }} />

                {/* Items */}
                <div className="my-4">
                  <div className="flex justify-between items-start mb-2">
                    <span>DINONUGGET{selectedNugget.id}</span>
                    <span className="ml-4">1     {selectedNugget.price.replace('$', '$ ')}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span>NUGGET BOX</span>
                    <span className="ml-4">1     $ 0</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-2" style={{ borderTop: '1px dashed #000' }} />

                {/* Total */}
                <div style={{ fontWeight: 'bold', fontSize: '14px', marginTop: '8px', marginBottom: '8px' }}>
                  <div className="flex justify-between">
                    <span>TOTAL</span>
                    <span>{selectedNugget.price.replace('$', '$ ')}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-4" style={{ borderTop: '1px dashed #000' }} />

                {/* Included Items */}
                <div className="mb-4">
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>
                    INCLUDED WITH PURCHASE:
                  </div>
                  <div className="space-y-1 text-center" style={{ fontSize: '12px' }}>
                    <div>✓ GIANT DINONUGGET</div>
                    <div>✓ GIANT ART BOX PACKAGING</div>
                    <div>✓ AUTHENTICITY CERTIFICATE</div>
                    <div>✓ ZERO NUTRITION VALUE</div>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-4" style={{ borderTop: '1px dashed #000' }} />

                {/* Footer */}
                <div className="text-center mb-4" style={{ fontWeight: 'bold' }}>
                  DINO NUGGETS™ — 2025
                </div>

                {/* SOLD OUT Button */}
                <button
                  className="w-full py-3 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-200 mb-4"
                  style={{
                    fontFamily: 'Arial Black, sans-serif',
                    fontSize: '14px',
                    fontWeight: 900,
                    letterSpacing: '0.05em'
                  }}
                >
                  SOLD OUT
                </button>

                {/* Divider */}
                <div className="my-4" style={{ borderTop: '1px dashed #000' }} />

                {/* Warning */}
                <div className="text-center" style={{ fontSize: '11px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>WARNING:</div>
                  <div>NOT EDIBLE. NOT A TOY.</div>
                  <div>DO NOT DIP IN ANY SAUCE.</div>
                  <div>DO NOT LEAVE NEAR CHILDREN,</div>
                  <div>COLLECTORS, OR HEAT SOURCES.</div>
                </div>
              </div>

              {/* Product Image */}
              <div className="bg-transparent p-6 border-t-2 border-black relative">
                {selectedNugget.theme === 'burnt' && (
                  <div className="absolute top-4 left-4 z-10">
                    <img 
                      src={burntBadge}
                      alt="Limited Burnt Edition"
                      className="w-[80px] h-auto"
                      style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
                    />
                  </div>
                )}
                <img
                  src={selectedNugget.image}
                  alt={`Dino Nugget ${selectedNugget.id}`}
                  className="w-full h-auto"
                  style={{
                    filter: selectedNugget.theme === 'burnt' 
                      ? 'drop-shadow(0 20px 40px rgba(226,33,28,0.4))'
                      : 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
                    maxHeight: '400px',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* DESKTOP LAYOUT - Split View */}
          {!isMobile && (
            <>
              {/* RECEIPT - LEFT SIDE */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="fixed left-8 md:left-16 top-1/2 -translate-y-1/2 w-[320px] md:w-[380px] z-[1000]"
                onClick={(e) => e.stopPropagation()}
              >
                <div 
                  className="bg-white shadow-2xl p-6 relative"
                  style={{
                    fontFamily: 'Courier New, monospace',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    color: '#000',
                    paddingTop: '28px',
                    paddingBottom: '28px'
                  }}
                >
                  {/* Top serrated edge - transparent zigzag cutout */}
                  <svg 
                    className="absolute top-0 left-0 right-0 w-full" 
                    height="10" 
                    viewBox="0 0 100 10" 
                    preserveAspectRatio="none"
                    style={{ display: 'block' }}
                  >
                    <defs>
                      <pattern id="zigzagTopDesktop" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M0,10 L5,0 L10,10 Z" fill="white"/>
                      </pattern>
                    </defs>
                    <rect width="100" height="10" fill="url(#zigzagTopDesktop)"/>
                  </svg>
                  
                  {/* Bottom serrated edge - transparent zigzag cutout */}
                  <svg 
                    className="absolute bottom-0 left-0 right-0 w-full" 
                    height="10" 
                    viewBox="0 0 100 10" 
                    preserveAspectRatio="none"
                    style={{ display: 'block' }}
                  >
                    <defs>
                      <pattern id="zigzagBottomDesktop" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M0,0 L5,10 L10,0 Z" fill="white"/>
                      </pattern>
                    </defs>
                    <rect width="100" height="10" fill="url(#zigzagBottomDesktop)"/>
                  </svg>
                  
                  {/* Receipt Header */}
                  <div className="text-center mb-6" style={{ fontWeight: 'bold' }}>
                    <div style={{ fontSize: '16px', marginBottom: '8px' }}>DINO NUGGETS™ RECEIPT</div>
                    <div style={{ fontSize: '11px' }}>THIS IS NOT FAST FOOD.</div>
                  </div>

                  {/* Order Info */}
                  <div className="mb-4">
                    <div>ORDER: #{orderNumber}</div>
                    <div>DATE: {currentDate}</div>
                  </div>

                  {/* Divider */}
                  <div className="my-4" style={{ borderTop: '1px dashed #000' }} />

                  {/* Item Header */}
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    <div className="flex justify-between">
                      <span>ITEM</span>
                      <span>QTY     PRICE</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-2" style={{ borderTop: '1px dashed #000' }} />

                  {/* Items */}
                  <div className="my-4">
                    <div className="flex justify-between items-start mb-2">
                      <span>DINONUGGET{selectedNugget.id}</span>
                      <span className="ml-4">1     {selectedNugget.price.replace('$', '$ ')}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span>NUGGET BOX</span>
                      <span className="ml-4">1     $ 0</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-2" style={{ borderTop: '1px dashed #000' }} />

                  {/* Total */}
                  <div style={{ fontWeight: 'bold', fontSize: '14px', marginTop: '8px', marginBottom: '8px' }}>
                    <div className="flex justify-between">
                      <span>TOTAL</span>
                      <span>{selectedNugget.price.replace('$', '$ ')}</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-4" style={{ borderTop: '1px dashed #000' }} />

                  {/* Included Items */}
                  <div className="mb-4">
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>
                      INCLUDED WITH PURCHASE:
                    </div>
                    <div className="space-y-1 text-center" style={{ fontSize: '12px' }}>
                      <div>✓ GIANT DINONUGGET</div>
                      <div>✓ GIANT ART BOX PACKAGING</div>
                      <div>✓ AUTHENTICITY CERTIFICATE</div>
                      <div>✓ ZERO NUTRITION VALUE</div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-4" style={{ borderTop: '1px dashed #000' }} />

                  {/* Footer */}
                  <div className="text-center mb-4" style={{ fontWeight: 'bold' }}>
                    DINO NUGGETS™ — 2025
                  </div>

                  {/* SOLD OUT Button */}
                  <button
                    className="w-full py-3 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-200 mb-4"
                    style={{
                      fontFamily: 'Arial Black, sans-serif',
                      fontSize: '14px',
                      fontWeight: 900,
                      letterSpacing: '0.05em'
                    }}
                  >
                    SOLD OUT
                  </button>

                  {/* Divider */}
                  <div className="my-4" style={{ borderTop: '1px dashed #000' }} />

                  {/* Warning */}
                  <div className="text-center" style={{ fontSize: '11px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>WARNING:</div>
                    <div>NOT EDIBLE. NOT A TOY.</div>
                    <div>DO NOT DIP IN ANY SAUCE.</div>
                    <div>DO NOT LEAVE NEAR CHILDREN,</div>
                    <div>COLLECTORS, OR HEAT SOURCES.</div>
                  </div>
                </div>
              </motion.div>

              {/* PRODUCT IMAGE - RIGHT SIDE */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="fixed right-8 md:right-16 top-1/2 -translate-y-1/2 w-[400px] md:w-[500px] z-[1000]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  {selectedNugget.theme === 'burnt' && (
                    <div className="absolute -top-4 -left-4 z-10">
                      <img 
                        src={burntBadge}
                        alt="Limited Burnt Edition"
                        className="w-[100px] h-auto"
                        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
                      />
                    </div>
                  )}
                  <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.15, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    src={selectedNugget.image}
                    alt={`Dino Nugget ${selectedNugget.id}`}
                    className="w-full h-auto"
                    style={{
                      filter: selectedNugget.theme === 'burnt' 
                        ? 'drop-shadow(0 20px 40px rgba(226,33,28,0.4))'
                        : 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
                      maxHeight: '600px',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default DinoNuggetContent;