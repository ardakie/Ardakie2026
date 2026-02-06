import { motion } from 'motion/react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { AspectRatio } from './ui/aspect-ratio';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import gnomesImage from 'figma:asset/da7a3c1fe8d58d8bb395156f10749f56c83afe45.png';
import maskImage from 'figma:asset/e76556b2c0ebc8f445d86596c24b2090479fadcd.png';
import gnomesImageMobile from 'figma:asset/e0db25129eaacbca56f1ac856a99734ad1cfc5fc.png';
import maskImageMobile from 'figma:asset/50b4e0e75a56e30dd5d7c3c83e3b26a7c66b1e8b.png';
import logoImage from 'figma:asset/c92828cc1e101d259fe01f30c8b43a5b2b94cdab.png';
import product1 from 'figma:asset/e87a0f6eedcf2605de14105ebff329021b199ebd.png';
import product2 from 'figma:asset/a90d406f96bba310c5c07a56b56963589a6e2ccc.png';
import product3 from 'figma:asset/84783afae28516fb279cc3a06a68209f8d7bc557.png';
import product4 from 'figma:asset/c5e11c813c8241f445740d2e4bab7bc0a4fe2052.png';
import product4Image2 from 'figma:asset/9c577e82f57156c6a76f20178ec6fefcd299f7a0.png';

interface HomeGnomesContentProps {
  onBack: () => void;
}

