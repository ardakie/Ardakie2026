import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

interface EntryVerificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Universe {
  id: string;
  name: string;
  subtitle: string;
  planets: string[];
}

const universes: Universe[] = [
  {
    id: 'universe-0',
    name: 'Universe-0',
    subtitle: 'ΛCDM / Baseline Reality',
    planets: [
      'Earth (Prime-3)',
      'Solara-7',
      'Kepler-X1',
      'Aurelis-4',
      'Terra-Null',
      'Cobaltis-1',
      'Hadeon-5',
      'New Europa-6',
      'Eclipta-0',
      'Marethon-2',
      'Cryo-Sphere-9',
      'Astra-Fold',
      'Lithos-3',
      'Vantor-8',
      'Cyan-Ridge',
      'Nivara-12'
    ]
  },
  {
    id: 'universe-3w',
    name: 'Universe-3W',
    subtitle: 'Cold Vector Continuum',
    planets: ['Vector-Haven', 'Frostline-0', 'Null-Orbit', 'Tundra-9']
  },
  {
    id: 'universe-9r',
    name: 'Universe-9R',
    subtitle: 'Echo-Void Cluster',
    planets: ['Echo-Prime', 'Rift-Garden', 'Voidreach-L1']
  },
  {
    id: 'universe-2h',
    name: 'Universe-2H',
    subtitle: 'Biolattice Domain',
    planets: ['Bio-Harbor', 'Koral-Stem', 'Lattice-Core']
  },
  {
    id: 'universe-7p',
    name: 'Universe-7P',
    subtitle: 'Fracture Halo Sector',
    planets: ['Fractura', 'Halo-Break', 'Shard-11']
  },
  {
    id: 'universe-11q',
    name: 'Universe-11Q',
    subtitle: 'Dimensional Flux Field',
    planets: ['Flux-Delta', 'Resonance-3', 'Quanta-Run']
  },
  {
    id: 'universe-a4',
    name: 'Universe-A4',
    subtitle: 'Metallic Growth Stratum',
    planets: ['Alloy-Field', 'Metal-Bloom', 'Gradient-Root']
  },
  {
    id: 'universe-z2',
    name: 'Universe-Z2',
    subtitle: 'Temporal Noise Realm',
    planets: ['Noise-Mass', 'Static-Wave', 'Chrono-Dust']
  },
  {
    id: 'universe-k8',
    name: 'Universe-K8',
    subtitle: 'Static Matter Loop',
    planets: ['Loop-Stone', 'Kinetic-Zero', 'Orbit-Fold']
  },
  {
    id: 'universe-v1',
    name: 'Universe-V1',
    subtitle: 'Negative Resolution Layer',
    planets: ['Neg-Resolution', 'Thin-Layer', 'Anti-Edge']
  },
  {
    id: 'universe-m0',
    name: 'Universe-M0',
    subtitle: 'Parallax Origin Fold',
    planets: ['Parallax-Womb', 'Origin-Spiral', 'Fold-Nest']
  }
];

