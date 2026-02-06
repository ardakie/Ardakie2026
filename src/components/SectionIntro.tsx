import { motion } from 'motion/react';
import dinoLogo from 'figma:asset/1dac0bada73c9a675d11784842cbfb9d3f940415.png';
import fryLogo from 'figma:asset/859d7039de2c6dfbce8037bc6e754112df0470b0.png';
import bearLogo from 'figma:asset/f8360a97097976c09d71565fb487148c29f2566c.png';
import luxuryLogo from 'figma:asset/a33b796b9221686891136228ff377a1e289782e1.png';
import gnomesLogo from 'figma:asset/74e760c01457d2b0cdecad53254197af6344d3a5.png';
import heavyRingLogo from 'figma:asset/5a0a3c3497ebcf9e579ea5f2e73ffeaf7b8c26d2.png';
import piggyBankLogo from 'figma:asset/73fb2ca114612038b657e453f518f72149d40069.png';
import fileFlakesLogo from 'figma:asset/f53400a753dd5dc0d90bd05226c0a1e284f50b4e.png';
import multiverseLogo from 'figma:asset/ea234ab423d289573b8a80e1b026eb6de4f712ec.png';

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