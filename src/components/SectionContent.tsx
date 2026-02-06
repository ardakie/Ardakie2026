import { motion } from 'motion/react';
import DinoNuggetContent from './DinoNuggetContent';
import LuxuryTaxContent from './LuxuryTaxContent';
import FryDaggersContent from './FryDaggersContent';
import OzempicBearContent from './OzempicBearContent';
import HomeGnomesContent from './HomeGnomesContent';
import HeavyRingContent from './HeavyRingContent';
import PiggyBankContent from './PiggyBankContent';
import FileFlakesContent from './FileFlakesContent';
import MultiverseBlackMarketContent from './MultiverseBlackMarketContent';
import FiveMinutesSilenceCanContent from './FiveMinutesSilenceCanContent';

interface SectionContentProps {
  section: string;
  onBack: () => void;
}

export default function SectionContent({ section, onBack }: SectionContentProps) {
  // DinoNugget için özel component
  if (section === 'DinoNugget') {
    return <DinoNuggetContent onBack={onBack} />;
  }

  // Luxury Tax için özel component
  if (section === 'Luxury Tax') {
    return <LuxuryTaxContent onBack={onBack} />;
  }

  // Fry Daggers için özel component
  if (section === 'Fry Daggers') {
    return <FryDaggersContent onBack={onBack} />;
  }

  // Ozempic Bear için özel component
  if (section === 'Ozempic Bear') {
    return <OzempicBearContent onBack={onBack} />;
  }

  // Home Gnomes için özel component
  if (section === 'Home Gnomes') {
    return <HomeGnomesContent onBack={onBack} />;
  }

  // Heavy Ring için özel component
  if (section === 'Heavy Ring') {
    return <HeavyRingContent onBack={onBack} />;
  }

  // Piggy Bank için özel component
  if (section === 'Piggy Bank') {
    return <PiggyBankContent onBack={onBack} />;
  }

  // File Flakes için özel component
  if (section === 'File Flakes') {
    return <FileFlakesContent onBack={onBack} />;
  }

  // Multiverse Black Market için özel component
  if (section === 'Multiverse Black Market') {
    return <MultiverseBlackMarketContent onBack={onBack} />;
  }

  // 5 Minutes Silence Can için özel component
  if (section === '5 Minutes Silence Can') {
    return <FiveMinutesSilenceCanContent onBack={onBack} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-white p-8 md:p-16"
    >
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={onBack}
          className="mb-12 hover:opacity-50 transition-opacity duration-200"
          style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
        >
          <span className="text-[24px]">← BACK</span>
        </motion.button>

        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12"
        >
          <div className="text-[48px] md:text-[72px] lg:text-[96px] leading-[0.9] tracking-tight mb-8"
            style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
          >
            {section}
          </div>
        </motion.div>

        {/* Content blocks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="space-y-8"
        >
          <div className="border-4 border-black p-8">
            <div className="text-[24px] md:text-[32px] mb-4" style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}>
              WHAT IS THIS?
            </div>
            <div className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: 'Arial, sans-serif' }}>
              An experimental art project that challenges conventional thinking.
              This is where chaos meets order. Where absurdity becomes meaningful.
            </div>
          </div>

          <div className="border-4 border-black p-8 bg-black text-white">
            <div className="text-[24px] md:text-[32px] mb-4" style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}>
              WHY DOES IT EXIST?
            </div>
            <div className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: 'Arial, sans-serif' }}>
              Because someone had to do it. Because the internet needed this.
              Because normal is boring and we're here to break things.
            </div>
          </div>

          <div className="border-4 border-black p-8">
            <div className="text-[24px] md:text-[32px] mb-4" style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}>
              EXPERIENCE IT
            </div>
            <div className="text-[16px] md:text-[20px] leading-relaxed mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
              This project exists at the intersection of art, technology, and cultural commentary.
              It's meant to provoke, entertain, and question everything you know.
            </div>
            <button className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 transition-colors duration-200" style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}>
              <span className="text-[20px]">LEARN MORE</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-4 border-black p-8">
              <div className="text-[20px] md:text-[24px] mb-2" style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}>
                AVAILABILITY
              </div>
              <div className="text-[16px]" style={{ fontFamily: 'Arial, sans-serif' }}>
                Limited Edition
              </div>
            </div>
            <div className="border-4 border-black p-8 bg-black text-white">
              <div className="text-[20px] md:text-[24px] mb-2" style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}>
                STATUS
              </div>
              <div className="text-[16px]" style={{ fontFamily: 'Arial, sans-serif' }}>
                Currently Active
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}