export default function EntryVerificationPopup({ isOpen, onClose }: EntryVerificationPopupProps) {
  const [selectedUniverse, setSelectedUniverse] = useState(universes[0]);
  const [selectedPlanet, setSelectedPlanet] = useState(universes[0].planets[0]);
  const [isUniverseOpen, setIsUniverseOpen] = useState(false);
  const [isPlanetOpen, setIsPlanetOpen] = useState(false);
  const [showPlanet, setShowPlanet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Disable body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Show planet selector after modal appears
      setTimeout(() => {
        setShowPlanet(true);
      }, 200);
    }
  }, [isOpen]);

  const handleUniverseSelect = useCallback((universe: Universe) => {
    setSelectedUniverse(universe);
    setSelectedPlanet(universe.planets[0]);
    setIsUniverseOpen(false);
  }, []);

  const handlePlanetSelect = useCallback((planet: string) => {
    setSelectedPlanet(planet);
    setIsPlanetOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - No blur for performance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 bg-black/25 z-[100]"
            style={{ 
              pointerEvents: 'auto'
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] bg-white rounded-2xl shadow-2xl"
            style={{
              width: isMobile ? '90%' : '500px',
              maxWidth: '500px',
              padding: isMobile ? '32px 24px' : '40px 32px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              pointerEvents: 'auto',
              transform: 'translate(-50%, -50%) translateZ(0)',
              willChange: 'transform, opacity'
            }}
          >
            {/* Grain Texture */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                opacity: 0.02,
                mixBlendMode: 'multiply'
              }}
            />

            {/* Header */}
            <div className="text-center mb-8">
              <h2 
                style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontWeight: 200,
                  fontSize: isMobile ? '20px' : '23px',
                  letterSpacing: '-0.01em',
                  color: '#000',
                  marginBottom: '8px'
                }}
              >
                Entry Verification
              </h2>
              <p 
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: isMobile ? '13px' : '14px',
                  color: 'rgba(0,0,0,0.6)',
                  fontWeight: 400
                }}
              >
                Select your origin to proceed.
              </p>
            </div>

            {/* Universe Selector */}
            <div className="mb-6" style={{ position: 'relative', zIndex: isUniverseOpen ? 25 : 10, overflow: 'visible' }}>
              <label 
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.05em',
                  color: 'rgba(0,0,0,0.5)',
                  display: 'block',
                  marginBottom: '8px',
                  textTransform: 'uppercase'
                }}
              >
                Universe / Evren
              </label>

              {/* Dropdown Button */}
              <div className="relative">
                <button
                  onClick={() => setIsUniverseOpen(!isUniverseOpen)}
                  className="w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-200"
                  style={{
                    border: '1px solid rgba(0,0,0,0.1)',
                    background: '#fff',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: isMobile ? '14px' : '15px',
                    color: '#000',
                    textAlign: 'left',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div style={{ fontWeight: 500 }}>{selectedUniverse.name}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', marginTop: '2px' }}>
                        {selectedUniverse.subtitle}
                      </div>
                    </div>
                    {selectedUniverse.id === 'universe-0' && (
                      <motion.div
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, times: [0, 0.5, 1] }}
                      >
                        <MapPin className="w-4 h-4" style={{ fill: '#000', stroke: 'none' }} />
                      </motion.div>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: isUniverseOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5" style={{ color: 'rgba(0,0,0,0.4)' }} />
                  </motion.div>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isUniverseOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl z-50 overflow-y-auto"
                      style={{
                        border: '1px solid rgba(0,0,0,0.08)',
                        maxHeight: '300px',
                        overflowX: 'hidden',
                        WebkitOverflowScrolling: 'touch',
                        pointerEvents: 'auto'
                      }}
                      onWheel={(e) => e.stopPropagation()}
                    >
                      {universes.map((universe) => (
                        <button
                          key={universe.id}
                          onClick={() => handleUniverseSelect(universe)}
                          className="w-full px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
                          style={{
                            textAlign: 'left',
                            borderBottom: '1px solid rgba(0,0,0,0.04)'
                          }}
                        >
                          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 500, color: '#000' }}>
                            {universe.name}
                          </div>
                          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(0,0,0,0.5)', marginTop: '2px' }}>
                            {universe.subtitle}
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Planet Selector */}
            <AnimatePresence>
              {showPlanet && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="mb-8"
                  style={{ overflow: 'visible' }}
                >
                  <label 
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '11px',
                      letterSpacing: '0.05em',
                      color: 'rgba(0,0,0,0.5)',
                      display: 'block',
                      marginBottom: '8px',
                      textTransform: 'uppercase'
                    }}
                  >
                    Planet / Gezegen
                  </label>

                  {/* Dropdown Button */}
                  <div className="relative" style={{ zIndex: 20 }}>
                    <button
                      onClick={() => setIsPlanetOpen(!isPlanetOpen)}
                      className="w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-200"
                      style={{
                        border: '1px solid rgba(0,0,0,0.1)',
                        background: '#fff',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: isMobile ? '14px' : '15px',
                        color: '#000',
                        textAlign: 'left'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div style={{ fontWeight: 500 }}>{selectedPlanet}</div>
                        {selectedUniverse.id === 'universe-0' && selectedPlanet === 'Earth (Prime-3)' && (
                          <motion.div
                            initial={{ opacity: 0.4 }}
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2, times: [0, 0.5, 1] }}
                          >
                            <MapPin className="w-4 h-4" style={{ fill: '#000', stroke: 'none' }} />
                          </motion.div>
                        )}
                      </div>
                      <motion.div
                        animate={{ rotate: isPlanetOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5" style={{ color: 'rgba(0,0,0,0.4)' }} />
                      </motion.div>
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isPlanetOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl z-50 overflow-y-auto"
                          style={{
                            border: '1px solid rgba(0,0,0,0.08)',
                            maxHeight: '250px',
                            overflowX: 'hidden',
                            WebkitOverflowScrolling: 'touch',
                            pointerEvents: 'auto'
                          }}
                          onWheel={(e) => e.stopPropagation()}
                        >
                          {selectedUniverse.planets.map((planet) => (
                            <button
                              key={planet}
                              onClick={() => handlePlanetSelect(planet)}
                              className="w-full px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
                              style={{
                                textAlign: 'left',
                                borderBottom: '1px solid rgba(0,0,0,0.04)',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#000'
                              }}
                            >
                              {planet}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Confirm Button */}
            <motion.button
              whileHover={{ opacity: 0.9 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirm}
              className="w-full py-4 rounded-lg transition-all duration-200"
              style={{
                background: '#000',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontSize: isMobile ? '14px' : '15px',
                fontWeight: 600,
                letterSpacing: '0.02em',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              CONFIRM ENTRY
            </motion.button>

            {/* Disclaimer */}
            <p 
              className="text-center mt-3"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                color: 'rgba(0,0,0,0.4)',
                lineHeight: '1.4'
              }}
            >
              Your selection will not modify your browsing session.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}