export default function HomeGnomesContent({ onBack }: HomeGnomesContentProps) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [currentTooltipIndex, setCurrentTooltipIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);
  const [currentImageIndexes, setCurrentImageIndexes] = useState([0, 0, 0, 0]); // Track current image for each product
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null); // Track selected product for modal
  const [modalImageIndex, setModalImageIndex] = useState(0); // Track current image in modal
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskDataRef = useRef<ImageData | null>(null);

  const tooltipTexts = ['HOME', 'GNOMES', '&*#@!'];

  // Product images arrays
  const productImages = [
    [product1], // Product 1 - single image
    [product2], // Product 2 - single image
    [product3], // Product 3 - single image
    [product4, product4Image2], // Product 4 - 2 images
  ];

  const productNames = ['Home Gnomes 001', 'Home Gnomes 002', 'Home Gnomes 1/2', 'Gnomes'];
  
  const productDescriptions = [
    'Made from solid, weather-resistant vinyl designed for long-term outdoor use.\n• UV-stable colors prevent fading under direct sunlight.\n• Single-piece molded construction for durability and moisture resistance.\n• Reinforced base ensures stable placement on grass, soil, or hard surfaces.',
    'Made from solid, weather-resistant vinyl designed for long-term outdoor use.\n• UV-stable colors prevent fading under direct sunlight.\n• Single-piece molded construction for durability and moisture resistance.\n• Reinforced base ensures stable placement on grass, soil, or hard surfaces.',
    'Made from solid, weather-resistant vinyl designed for long-term outdoor use.\n• UV-stable colors prevent fading under direct sunlight.\n• Single-piece molded construction for durability and moisture resistance.\n• Reinforced base ensures stable placement on grass, soil, or hard surfaces.',
    'Gnormes oil painting on canvas',
  ];

  const productPrices = ['$400', '$400', '$400', '$2100'];

  // Handle product click to open modal
  const handleProductClick = (productIndex: number) => {
    setSelectedProductIndex(productIndex);
    setModalImageIndex(0); // Reset to first image
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedProductIndex(null);
    setModalImageIndex(0);
  };

  // Handle modal image navigation
  const handleModalPrevImage = () => {
    if (selectedProductIndex !== null) {
      const imagesCount = productImages[selectedProductIndex].length;
      setModalImageIndex((prev) => (prev - 1 + imagesCount) % imagesCount);
    }
  };

  const handleModalNextImage = () => {
    if (selectedProductIndex !== null) {
      const imagesCount = productImages[selectedProductIndex].length;
      setModalImageIndex((prev) => (prev + 1) % imagesCount);
    }
  };

  // Handle image navigation
  const handlePrevImage = (productIndex: number) => {
    setCurrentImageIndexes(prev => {
      const newIndexes = [...prev];
      const imagesCount = productImages[productIndex].length;
      newIndexes[productIndex] = (prev[productIndex] - 1 + imagesCount) % imagesCount;
      return newIndexes;
    });
  };

  const handleNextImage = (productIndex: number) => {
    setCurrentImageIndexes(prev => {
      const newIndexes = [...prev];
      const imagesCount = productImages[productIndex].length;
      newIndexes[productIndex] = (prev[productIndex] + 1) % imagesCount;
      return newIndexes;
    });
  };

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
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = maskImage;
    
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
      
      // Get the actual image element to calculate object-cover offset
      const imgElement = heroRef.current.querySelector('img');
      if (!imgElement) return;
      
      // Calculate the actual rendered image dimensions and position due to object-cover
      const containerAspect = rect.width / rect.height;
      const imgAspect = canvasRef.current.width / canvasRef.current.height;
      
      let renderedWidth, renderedHeight, offsetX, offsetY;
      
      if (containerAspect > imgAspect) {
        // Container is wider - image fills width
        renderedWidth = rect.width;
        renderedHeight = rect.width / imgAspect;
        offsetX = 0;
        offsetY = (rect.height - renderedHeight) / 2;
      } else {
        // Container is taller - image fills height
        renderedHeight = rect.height;
        renderedWidth = rect.height * imgAspect;
        offsetX = (rect.width - renderedWidth) / 2;
        offsetY = 0;
      }
      
      // Adjust mouse coordinates relative to the actual rendered image
      const adjustedX = x - offsetX;
      const adjustedY = y - offsetY;
      
      // Convert to mask coordinates
      const scaleX = canvasRef.current.width / renderedWidth;
      const scaleY = canvasRef.current.height / renderedHeight;
      const maskX = Math.floor(adjustedX * scaleX);
      const maskY = Math.floor(adjustedY * scaleY);
      
      // Check if coordinates are within bounds
      if (maskX >= 0 && maskX < canvasRef.current.width && 
          maskY >= 0 && maskY < canvasRef.current.height) {
        
        // Get pixel data (R, G, B, A)
        const pixelIndex = (maskY * canvasRef.current.width + maskX) * 4;
        const alpha = maskDataRef.current.data[pixelIndex + 3];
        
        // Show tooltip only if alpha > 0 (not transparent)
        if (alpha > 0) {
          const wasVisible = tooltipVisible;
          setTooltipVisible(true);
          setTooltipPosition({ x, y });
          
          // Cycle to next tooltip when it reappears
          if (!wasVisible) {
            setCurrentTooltipIndex((prev) => (prev + 1) % tooltipTexts.length);
          }
        } else {
          setTooltipVisible(false);
        }
      } else {
        setTooltipVisible(false);
      }
    }
  }, [tooltipVisible, tooltipTexts.length]);

  return (
    <div className="relative bg-white text-black">
      {/* Max-width container for ultra-wide screens */}
      <div className="max-w-[1920px] mx-auto relative">
        {/* LOGO - TOP LEFT (absolute instead of fixed) */}
        <div className="absolute top-6 left-6 z-20">
          <img 
            src={logoImage} 
            alt="Home Gnomes Logo" 
            className="w-36 md:w-72 h-auto"
            loading="eager"
            fetchpriority="high"
          />
        </div>

        {/* BACK BUTTON - TOP RIGHT (absolute instead of fixed) */}
        <div className="absolute top-6 right-6 z-20">
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onBack}
            className="hover:opacity-50 transition-opacity duration-200 text-black mb-2"
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
            DROP #05 – SOLD OUT
          </span>
        </div>

        {/* MAIN CONTENT */}
        <div className="h-screen overflow-hidden">
          {/* HERO SECTION - FIXED HEIGHT */}
          <section className="h-screen flex flex-col">
            {/* Hero Image with Tooltip - FULL WIDTH, FIXED */}
            <div
              ref={heroRef}
              className="relative w-full h-full cursor-crosshair bg-white"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setTooltipVisible(true)}
              onMouseLeave={() => setTooltipVisible(false)}
            >
              <img
                src={gnomesImage}
                alt="Home Gnomes"
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
                fetchpriority="high"
              />

              {/* PRODUCT GRID - 2x2 CENTER */}
              <motion.div 
                className="absolute md:fixed left-1/2 top-40 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 z-30 w-[90%] md:w-[90%] max-w-[350px] md:max-w-[550px] max-h-[calc(100vh-12rem)] md:max-h-none overflow-y-auto md:overflow-visible"
                animate={{ opacity: selectedProductIndex === null ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ pointerEvents: selectedProductIndex === null ? 'auto' : 'none' }}
              >
                {/* Semi-transparent black background containing the grid */}
                <div className="relative bg-black/30 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Render products dynamically */}
                    {productImages.map((images, productIndex) => (
                      <div 
                        key={productIndex}
                        onClick={() => handleProductClick(productIndex)}
                        className="cursor-pointer"
                      >
                        <AspectRatio ratio={4/5}>
                          <div className="relative overflow-hidden rounded-2xl group">
                            <motion.img
                              key={`${productIndex}-${currentImageIndexes[productIndex]}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              src={images[currentImageIndexes[productIndex]]} 
                              alt={`Gnome Product ${productIndex + 1}`} 
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            
                            {/* Navigation arrows - only show if multiple images */}
                            {images.length > 1 && (
                              <>
                                {/* Left Arrow */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrevImage(productIndex);
                                  }}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10 opacity-0 group-hover:opacity-100"
                                >
                                  <ChevronLeft size={28} strokeWidth={2.5} />
                                </button>

                                {/* Right Arrow */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNextImage(productIndex);
                                  }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10 opacity-0 group-hover:opacity-100"
                                >
                                  <ChevronRight size={28} strokeWidth={2.5} />
                                </button>

                                {/* Dots Pagination */}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                  {images.map((_, dotIndex) => (
                                    <button
                                      key={dotIndex}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndexes(prev => {
                                          const newIndexes = [...prev];
                                          newIndexes[productIndex] = dotIndex;
                                          return newIndexes;
                                        });
                                      }}
                                      className={`w-2 h-2 rounded-full transition-all ${
                                        currentImageIndexes[productIndex] === dotIndex 
                                          ? 'bg-gray-400' 
                                          : 'bg-gray-400/40'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </AspectRatio>
                        <p className="text-white mt-2 text-center" style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700 }}>
                          {productNames[productIndex]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Tooltip bubble */}
              {tooltipVisible && (
                <motion.div
                  key={currentTooltipIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute pointer-events-none bg-white border-[5px] border-black rounded-2xl px-10 py-5 text-[28px] tracking-wide shadow-2xl"
                  style={{
                    left: `${tooltipPosition.x + 50}px`,
                    top: `${tooltipPosition.y - 100}px`,
                    fontFamily: 'Comic Sans MS, cursive',
                    fontWeight: 700,
                  }}
                >
                  {tooltipTexts[currentTooltipIndex]}
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

        {/* MODAL */}
        {selectedProductIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* LEFT SIDE - Image Slider */}
              <div className="md:w-1/2 relative bg-gray-100 flex-shrink-0">
                <div className="relative h-[50vh] md:h-[90vh] group overflow-hidden">
                  <motion.img
                    key={modalImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    src={productImages[selectedProductIndex][modalImageIndex]}
                    alt={`Gnome Product ${selectedProductIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation arrows - only show if multiple images */}
                  {productImages[selectedProductIndex].length > 1 && (
                    <>
                      {/* Left Arrow */}
                      <button
                        onClick={handleModalPrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft size={40} strokeWidth={2.5} />
                      </button>

                      {/* Right Arrow */}
                      <button
                        onClick={handleModalNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight size={40} strokeWidth={2.5} />
                      </button>

                      {/* Dots Pagination */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {productImages[selectedProductIndex].map((_, dotIndex) => (
                          <button
                            key={dotIndex}
                            onClick={() => setModalImageIndex(dotIndex)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                              modalImageIndex === dotIndex 
                                ? 'bg-gray-400' 
                                : 'bg-gray-400/40'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE - Product Info with black backdrop */}
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between relative bg-black/50 backdrop-blur-md flex-shrink-0">
                {/* Close Button - Top Right */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors"
                >
                  <X size={32} strokeWidth={2.5} />
                </button>

                <div className="flex-1 flex flex-col justify-center gap-6">
                  {/* Product Name */}
                  <h2 
                    className="text-white"
                    style={{ 
                      fontFamily: 'Helvetica, Arial, sans-serif', 
                      fontWeight: 700,
                      fontSize: '32px'
                    }}
                  >
                    {productNames[selectedProductIndex]}
                  </h2>

                  {/* Price */}
                  <p 
                    className="text-white"
                    style={{ 
                      fontFamily: 'Helvetica, Arial, sans-serif', 
                      fontWeight: 700,
                      fontSize: '28px'
                    }}
                  >
                    {productPrices[selectedProductIndex]}
                  </p>

                  {/* Description */}
                  <p 
                    className="text-gray-200 whitespace-pre-line"
                    style={{ 
                      fontFamily: 'Helvetica, Arial, sans-serif', 
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '1.6'
                    }}
                  >
                    {productDescriptions[selectedProductIndex]}
                  </p>

                  {/* BUY Button */}
                  <button
                    className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors mt-4 w-fit flex items-center justify-center"
                    style={{
                      fontFamily: 'Arial Black, sans-serif',
                      fontWeight: 900,
                      fontSize: '16px',
                      letterSpacing: '0.05em',
                    }}
                  >
                    SOLD OUT
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}