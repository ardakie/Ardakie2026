import { motion } from 'motion/react';
import logo from '../assets/splash-screen/logo.png';

export default function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 bg-white flex items-center justify-center z-50"
    >
      <div className="text-center">
        <img 
          src={logo} 
          alt="Logo" 
          className="w-[300px] h-[300px] object-contain"
          loading="eager"
          fetchpriority="high"
        />
      </div>
    </motion.div>
  );
}