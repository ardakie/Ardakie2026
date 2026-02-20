import { motion } from 'motion/react';
import dinoLogo from '../assets/section-intro/dinoLogo.png';
import fryLogo from '../assets/section-intro/fryLogo.png';
import bearLogo from '../assets/section-intro/bearLogo.png';
import luxuryLogo from '../assets/section-intro/luxuryLogo.png';
import gnomesLogo from '../assets/section-intro/gnomesLogo.png';
import heavyRingLogo from '../assets/section-intro/heavyRingLogo.png';
import piggyBankLogo from '../assets/section-intro/piggyBankLogo.png';
import fileFlakesLogo from '../assets/section-intro/fileFlakesLogo.png';
import multiverseLogo from '../assets/section-intro/multiverseLogo.png';

interface SectionIntroProps {
  section: string;
}

export default function SectionIntro({ section }: SectionIntroProps) {
  const isDinoNugget = section === 'DinoNugget';
  const isFryDaggers = section === 'Fry Daggers';
  const isOzempicBear = section === 'Ozempic Bear';
  const isLuxuryTax = section === 'Luxury Tax';
  const isHomeGnomes = section === 'Home Gnomes';
  const isHeavyRing = section === 'Heavy Ring';
  const isPiggyBank = section === 'Piggy Bank';
  const isFileFlakes = section === 'File Flakes';
  const isMultiverse = section === 'Multiverse Black Market';
  
  // Arka plan rengini belirle
  let bgColor = 'white';
  let bgGradient = '';
  if (isDinoNugget) bgColor = '#f9a70f';
  if (isFryDaggers) bgColor = '#000000';
  if (isOzempicBear) bgColor = '#dd0707';
  if (isLuxuryTax) bgColor = '#000000';
  if (isHomeGnomes) bgColor = '#73a83b';
  if (isHeavyRing) bgColor = '#999999';
  if (isPiggyBank) bgGradient = 'linear-gradient(to bottom, #e9d88e 0%, #deacb0 50%, #bcd7d4 100%)';
  if (isFileFlakes) bgColor = '#FFC107';
  if (isMultiverse) bgColor = '#FFFFFF';
  
  // Text rengi
  const textColor = (isFryDaggers || isLuxuryTax) ? '#ffffff' : '#000000';
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 flex items-center justify-center z-40"
      style={{ 
        background: isPiggyBank ? bgGradient : bgColor
      }}
    >
      <div className="max-w-5xl px-8 text-center">
        {isDinoNugget ? (
          <motion.img
            src={dinoLogo}
            alt="DinoNugget Logo"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-[600px] h-auto mx-auto"
          />
        ) : isFryDaggers ? (
          <motion.img
            src={fryLogo}
            alt="Fry Daggers Logo"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-[600px] h-auto mx-auto"
          />
        ) : isOzempicBear ? (
          <motion.img
            src={bearLogo}
            alt="Ozempic Bear Logo"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-[600px] h-auto mx-auto"
          />
        ) : isLuxuryTax ? (
          <motion.img
            src={luxuryLogo}
            alt="Luxury Tax Logo"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-[600px] h-auto mx-auto"
          />
        ) : isHomeGnomes ? (
          <motion.img
            src={gnomesLogo}
            alt="Home Gnomes Logo"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-[600px] h-auto mx-auto"
          />
        ) : isHeavyRing ? (
          <motion.img
            src={heavyRingLogo}
            alt="Heavy Ring Logo"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-[600px] h-auto mx-auto"
          />
        ) : isPiggyBank ? (
          <motion.img
            src={piggyBankLogo}
            alt="Piggy Bank Logo"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-[600px] h-auto mx-auto"
          />
        ) : isFileFlakes ? (
          <motion.img
            src={fileFlakesLogo}
            alt="File Flakes Logo"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-[600px] h-auto mx-auto"
          />
        ) : isMultiverse ? (
          <motion.img
            src={multiverseLogo}
            alt="Multiverse Logo"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-[600px] h-auto mx-auto"
          />
        ) : (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-[48px] md:text-[80px] lg:text-[120px] leading-[0.9] tracking-tight"
            style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900, color: textColor }}
          >
            {section}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}