import { motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { Power } from 'lucide-react';
import posterImage from 'figma:asset/ebb8bb32b8e0dea89f86ff9acdcc47b2bd33e4e1.png';

interface FiveMinutesSilenceCanContentProps {
  onBack: () => void;
}

export default function FiveMinutesSilenceCanContent({ onBack }: FiveMinutesSilenceCanContentProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setHasEnded(false);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setHasEnded(true);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 w-full h-full bg-black"
    >
      {/* Back button - Sol üst köşede */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={onBack}
        className="fixed top-8 left-8 z-50 hover:opacity-50 transition-opacity duration-200 text-white"
        style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
      >
        <span className="text-[20px] md:text-[24px]">← BACK</span>
      </motion.button>

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

        {/* Power Button - Video oynamadığında göster */}
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="absolute bottom-16 md:bottom-24 left-1/2 -translate-x-1/2 z-50"
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

              {/* Label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white text-center"
                style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
              >
                <div className="text-[16px] md:text-[20px] tracking-wider">
                  {hasEnded ? 'REPLAY' : 'PRESS TO START'}
                </div>
              </motion.div>
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}