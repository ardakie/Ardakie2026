import { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import SplashScreen from './components/SplashScreen';
import HomePage from './components/HomePage';
import SectionIntro from './components/SectionIntro';
import SectionContent from './components/SectionContent';
import ErrorBoundary from './components/ErrorBoundary';

type AppState = 'splash' | 'home' | 'section-intro' | 'section-content';

// Analytics IDs
const GA_MEASUREMENT_ID = 'G-E8644QZQZ1';
const CLARITY_ID = 'u97ax9yk3n';

function SectionWrapper() {
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);

  // URL'den gelen section'ı normalize et (başlık formatına çevir)
  const normalizeSection = (urlSection: string | undefined): string => {
    if (!urlSection) return '';
    
    const sectionMap: Record<string, string> = {
      'dinonugget': 'DinoNugget',
      'frydaggers': 'Fry Daggers',
      'ozempicbear': 'Ozempic Bear',
      'luxurytax': 'Luxury Tax',
      'homegnomes': 'Home Gnomes',
      'heavyring': 'Heavy Ring',
      'piggybank': 'Piggy Bank',
      'fileflakes': 'File Flakes',
      'multiverseblackmarket': 'Multiverse Black Market',
      '5minutessilencecan': '5 Minutes Silence Can',
    };
    
    return sectionMap[urlSection.toLowerCase()] || '';
  };

  const normalizedSection = normalizeSection(section);

  // Geçersiz section için ana sayfaya yönlendir
  useEffect(() => {
    if (!normalizedSection) {
      navigate('/');
    }
  }, [normalizedSection, navigate]);

  useEffect(() => {
    if (normalizedSection) {
      setShowIntro(true);
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [section, normalizedSection]);

  const handleBackToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  if (!normalizedSection) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {showIntro ? (
        <SectionIntro key={`intro-${section}`} section={normalizedSection} />
      ) : (
        <SectionContent key={`content-${section}`} section={normalizedSection} onBack={handleBackToHome} />
      )}
    </AnimatePresence>
  );
}

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Google Analytics - Sayfa geçişlerini track et (SPA için)
  useEffect(() => {
    // gtag fonksiyonu yüklendiyse, sayfa görüntülemesini track et
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  // Disable right-click, F12, and inspect element
  useEffect(() => {
    // Disable context menu (right-click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I (Inspect)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      // Cmd+Option+I (Mac)
      if (e.metaKey && e.altKey && e.key === 'i') {
        e.preventDefault();
        return false;
      }
      // Cmd+Option+J (Mac)
      if (e.metaKey && e.altKey && e.key === 'j') {
        e.preventDefault();
        return false;
      }
      // Cmd+Option+C (Mac)
      if (e.metaKey && e.altKey && e.key === 'c') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Sadece ana sayfada (/) splash screen göster
  useEffect(() => {
    if (location.pathname === '/') {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 1700);
      return () => clearTimeout(timer);
    } else {
      setShowSplash(false);
    }
  }, [location.pathname]);

  const handleSectionClick = useCallback((section: string) => {
    // Section'ı URL formatına çevir (lowercase, boşluksuz)
    const urlSection = section.toLowerCase().replace(/\s+/g, '');
    navigate(`/${urlSection}`);
  }, [navigate]);

  if (showSplash && location.pathname === '/') {
    return <SplashScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage onSectionClick={handleSectionClick} />} />
      <Route path="/:section" element={<SectionWrapper />} />
    </Routes>
  );
}

export default function App() {
  // Analytics Setup - Google Analytics + Microsoft Clarity (with duplicate prevention)
  useEffect(() => {
    // Check if scripts already exist to prevent duplicates
    const existingGA = document.querySelector(`script[src*="googletagmanager"]`);
    const existingClarity = document.querySelector(`script[src*="clarity.ms"]`) || (window as any).clarity;
    
    const scriptsToCleanup: HTMLScriptElement[] = [];

    // 1. Google Analytics 4 - only if not already loaded
    if (!existingGA) {
      const gaScript1 = document.createElement('script');
      gaScript1.async = true;
      gaScript1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(gaScript1);
      scriptsToCleanup.push(gaScript1);

      const gaScript2 = document.createElement('script');
      gaScript2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}', {
          page_path: window.location.pathname,
        });
      `;
      document.head.appendChild(gaScript2);
      scriptsToCleanup.push(gaScript2);
    }

    // 2. Microsoft Clarity - only if not already loaded
    if (!existingClarity) {
      const clarityScript = document.createElement('script');
      clarityScript.type = 'text/javascript';
      clarityScript.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_ID}");
      `;
      document.head.appendChild(clarityScript);
      scriptsToCleanup.push(clarityScript);
    }

    // Cleanup only scripts we added
    return () => {
      scriptsToCleanup.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="min-h-screen bg-white">
          <AppContent />
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}