import { useState, useRef, useEffect, useMemo, memo, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF, Center } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { Pause, Play, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import backgroundImage from '../assets/file-flakes/backgroundImage.png';
import logoImage from '../assets/file-flakes/logoImage.png';
import notification1Image from '../assets/file-flakes/notification1Image.png';
import notification2Image from '../assets/file-flakes/notification2Image.png';
import notification3Image from '../assets/file-flakes/notification3Image.png';
import product1Image from '../assets/file-flakes/product1Image.png';
import product2Image from '../assets/file-flakes/product2Image.png';

// Notification sound player - iPhone bildirim sesi
// Web Audio API ile - arka plan sesini durdurmadan çalar
let audioContext: AudioContext | null = null;
let notificationBuffer: AudioBuffer | null = null;
let isLoadingSound = false;

const initNotificationSound = async () => {
  // Zaten yükleniyorsa veya yüklenmişse, tekrar yükleme
  if (isLoadingSound || notificationBuffer) return;
  
  isLoadingSound = true;
  
  try {
    // AudioContext oluştur (iOS için 'webkitAudioContext' desteği)
    if (!audioContext) {
      // @ts-ignore - iOS Safari için webkit prefix
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContextClass();
    }
    
    // Ses dosyasını fetch ile al
    const soundUrl = 'https://cdn.jsdelivr.net/gh/ardawncha/flakesnutr@main/iphone.mp3';
    const response = await fetch(soundUrl);
    const arrayBuffer = await response.arrayBuffer();
    
    // Audio buffer'a decode et
    notificationBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    isLoadingSound = false;
  } catch (error) {
    console.log('Failed to load notification sound:', error);
    isLoadingSound = false;
  }
};

const playNotificationSound = () => {
  // Ses henüz yüklenmemişse, yüklemeyi başlat
  if (!notificationBuffer && !isLoadingSound) {
    initNotificationSound();
    return;
  }
  
  // Ses yüklenmediyse çalma
  if (!audioContext || !notificationBuffer) return;
  
  try {
    // AudioContext suspended durumundaysa (iOS'ta sık görülür), resume et
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    // Yeni bir source node oluştur (her çalma için yeni node gerekir)
    const source = audioContext.createBufferSource();
    source.buffer = notificationBuffer;
    
    // Gain node ile volume kontrolü
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.4725; // %47.25 volume
    
    // Bağlantıları kur: source -> gain -> destination
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Sesi çal
    source.start(0);
  } catch (error) {
    console.log('Failed to play notification sound:', error);
  }
};

// iOS-style Notification Banner Component
function IOSNotification({ onDismiss, imageUrl }: { onDismiss: () => void; imageUrl: string }) {
  const [dragY, setDragY] = useState(0);
  
  return (
    <motion.div
      initial={{ y: -200, opacity: 0 }}
      animate={{ y: dragY, opacity: 1 }}
      exit={{ y: -200, opacity: 0 }}
      transition={{ 
        type: "spring",
        damping: 25,
        stiffness: 300
      }}
      drag="y"
      dragConstraints={{ top: -100, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={(e, { offset, velocity }) => {
        // Swipe up to dismiss
        if (offset.y < -50 || velocity.y < -500) {
          onDismiss();
        } else {
          setDragY(0);
        }
      }}
      onClick={onDismiss} // Tıklayınca da kapansın
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] cursor-pointer" // cursor-grab yerine cursor-pointer
      style={{
        width: 'calc(100% - 32px)',
        maxWidth: '420px',
      }}
    >
      <div 
        className="relative rounded-[20px] overflow-hidden"
        style={{
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), 2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <img 
          src={imageUrl}
          alt="Notification"
          className="w-full h-auto select-none pointer-events-none"
          draggable="false"
        />
      </div>
    </motion.div>
  );
}

// 3D GLB Model Yükleyici - jsDelivr CDN üzerinden GitHub'dan
function FileFlakesModel({ isRotating, targetRotation, currentRotationRef, orbitControlsRef }: { 
  isRotating: boolean; 
  targetRotation: number; 
  currentRotationRef: React.MutableRefObject<number>;
  orbitControlsRef: React.MutableRefObject<any>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  // jsDelivr CDN üzerinden GitHub'dan GLB modelini yükle (CORS sorununu çözer)
  const modelUrl = 'https://cdn.jsdelivr.net/gh/ardawncha/flakesnutr@main/fflakesnutr.glb';
  const { scene } = useGLTF(modelUrl);
  
  // Responsive scale - mobil ve masaüstü için farklı boyutlar
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const normalScale = isMobile ? 1.2 : 1.5;
  const zoomedScale = isMobile ? 2.0 : 2.4;
  
  // Otomatik veya manuel döndürme + zoom
  useFrame((state, delta) => {
    if (groupRef.current) {
      if (isRotating) {
        // Otomatik döndürme
        groupRef.current.rotation.y += delta * 0.5;
        // Normal boyut - responsive
        const targetScale = normalScale;
        const currentScale = groupRef.current.scale.x;
        groupRef.current.scale.setScalar(currentScale + (targetScale - currentScale) * 0.1);
        
        // Play modunda hem obje rotation'ını hem kamera azimuth'unu kaydet
        if (orbitControlsRef.current) {
          const azimuth = orbitControlsRef.current.getAzimuthalAngle();
          // Toplam rotation = obje rotation + kamera azimuth
          currentRotationRef.current = groupRef.current.rotation.y + azimuth;
        } else {
          currentRotationRef.current = groupRef.current.rotation.y;
        }
      } else {
        // Hedef açıya smooth geçiş
        const currentRotation = groupRef.current.rotation.y;
        const diff = targetRotation - currentRotation;
        groupRef.current.rotation.y += diff * 0.1;
        
        // Büyük boyut - yazıları okuyabilmek için - responsive
        const targetScale = zoomedScale;
        const currentScale = groupRef.current.scale.x;
        groupRef.current.scale.setScalar(currentScale + (targetScale - currentScale) * 0.1);
        
        // Pause modunda sadece obje rotation'ını kaydet
        currentRotationRef.current = groupRef.current.rotation.y;
      }
    }
  });

  // Center component'i objeyi X, Y, Z eksenlerinde tam merkeze alır
  // Döndürme bu merkez etrafında gerçekleşir
  return (
    <Center>
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
    </Center>
  );
}

// 3D Rotating File Icon Component (Fallback - yüklenirken)
function RotatingFile() {
  const meshRef = useRef<THREE.Group>(null);
  
  // Otomatik döndürme
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5; // Y ekseninde dön
    }
  });

  return (
    <group ref={meshRef}>
      {/* Ana dosya gövdesi */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2.8, 0.3]} />
        <meshStandardMaterial 
          color="#FFC107" 
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      
      {/* Dosya üst köşe kıvrımı */}
      <mesh position={[0.7, 1.2, 0.15]} rotation={[0, 0, -0.785]}>
        <boxGeometry args={[0.7, 0.7, 0.3]} />
        <meshStandardMaterial 
          color="#FFD54F"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Dosya içindeki çizgiler (detay) */}
      {[0.5, 0, -0.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0.16]}>
          <boxGeometry args={[1.4, 0.08, 0.02]} />
          <meshStandardMaterial color="#212121" />
        </mesh>
      ))}
    </group>
  );
}

interface FileFlakesContentProps {
  onBack: () => void;
}

// 3D Model URL'ini sabit olarak tanımla
const MODEL_URL = 'https://cdn.jsdelivr.net/gh/ardawncha/flakesnutr@main/fflakesnutr.glb';

// Preload 3D model - component yüklenmeden önce
useGLTF.preload(MODEL_URL);

export default function FileFlakesContent({ onBack }: FileFlakesContentProps) {
  const [isRotating, setIsRotating] = useState(true);
  const [targetRotation, setTargetRotation] = useState(0);
  const currentRotationRef = useRef(0);
  const orbitControlsRef = useRef<any>(null);
  
  // Notification states - hangi bildirim gösterilecek
  const [activeNotification, setActiveNotification] = useState<number | null>(null);
  const [notification1DismissTime, setNotification1DismissTime] = useState<number | null>(null);
  const [notification2DismissTime, setNotification2DismissTime] = useState<number | null>(null);
  
  // Product showcase drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Manifesto state
  const [showManifesto, setShowManifesto] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'TR'>('EN');

  // Manifesto content
  const manifestoContent = {
    EN: {
      title: "FILE FLAKES™",
      text: "File Flakes™ is the compressed form of the chaotic minutes every modern worker experiences before breakfast. This product doesn't promise \"start your day right\"; it reflects the truth of \"you've already started late.\" The alarm won't stop, tasks don't slow down, the boss keeps messaging, yet everything still has to be completed somehow because that's how corporate life works. This box is a portrait of reality. No one working under harsh conditions has a balanced morning routine, no one cares about the nutrition pyramid, and no one has the time to actually eat breakfast."
    },
    TR: {
      title: "FILE FLAKES™",
      text: "File Flakes™, modern çalışanların kahvaltıdan önce yaşadığı o dakikalık kaosun bir kutuya sıkıştırılmış hâlidir. Bu ürün, \"güne iyi başla\" değil; \"güne zaten geç başladın\" gerçeğini anlatır. Saat alarmı susmaz, işler yetişmez, patron mesaj atar ama yine de o işler bir şekilde yetiştirilmek zorundadır. çünkü kurumsal hayat böyle işler. Bu kutu gerçekliğin bir portresidir. Ağır şartlarda çalışan kimse dengeli bir sabah rutini yaşamıyor, beslenme piramidini umursamıyor, kahvaltı yapacak zamanı bulamıyor."
    }
  };

  const selectedManifesto = manifestoContent[language];

  // Ses dosyasını sayfa yüklendiğinde hemen yükle (arka planda)
  useEffect(() => {
    // Component mount olunca hemen ses yüklemeye başla
    initNotificationSound();
  }, []);

  // İlk bildirim - 5 saniye sonra göster (3+2), 9 saniye ekranda kal
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setActiveNotification(1);
      playNotificationSound();
    }, 5000); // 3000 -> 5000

    const hideTimer = setTimeout(() => {
      setActiveNotification(null);
      setNotification1DismissTime(Date.now());
    }, 5000 + 9000); // 5 + 9 = 14 saniye

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // İkinci bildirim - İlk bildirim kapatıldıktan 5 saniye sonra (4+1)
  useEffect(() => {
    if (notification1DismissTime !== null) {
      const showTimer = setTimeout(() => {
        setActiveNotification(2);
        playNotificationSound();
      }, 5000);

      const hideTimer = setTimeout(() => {
        setActiveNotification(null);
        setNotification2DismissTime(Date.now());
      }, 5000 + 9000); // 5 + 9 = 14 saniye

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [notification1DismissTime]);

  // Üçüncü bildirim - İkinci bildirim kapatıldıktan 5 saniye sonra (4+1)
  useEffect(() => {
    if (notification2DismissTime !== null) {
      const showTimer = setTimeout(() => {
        setActiveNotification(3);
        playNotificationSound();
      }, 5000);

      const hideTimer = setTimeout(() => {
        setActiveNotification(null);
      }, 5000 + 9000); // 5 + 9 = 14 saniye

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [notification2DismissTime]);

  // Manuel kapatma işlemleri
  const handleDismissNotification = () => {
    if (activeNotification === 1) {
      setNotification1DismissTime(Date.now());
    } else if (activeNotification === 2) {
      setNotification2DismissTime(Date.now());
    }
    setActiveNotification(null);
  };

  // Ok tuşlarına basıldığında en yakın 90° katına snap et
  const handleRotateLeft = () => {
    setIsRotating(false);
    // Mevcut açıyı en yakın 90° katına yuvarla
    const snapped = Math.round(currentRotationRef.current / (Math.PI / 2)) * (Math.PI / 2);
    // Sola 90° dön
    setTargetRotation(snapped + Math.PI / 2);
  };

  const handleRotateRight = () => {
    setIsRotating(false);
    // Mevcut açıyı en yakın 90° katına yuvarla
    const snapped = Math.round(currentRotationRef.current / (Math.PI / 2)) * (Math.PI / 2);
    // Sağa 90° dön
    setTargetRotation(snapped - Math.PI / 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 w-full h-full"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* BACK and MANIFESTO buttons - TOP RIGHT - Piggy Bank gibi */}
      <div className="absolute top-8 right-8 z-[100] flex items-center gap-3">
        {/* MANIFESTO button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="border-2 border-black px-4 py-1 rounded-full hover:bg-black hover:text-white transition-all duration-200 bg-transparent text-black"
          style={{ 
            fontFamily: 'Arial Black, sans-serif', 
            fontWeight: 900,
            fontSize: 'clamp(11px, 3vw, 14px)',
          }}
          onClick={() => setShowManifesto(true)}
        >
          MANIFESTO
        </motion.button>

        {/* BACK button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => {
            if (isDrawerOpen) {
              setIsDrawerOpen(false);
            } else {
              onBack();
            }
          }}
          className="hover:opacity-50 transition-opacity duration-200 text-black"
          style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}
        >
          <span className="text-[24px]">BACK →</span>
        </motion.button>
      </div>

      {/* Logo - Sol üst köşe */}
      <div className="absolute top-8 left-8 z-[100]">
        <motion.img
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          src={logoImage}
          alt="Logo"
          className="w-[80px] md:w-[120px] h-auto select-none pointer-events-none"
        />
      </div>

      {/* Fullscreen 3D Canvas */}
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        {/* OrbitControls - Her zaman manuel döndürme aktif */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          enableRotate={true} // Hem Play hem Pause modunda manuel kontrol açık
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          ref={orbitControlsRef}
        />
        
        {/* Dengeli Işıklandırma - Orta seviye */}
        <ambientLight intensity={2.3} /> {/* İlk: 2.0 */}
        
        {/* Directional Lights */}
        <directionalLight position={[10, 10, 5]} intensity={3.5} castShadow /> {/* İlk: 3.0 */}
        <directionalLight position={[-10, -10, -5]} intensity={3} /> {/* İlk: 2.5 */}
        <directionalLight position={[0, 10, 0]} intensity={3} /> {/* İlk: 2.5 */}
        <directionalLight position={[0, -10, 0]} intensity={2.5} /> {/* İlk: 2.0 */}
        
        {/* Point Lights */}
        <pointLight position={[5, 5, 5]} intensity={2.5} /> {/* İlk: 2.0 */}
        <pointLight position={[-5, -5, 5]} intensity={2.5} /> {/* İlk: 2.0 */}
        
        {/* Spot Light */}
        <spotLight position={[0, 0, 10]} intensity={3} angle={0.6} penumbra={1} /> {/* İlk: 2.5 */}
        
        {/* 3D Model - GitHub'dan jsDelivr CDN ile */}
        <Suspense fallback={<RotatingFile />}>
          <FileFlakesModel isRotating={isRotating} targetRotation={targetRotation} currentRotationRef={currentRotationRef} orbitControlsRef={orbitControlsRef} />
        </Suspense>
      </Canvas>

      {/* Kontrol Butonları ve Products - Alt kısımda, flex column ile */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        {/* Döndürme Kontrol Butonları */}
        <div className="flex items-center gap-4">
          {/* Sol Oklu Buton */}
          <button
            className="text-white p-4 rounded-full hover:opacity-80 transition-all"
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
            onClick={handleRotateLeft}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Durdur/Başlat Butonu */}
          <button
            className="text-white p-4 rounded-full hover:opacity-80 transition-all"
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
            onClick={() => setIsRotating(!isRotating)}
          >
            {isRotating ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>

          {/* Sağ Oklu Buton */}
          <button
            className="text-white p-4 rounded-full hover:opacity-80 transition-all"
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
            onClick={handleRotateRight}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Products Trigger Button */}
        {!isDrawerOpen && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => setIsDrawerOpen(true)}
            className="z-40"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <div className="px-4 py-2 flex items-center gap-2 rounded-full">
              <ChevronUp className="w-4 h-4 text-black animate-bounce" />
              <span className="text-black text-sm" style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}>
                PRODUCTS
              </span>
              <ChevronUp className="w-4 h-4 text-black animate-bounce" />
            </div>
          </motion.button>
        )}
      </div>

      {/* Notification Banner */}
      <AnimatePresence>
        {activeNotification === 1 && (
          <IOSNotification onDismiss={handleDismissNotification} imageUrl={notification1Image} />
        )}
        {activeNotification === 2 && (
          <IOSNotification onDismiss={handleDismissNotification} imageUrl={notification2Image} />
        )}
        {activeNotification === 3 && (
          <IOSNotification onDismiss={handleDismissNotification} imageUrl={notification3Image} />
        )}
      </AnimatePresence>

      {/* Product Showcase Drawer - Sadece butona basınca açılır */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop - Blur + Dark Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60]"
              style={{
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }}
              onClick={() => setIsDrawerOpen(false)}
            />

            {/* Products - Aşağıdan yukarı */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
              }}
              className="fixed inset-0 z-[70] flex items-center justify-center p-6"
            >
              {/* Products Grid */}
              <div className="w-full max-w-5xl">
                {/* 2 Product Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  {/* Product 1 */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="relative w-full aspect-square max-h-[40vh] md:max-h-none bg-white/10 rounded-2xl overflow-hidden backdrop-blur-sm"
                  >
                    <img 
                      src={product1Image}
                      alt="Product 1"
                      className="w-full h-full object-cover select-none pointer-events-none"
                      draggable="false"
                    />
                  </motion.div>

                  {/* Product 2 */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative w-full aspect-square max-h-[40vh] md:max-h-none bg-white/10 rounded-2xl overflow-hidden backdrop-blur-sm"
                  >
                    <img 
                      src={product2Image}
                      alt="Product 2"
                      className="w-full h-full object-cover select-none pointer-events-none"
                      draggable="false"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Close Button - Orta Alt (Sadece Desktop) */}
              <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2">
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="bg-white text-black p-4 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Manifesto Popup - Glassmorphism */}
      <AnimatePresence>
        {showManifesto && (
          <>
            {/* Backdrop - %10 opak blur */}
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
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}