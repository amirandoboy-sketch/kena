import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
    __ytCallbacks?: (() => void)[];
  }
}

interface Service {
  id: string;
  name: string;
  code: string;
  badge: string;
  icon: string;
  desc: string;
  notes: string;
  delay: string;
  image?: string;
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  // ── YouTube states & refs ──
  const [heroReady, setHeroReady] = useState(false);
  const [heroScale, setHeroScale] = useState(1);
  const heroPlayerRef = useRef<any>(null);
  const heroVideoId = "K8yuAgy81L4";

  const comingSoonPlayerRef = useRef<any>(null);
  const comingSoonVideoId = "suDQUUd-WZY";

  const addressPlayerRef = useRef<any>(null);
  const addressVideoId = "zqzE8iCYKw4";

  const [isLightTheme, setIsLightTheme] = useState<boolean>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('theme') === 'light';
    return true;
  });

  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [msgInput, setMsgInput] = useState('');
  const [formError, setFormError] = useState('');

  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.body.classList.toggle('light-theme', isLightTheme);
  }, [isLightTheme]);

  const showToast = (message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMsg(message);
    setToastVisible(true);
    toastTimeoutRef.current = setTimeout(() => setToastVisible(false), 4500);
  };
  const hideToast = () => setToastVisible(false);

  const toggleTheme = () => {
    setIsLightTheme(prev => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'light' : 'dark');
      showToast(next ? '☀️ Switched to Light theme!' : '🌙 Switched to Dark theme!');
      return next;
    });
  };

  // ── YouTube init ──
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setHeroScale(Math.max(width / 1920, height / 1080));
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    if (!window.__ytCallbacks) window.__ytCallbacks = [];

    const initAllPlayers = () => {
      const YT = window.YT;
      if (!YT) return;

      if (document.getElementById('kena-hero-iframe') && !heroPlayerRef.current) {
        try {
          heroPlayerRef.current = new YT.Player('kena-hero-iframe', {
            videoId: heroVideoId,
            playerVars: { autoplay: 1, mute: 1, controls: 0, rel: 0, showinfo: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3, disablekb: 1, fs: 0, origin: window.location.origin, widget_referrer: window.location.href },
            events: {
              onReady: (e: any) => { try { e.target.mute(); e.target.playVideo(); } catch (err) {} },
              onStateChange: (e: any) => {
                if (e.data === 1) setHeroReady(true);
                if (e.data === 0) { try { e.target.seekTo(0); e.target.playVideo(); } catch (err) {} }
              },
              onError: () => {}
            }
          });
        } catch (e) {}
      }

      if (document.getElementById('kena-comingsoon-iframe') && !comingSoonPlayerRef.current) {
        try {
          comingSoonPlayerRef.current = new YT.Player('kena-comingsoon-iframe', {
            videoId: comingSoonVideoId,
            playerVars: { autoplay: 1, mute: 1, controls: 0, rel: 0, showinfo: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3, disablekb: 1, fs: 0, origin: window.location.origin, widget_referrer: window.location.href },
            events: {
              onReady: (e: any) => { try { e.target.mute(); e.target.playVideo(); } catch (err) {} },
              onStateChange: (e: any) => { if (e.data === 0) { try { e.target.seekTo(0); e.target.playVideo(); } catch (err) {} } },
              onError: () => {}
            }
          });
        } catch (e) {}
      }

      if (document.getElementById('kena-address-iframe') && !addressPlayerRef.current) {
        try {
          addressPlayerRef.current = new YT.Player('kena-address-iframe', {
            videoId: addressVideoId,
            playerVars: { autoplay: 1, mute: 1, controls: 0, rel: 0, showinfo: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3, disablekb: 1, fs: 0, origin: window.location.origin, widget_referrer: window.location.href },
            events: {
              onReady: (e: any) => { try { e.target.mute(); e.target.playVideo(); } catch (err) {} },
              onStateChange: (e: any) => { if (e.data === 0) { try { e.target.seekTo(0); e.target.playVideo(); } catch (err) {} } },
              onError: () => {}
            }
          });
        } catch (e) {}
      }
    };

    window.__ytCallbacks.push(initAllPlayers);
    if (!window.onYouTubeIframeAPIReady) {
      window.onYouTubeIframeAPIReady = () => {
        if (window.__ytCallbacks) {
          window.__ytCallbacks.forEach(fn => fn());
          window.__ytCallbacks = [];
        }
      };
    }

    if (window.YT && window.YT.Player) initAllPlayers();

    return () => {
      window.removeEventListener('resize', handleResize);
      try { heroPlayerRef.current?.destroy(); } catch (e) {}
      try { comingSoonPlayerRef.current?.destroy(); } catch (e) {}
      try { addressPlayerRef.current?.destroy(); } catch (e) {}
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);

    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const sendMsg = () => {
    setFormError('');
    if (!nameInput.trim() || !msgInput.trim()) {
      const err = 'Please fill out both the Name and Message fields.';
      setFormError(err); showToast(err); return;
    }
    if (phoneInput.trim() && !/^[0-9+\s-]+$/.test(phoneInput.trim())) {
      const err = 'Please enter a valid phone number, or leave it blank.';
      setFormError(err); showToast(err); return;
    }
    
    const subject = encodeURIComponent("New Appointment Request - Kena Dental");
    const body = encodeURIComponent(`NEW APPOINTMENT REQUEST\n\n👤 Name: ${nameInput.trim()}\n📞 Phone: ${phoneInput.trim() || 'Not provided'}\n\n💬 Message:\n${msgInput.trim()}`);
    
    // Forces the browser to open Gmail directly
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=kennakoo54@gmail.com&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
    
    showToast('Opening Gmail to send your message...');
    setNameInput(''); setPhoneInput(''); setMsgInput('');
  };

  const handlePhoneClick = (phoneNum: string) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `tel:${phoneNum}`;
    } else {
      window.location.href = `tel:${phoneNum}`;
      showToast(`Calling Clinic: 09-11-89-20-11 / 09-30-20-21-24`);
    }
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const services: Service[] = [
    { 
      id: 's1', 
      name: 'BRACES (ብሬስ)', 
      code: 'KENA DENTAL', 
      badge: 'SPECIALITY', 
      icon: '🦷', 
      desc: 'Modern orthodontic braces to align teeth, correct bites, and create a perfectly structured smile.', 
      notes: 'Custom treatment plan | Progress tracking', 
      delay: 'delay-1',
      image: '/1.jpg'
    },
    { 
      id: 's2', 
      name: 'TEETH CLEANING (የጥርስ እጥበት)', 
      code: 'KENA DENTAL', 
      badge: 'POPULAR', 
      icon: '✨', 
      desc: 'Professional deep cleaning to eliminate plaque, tartar, and surface stains for optimal oral hygiene.', 
      notes: 'Plaque removal | Polish | Fluoride treatment', 
      delay: 'delay-2',
      image: '/2.jpg'
    },
    { 
      id: 's3', 
      name: 'TEETH FILLING (የጥርስ ፊሊንግ)', 
      code: 'KENA DENTAL', 
      badge: 'GENERAL', 
      icon: '🛠️', 
      desc: 'Durable, natural-looking restorative fillings to treat cavities and repair damaged teeth.', 
      notes: 'Composite resin | Tooth-colored | Long-lasting', 
      delay: 'delay-3',
      image: '/3.jpg'
    },
    { 
      id: 's4', 
      name: 'INVISIBLE ALIGNERS (አንቪዚብል አላይነር)', 
      code: 'KENA DENTAL', 
      badge: 'COSMETIC', 
      icon: '💎', 
      desc: 'Clear, removable aligners designed to discreetly straighten your teeth without traditional metal wires.', 
      notes: 'Discreet | Comfortable | Removable trays', 
      delay: 'delay-1',
      image: '/4.jpg'
    },
    { 
      id: 's5', 
      name: 'CERAMIC (ሴራሚክ)', 
      code: 'KENA DENTAL', 
      badge: 'SPECIALITY', 
      icon: '👑', 
      desc: 'High-strength ceramic restorations and crowns designed for maximum durability and realistic aesthetics.', 
      notes: 'Biocompatible | Natural finish | High durability', 
      delay: 'delay-2',
      image: '/5.jpg'
    },
    { 
      id: 's6', 
      name: 'E-MAX VENEERS (ኢ-ማክስ ቪኒር)', 
      code: 'KENA DENTAL', 
      badge: 'COSMETIC', 
      icon: '🌟', 
      desc: 'Ultra-thin, premium lithium disilicate porcelain veneers for an immaculate, celebrity-grade smile design.', 
      notes: 'Stain-resistant | Ultra-thin | Premium finish', 
      delay: 'delay-3',
      image: '/6.jpg'
    },
    { 
      id: 's7', 
      name: 'ZIRCONIA (ዚርኮኒያ)', 
      code: 'KENA DENTAL', 
      badge: 'SPECIALITY', 
      icon: '💎', 
      desc: 'High-strength, biocompatible zirconia crowns and bridges crafted for supreme durability, natural translucency, and a realistic aesthetic.', 
      notes: 'Extreme durability | Biocompatible | Natural finish', 
      delay: 'delay-1',
      image: '/7.jpg'
    }
  ];

  // Stable timer controller
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }, 4000);
  }, [services.length]);

  // Mount timer once
  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  // Manual navigation that resets countdown
  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % services.length);
    startTimer();
  }, [startTimer, services.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + services.length) % services.length);
    startTimer();
  }, [startTimer, services.length]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --lime: #a4c639;
          --lime-bright: #c4e152;
          --teal: #1e6b6b;
          --teal-dark: #134a4a;
          --bg: #ffffff;
          --bg2: #f4f9f0;
          --surface: #ffffff;
          --border: rgba(30,107,107,0.12);
          --text: #16302c;
          --text-dim: rgba(22,48,44,0.55);
        }

        html, body {
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', sans-serif;
        }

        body.light-theme {
          --bg: #ffffff; --bg2: #f4f9f0;
        }
        body:not(.light-theme) {
          --bg: #0e1c1a; --bg2: #0a1513;
          --surface: rgba(255,255,255,0.04);
          --border: rgba(196,225,82,0.15);
          --text: #f4f9f0;
          --text-dim: rgba(244,249,240,0.55);
        }

        /* ── TOAST ── */
        #toast {
          position: fixed; bottom: 32px; left: 50%;
          transform: translateX(-50%) translateY(80px);
          background: var(--teal-dark); backdrop-filter: blur(10px);
          color: #fff; padding: 13px 26px; border-radius: 14px;
          z-index: 9999; display: flex; align-items: center; gap: 12px;
          opacity: 0; transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
          pointer-events: none; font-size: 0.83rem; box-shadow: 0 8px 40px rgba(0,0,0,0.3);
          max-width: calc(100vw - 32px);
          box-sizing: border-box;
        }
        #toast.show { opacity: 1; transform: translateX(-50%) translateY(0); pointer-events: auto; }
        #toast-dismiss {
          background: rgba(255,255,255,0.12); border: none; color: rgba(255,255,255,0.8);
          padding: 4px 12px; border-radius: 6px; font-size: 0.6rem; cursor: pointer; letter-spacing: 1px;
          flex-shrink: 0;
        }

        #theme-toggle-btn {
          position: fixed; bottom: 28px; right: 28px; z-index: 9999;
          background: var(--teal-dark); border: none; color: #fff;
          width: 48px; height: 48px; border-radius: 50%; font-size: 1.1rem;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 20px rgba(30,107,107,0.4); transition: transform 0.3s ease;
        }
        #theme-toggle-btn:hover { transform: scale(1.08); }

        /* ── NAVBAR ── */
        #navbar {
          position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 48px; background: rgba(255,255,255,0.92);
          backdrop-filter: blur(14px); border-bottom: 1px solid var(--border);
          transition: all 0.3s ease;
        }
        body:not(.light-theme) #navbar { background: rgba(14,28,26,0.92); }
        #navbar.scrolled { padding: 12px 48px; box-shadow: 0 2px 20px rgba(0,0,0,0.06); }

        .nav-logo { display: flex; align-items: center; gap: 10px; cursor: pointer; text-decoration: none; min-width: 0; }
        .nav-logo .tooth { font-size: 1.6rem; flex-shrink: 0; }
        .nav-logo .brand-text { display: flex; flex-direction: column; line-height: 1.1; min-width: 0; }
        .nav-logo .brand-main { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 1.1rem; color: var(--teal-dark); letter-spacing: 0.5px; white-space: nowrap; }
        body:not(.light-theme) .nav-logo .brand-main { color: var(--lime-bright); }
        .nav-logo .brand-sub { font-size: 0.55rem; letter-spacing: 2px; color: var(--text-dim); text-transform: uppercase; font-weight: 600; white-space: nowrap; }

        .nav-links { display: flex; gap: 32px; align-items: center; }
        .nav-item {
          color: var(--text-dim); text-decoration: none; font-size: 0.72rem;
          letter-spacing: 1.5px; font-weight: 600; transition: color 0.2s ease; text-transform: uppercase;
        }
        .nav-item:hover { color: var(--teal); }
        body:not(.light-theme) .nav-item:hover { color: var(--lime-bright); }

        .nav-cta {
          background: var(--teal); color: #fff; padding: 10px 22px;
          border-radius: 24px; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 1px; cursor: pointer; border: none; transition: all 0.25s ease;
          white-space: nowrap; flex-shrink: 0;
        }
        .nav-cta:hover { background: var(--teal-dark); transform: translateY(-1px); }

        /* ── HERO ── */
        #hero {
          position: relative; width: 100%; min-height: 92vh;
          display: flex; align-items: center; overflow: hidden;
          background: linear-gradient(135deg, var(--teal-dark) 0%, var(--teal) 55%, #2f8f6e 100%);
          padding: 120px 48px 60px 48px;
        }
        .hero-blob {
          position: absolute; border-radius: 50%; pointer-events: none;
        }
        .hero-blob-1 { width: 600px; height: 600px; background: var(--lime); opacity: 0.18; top: -200px; left: -150px; }
        .hero-blob-2 { width: 400px; height: 400px; background: var(--lime-bright); opacity: 0.12; bottom: -180px; right: -100px; }

        .hero-grid { position: relative; z-index: 3; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 50px; max-width: 1200px; margin: 0 auto; align-items: center; width: 100%; }

        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(196,225,82,0.18); color: var(--lime-bright);
          padding: 7px 16px; border-radius: 20px; font-size: 0.7rem;
          font-weight: 700; letter-spacing: 1.5px; margin-bottom: 18px; text-transform: uppercase;
        }
        .hero-title {
          font-family: 'Poppins', sans-serif; font-weight: 800;
          font-size: clamp(2.2rem, 5vw, 3.8rem); color: #fff;
          line-height: 1.12; margin-bottom: 18px; overflow-wrap: break-word; word-break: break-word;
        }
        .hero-title .accent { color: var(--lime-bright); }
        .hero-desc {
          font-size: 0.95rem; line-height: 1.85; color: rgba(255,255,255,0.78);
          max-width: 460px; margin-bottom: 32px; font-weight: 300; overflow-wrap: break-word;
        }
        .hero-btns { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 36px; }
        .btn-primary {
          background: var(--lime-bright); color: var(--teal-dark);
          padding: 15px 32px; font-size: 0.78rem; font-weight: 700;
          letter-spacing: 1px; border-radius: 30px; border: none; cursor: pointer;
          transition: all 0.3s ease; box-shadow: 0 8px 24px rgba(196,225,82,0.3);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(196,225,82,0.45); }
        .btn-secondary {
          background: transparent; color: #fff; padding: 15px 32px;
          font-size: 0.78rem; font-weight: 600; letter-spacing: 1px;
          border-radius: 30px; border: 1.5px solid rgba(255,255,255,0.35);
          cursor: pointer; transition: all 0.3s ease;
        }
        .btn-secondary:hover { border-color: var(--lime-bright); color: var(--lime-bright); }

        .hero-stats { display: flex; gap: 36px; flex-wrap: wrap; }
        .hero-stat-num { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 1.6rem; color: var(--lime-bright); }
        .hero-stat-label { font-size: 0.68rem; color: rgba(255,255,255,0.6); letter-spacing: 1px; text-transform: uppercase; margin-top: 2px; }

        .hero-visual {
          position: relative; display: flex; align-items: center; justify-content: center; width: 100%;
        }
        .hero-tooth-card {
          background: transparent !important;
          backdrop-filter: none !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 220px;
          height: 220px;
          animation: float 5s ease-in-out infinite;
        }
        .hero-tooth-card svg { width: 200px; height: 200px; max-width: 100%; max-height: 100%; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }

        .hero-badge-card {
          position: absolute; bottom: -10px; left: -20px;
          background: #fff; border-radius: 16px; padding: 14px 18px;
          display: flex; align-items: center; gap: 10px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-width: calc(100% - 20px);
        }
        .hero-badge-card .icon { font-size: 1.6rem; flex-shrink: 0; }
        .hero-badge-card .label { font-size: 0.65rem; color: var(--text-dim); font-weight: 600; }
        .hero-badge-card .value { font-size: 0.85rem; color: var(--teal-dark); font-weight: 700; }

        /* ── SECTIONS ── */
        section { padding: clamp(50px, 8vh, 90px) clamp(20px, 5vw, 40px); width: 100%; }
        .section-tag {
          display: inline-block; font-size: 0.68rem; letter-spacing: 3px;
          text-transform: uppercase; color: var(--teal); font-weight: 700; margin-bottom: 10px;
        }
        body:not(.light-theme) .section-tag { color: var(--lime-bright); }
        .section-h2 {
          font-family: 'Poppins', sans-serif; font-size: clamp(1.75rem, 4vw, 2.7rem);
          font-weight: 800; color: var(--text); margin-bottom: 14px; overflow-wrap: break-word; word-break: break-word;
        }

        /* ── SERVICES SECTION ── */
        #services-section { background: var(--bg2); width: 100%; }
        .services-header { text-align: center; margin-bottom: 54px; }
        .services-header p { color: var(--text-dim); font-size: 0.88rem; line-height: 1.85; max-width: 560px; margin: 0 auto; overflow-wrap: break-word; }

        /* Responsive Grid: 3 cols desktop, 2 cols tablet, 1 col mobile */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1160px;
          margin: 0 auto;
          width: 100%;
        }
        .service-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; padding: 26px; transition: all 0.3s ease;
          display: flex; flex-direction: column; width: 100%; overflow: hidden;
        }
        .service-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(30,107,107,0.12); border-color: var(--lime); }
        
        /* Service Card Image Ratio Consistency */
        .service-img-wrap {
          width: 100%;
          aspect-ratio: 16 / 10;
          max-height: 220px;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 18px;
          background: var(--bg2);
          position: relative;
        }
        .service-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .service-icon-wrap {
          width: 56px; height: 56px; border-radius: 16px;
          background: linear-gradient(135deg, var(--lime), var(--teal));
          display: flex; align-items: center; justify-content: center;
          font-size: 1.6rem; margin-bottom: 18px; flex-shrink: 0;
        }
        .service-code-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px; }
        .service-badge { font-size: 0.58rem; color: var(--teal); background: rgba(30,107,107,0.08); padding: 3px 12px; border-radius: 12px; letter-spacing: 1px; font-weight: 700; }
        body:not(.light-theme) .service-badge { color: var(--lime-bright); background: rgba(196,225,82,0.12); }
        .service-name {
          font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 1.05rem;
          color: var(--text); margin-bottom: 10px; overflow-wrap: break-word; word-break: break-word;
        }
        .service-desc { font-size: 0.82rem; color: var(--text-dim); line-height: 1.75; margin-bottom: 16px; flex-grow: 1; overflow-wrap: break-word; }
        .service-notes { font-size: 0.7rem; color: var(--teal); font-weight: 500; overflow-wrap: break-word; }
        body:not(.light-theme) .service-notes { color: var(--lime-bright); }

        /* ── ABOUT/TESTIMONIAL SECTION ── */
        #about-section { background: var(--bg); width: 100%; }
        .about-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 50px;
          max-width: 1100px; margin: 0 auto; align-items: center; width: 100%;
        }
        .about-card {
          background: linear-gradient(135deg, var(--teal-dark), var(--teal));
          border-radius: 24px; padding: clamp(24px, 5vw, 40px); color: #fff; width: 100%;
        }
        .about-card .quote-icon { font-size: 2.5rem; color: var(--lime-bright); margin-bottom: 14px; }
        .about-card p { font-size: 0.95rem; line-height: 1.8; color: rgba(255,255,255,0.9); font-style: italic; overflow-wrap: break-word; }
        .about-card .quote-author { margin-top: 18px; font-size: 0.78rem; font-weight: 700; color: var(--lime-bright); }
        .about-feature-list { display: flex; flex-direction: column; gap: 18px; width: 100%; }
        .about-feature {
          display: flex; align-items: center; gap: 16px; padding: 16px 20px;
          background: var(--surface); border: 1px solid var(--border); border-radius: 16px; width: 100%;
        }
        .about-feature .icon { font-size: 1.6rem; flex-shrink: 0; }
        .about-feature .title { font-weight: 700; font-size: 0.88rem; color: var(--text); overflow-wrap: break-word; }
        .about-feature .sub { font-size: 0.74rem; color: var(--text-dim); margin-top: 2px; overflow-wrap: break-word; }

        /* ── CONTACT SECTION ── */
        #contact-section { background: var(--bg2); width: 100%; }
        .contact-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 48px;
          max-width: 1100px; margin: 0 auto; width: 100%;
        }
        .contact-channels { display: flex; flex-direction: column; gap: 14px; margin-top: 24px; width: 100%; }
        .contact-channel {
          display: flex; align-items: center; gap: 16px; padding: 16px 20px;
          border-radius: 14px; background: var(--surface); border: 1px solid var(--border);
          flex-wrap: wrap; width: 100%;
        }
        .channel-icon { font-size: 1.5rem; flex-shrink: 0; }
        .channel-label { display: block; font-size: 0.6rem; color: var(--text-dim); letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600; }
        .channel-val { display: block; font-size: 0.88rem; color: var(--text); font-weight: 600; margin-top: 2px; overflow-wrap: anywhere; word-break: break-word; }

        .contact-form-box {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 22px; padding: clamp(20px, 4vw, 34px); width: 100%;
        }
        .form-title { font-family: 'Poppins', sans-serif; font-size: 1.3rem; font-weight: 700; color: var(--text); margin-bottom: 24px; }
        .form-group { margin-bottom: 18px; width: 100%; }
        .form-label { display: block; font-size: 0.68rem; letter-spacing: 1px; color: var(--text-dim); margin-bottom: 7px; font-weight: 600; }
        .form-input, .form-textarea {
          width: 100%; padding: 13px 16px; border-radius: 12px;
          background: var(--bg2); border: 1px solid var(--border); color: var(--text);
          font-size: 0.88rem; transition: all 0.2s ease; font-family: 'Inter', sans-serif;
        }
        body:not(.light-theme) .form-input, body:not(.light-theme) .form-textarea { background: rgba(255,255,255,0.04); }
        .form-input:focus, .form-textarea:focus { outline: none; border-color: var(--teal); }
        .form-textarea { min-height: 120px; resize: vertical; }
        .btn-send {
          width: 100%; padding: 15px; border-radius: 12px; border: none;
          background: var(--teal); color: #fff; font-size: 0.8rem; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease;
        }
        .btn-send:hover { background: var(--teal-dark); }

        /* ── ADDRESS SECTION ── */
        #address-section { background: var(--bg); width: 100%; }
        .address-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 28px;
          max-width: 1100px; margin: 0 auto; width: 100%;
        }
        .address-map-box {
          background: var(--surface); border: 1px solid var(--border); border-radius: 22px;
          padding: 36px; display: flex; align-items: center; justify-content: center; min-height: 260px; width: 100%;
        }
        .address-map-inner { text-align: center; }
        .map-icon { font-size: 2.4rem; margin-bottom: 12px; }
        .map-title { font-family: 'Poppins', sans-serif; font-size: 1.2rem; font-weight: 700; color: var(--text); }
        .map-sub { font-size: 0.82rem; color: var(--text-dim); line-height: 1.7; margin-top: 6px; }
        .btn-map {
          margin-top: 18px; padding: 11px 28px; border-radius: 24px;
          background: var(--teal); border: none; color: #fff; font-size: 0.7rem;
          font-weight: 700; letter-spacing: 1px; cursor: pointer; transition: all 0.3s ease;
        }
        .btn-map:hover { background: var(--teal-dark); }
        .address-details { display: flex; flex-direction: column; gap: 16px; width: 100%; }
        .address-card { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 24px; width: 100%; }
        .address-card-icon { font-size: 1.5rem; margin-bottom: 6px; }
        .address-card-label { display: block; font-size: 0.6rem; color: var(--text-dim); letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600; }
        .address-card-val { font-size: 0.85rem; color: var(--text); line-height: 1.7; margin-top: 5px; }

        /* ── FOOTER ── */
        footer {
          display: flex; justify-content: space-between; align-items: center;
          padding: 26px 48px; border-top: 1px solid var(--border);
          background: var(--teal-dark); flex-wrap: wrap; gap: 16px; width: 100%;
        }
        .footer-copy { font-size: 0.7rem; color: rgba(255,255,255,0.6); }
        .footer-status { display: flex; align-items: center; gap: 8px; }
        .footer-status-dot { width: 6px; height: 6px; background: var(--lime-bright); border-radius: 50%; animation: pulseDot 2s ease-in-out infinite; flex-shrink: 0; }
        @keyframes pulseDot { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .footer-status-text { font-size: 0.64rem; color: rgba(255,255,255,0.5); letter-spacing: 2px; }
        .footer-links a { font-size: 0.7rem; color: rgba(255,255,255,0.6); text-decoration: none; }
        .footer-links a:hover { color: var(--lime-bright); }

        /* ── REVEAL ── */
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }

        /* ── RESPONSIVE BREAKPOINTS & ROTATION OPTIMIZATIONS ── */

        /* Tablet Breakpoint (1024px and below) */
        @media (max-width: 1024px) {
          #navbar { padding: 14px 32px; }
          #hero { padding: 110px 32px 50px 32px; }
          .services-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .about-grid { gap: 36px; }
          .contact-grid { gap: 36px; }
        }

        /* Mobile & Tablet Portrait Breakpoint (900px and below) */
        @media (max-width: 900px) {
          #navbar { padding: 12px 20px; }
          #navbar.scrolled { padding: 10px 20px; }
          .nav-links { display: none; }
          #hero { padding: 105px 20px 40px 20px; min-height: auto; }
          .hero-grid { grid-template-columns: 1fr; gap: 36px; }
          .hero-visual { order: -1; margin-bottom: 10px; }
          .hero-badge-card { left: 0; bottom: -15px; }
          section { padding: 50px 20px; }
          .about-grid, .contact-grid, .address-grid { grid-template-columns: 1fr; gap: 32px; }
          footer { padding: 20px; flex-direction: column; align-items: center; text-align: center; }
        }

        /* Mobile Phone Breakpoint (640px and below) */
        @media (max-width: 640px) {
          .services-grid { grid-template-columns: 1fr; gap: 18px; }
          .hero-title { font-size: 2rem; }
          .hero-stats { gap: 20px 28px; }
          .hero-tooth-card { width: 220px; height: 220px; padding: 36px; }
          .hero-tooth-card svg { width: 100px; height: 100px; }
          .hero-btns { flex-direction: column; width: 100%; gap: 10px; }
          .btn-primary, .btn-secondary { width: 100%; text-align: center; }
          .about-feature { padding: 14px 16px; }
          .contact-channel { padding: 14px 16px; }
        }

        /* Small Phones (480px and below) */
        @media (max-width: 480px) {
          #toast { bottom: 16px; padding: 10px 18px; font-size: 0.78rem; }
          #theme-toggle-btn { bottom: 18px; right: 18px; width: 44px; height: 44px; font-size: 1rem; }
          .nav-logo .brand-main { font-size: 0.95rem; }
          .nav-logo .brand-sub { font-size: 0.48rem; letter-spacing: 1px; }
          .nav-cta { padding: 8px 16px; font-size: 0.65rem; }
          .hero-badge-card { padding: 10px 14px; }
          .hero-badge-card .icon { font-size: 1.3rem; }
          .hero-badge-card .value { font-size: 0.78rem; }
        }

        /* Landscape Orientation Optimizations (Phones & Tablets in Landscape mode) */
        @media (max-height: 540px) and (orientation: landscape) {
          #hero { min-height: auto; padding-top: 85px; padding-bottom: 35px; }
          section { padding: 36px 24px; }
          .hero-grid { grid-template-columns: 1fr 1fr; gap: 30px; }
          .hero-visual { order: 0; }
          .hero-tooth-card { width: 170px; height: 170px; padding: 24px; }
          .hero-tooth-card svg { width: 85px; height: 85px; }
          .services-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .about-grid, .contact-grid, .address-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
        }
      `}</style>

      <div id="toast" className={toastVisible ? 'show' : ''}>
        <span>🦷</span>
        <span>{toastMsg}</span>
        <button id="toast-dismiss" onClick={hideToast}>DISMISS</button>
      </div>

      <button id="theme-toggle-btn" onClick={toggleTheme} title={isLightTheme ? 'Switch to Dark' : 'Switch to Light'}>
        {isLightTheme ? '🌙' : '☀️'}
      </button>

      {/* ══════════ NAVIGATION ══════════ */}
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="tooth">🦷</span>
          <div className="brand-text">
            <span className="brand-main">KENA</span>
            <span className="brand-sub">SPECIALITY DENTAL CLINIC</span>
          </div>
        </div>
        <div className="nav-links">
          <a href="#services-section" className="nav-item">SERVICES</a>
          <a href="#about-section" className="nav-item">ABOUT</a>
          <a href="#contact-section" className="nav-item">CONTACT</a>
          <a href="#address-section" className="nav-item">ADDRESS</a>
        </div>
        <button className="nav-cta" onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}>
          BOOK NOW
        </button>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section id="hero">

        {/* YouTube video background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: heroReady ? 1 : 0, transition: 'opacity 1s ease-in-out', overflow: 'hidden' }}>
          <div id="kena-hero-iframe" style={{ position: 'absolute', top: '50%', left: '50%', width: '1920px', height: '1080px', transform: `translate(-50%, -50%) scale(${heroScale * 1.38}) translateZ(0)`, transformOrigin: 'center center', pointerEvents: 'none', willChange: 'transform' }} />
        </div>

        {/* Interaction shield — blocks YouTube click-through */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'transparent', pointerEvents: 'auto' }} />

        {/* Teal/lime overlay on top of video */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'linear-gradient(135deg, rgba(19,74,74,0.3) 0%, rgba(30,107,107,0.2) 55%, rgba(47,143,110,0.25) 100%)', pointerEvents: 'none' }} />

        {/* Bottom fade */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 20%, transparent 75%, rgba(0,0,0,0.5) 100%)', pointerEvents: 'none' }} />

        <div className="hero-blob hero-blob-1" style={{ zIndex: 4 }} />
        <div className="hero-blob hero-blob-2" style={{ zIndex: 4 }} />

        {/* Center Tooth Card Mask */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 4, pointerEvents: 'none' }}>
          <div className="hero-tooth-card">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 12c-14 0-24 9-24 22 0 10 4 16 6 24 2 9 3 18 7 26 2 4 5 6 8 2 3-5 3-15 5-21 1-3 2-4 4-4s3 1 4 4c2 6 2 16 5 21 3 4 6 2 8-2 4-8 5-17 7-26 2-8 6-14 6-24 0-13-10-22-24-22-2 0-4 1-6 2-2-1-4-2-6-2z" fill="#c4e152" opacity="0.95" />
              <ellipse cx="38" cy="30" rx="5" ry="8" fill="#fff" opacity="0.5" />
            </svg>
          </div>
        </div>

        <div className="hero-grid" style={{ position: 'relative', zIndex: 5 }}>
          <div>
            <span className="hero-eyebrow">✦ TRUSTED BY 40,000+ FOLLOWERS</span>
            <h1 className="hero-title">Your Smile, <span className="accent">Our Speciality</span></h1>
            <p className="hero-desc">Kena Speciality Dental Clinic provides expert dental care with modern equipment and a gentle touch — for every member of your family.</p>
            <div className="hero-btns">
              <button className="btn-primary" onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}>
                BOOK APPOINTMENT →
              </button>
              <button className="btn-secondary" onClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })}>
                VIEW SERVICES
              </button>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-num">40K+</div>
                <div className="hero-stat-label">Happy Followers</div>
              </div>
              <div>
                <div className="hero-stat-num">7</div>
                <div className="hero-stat-label">Core Services</div>
              </div>
              <div>
                <div className="hero-stat-num">7</div>
                <div className="hero-stat-label">Days Open</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ SERVICES ══════════ */}
      <section id="services-section" className="relative overflow-hidden py-16">
        <div className="services-header reveal mb-8 text-center">
          <span className="section-tag">✦ OUR SERVICES</span>
          <h2 className="section-h2">Comprehensive Dental Care</h2>
          <p className="max-w-xl mx-auto text-sm opacity-80">
            Explore our specialized treatments engineered for aesthetic perfection and optimal health.
          </p>
        </div>

        {/* 360 Interactive Stage Carousel Container */}
        <div className="relative w-full max-w-6xl mx-auto h-[520px] flex items-center justify-center overflow-hidden px-4">
          
          {/* Left Arrow Button */}
          <button 
            onClick={prevSlide}
            aria-label="Previous Service"
            className="absolute left-2 md:left-6 z-40 p-3.5 rounded-full bg-emerald-900/80 text-white hover:bg-lime-400 hover:text-emerald-950 transition-all duration-300 shadow-xl backdrop-blur-md border border-emerald-700/50 cursor-pointer"
          >
            <ChevronLeft size={26} />
          </button>

        {/* 360 Interactive Card Stage with Premium 3D Perspective */}
        <div 
          className="relative w-full h-full flex justify-center items-center" 
          style={{ perspective: '1500px' }} /* Critical for 3D depth */
        >
          {services.map((service, index) => {
            const isActive = index === activeIndex;
            const isLeft = index === (activeIndex - 1 + services.length) % services.length;
            const isRight = index === (activeIndex + 1) % services.length;

            // Base styling for all cards with a buttery smooth 3D cubic-bezier transition
            let transformStyle = 'opacity-0 z-0 pointer-events-none [transform:translateY(80px)_scale(0.75)_rotateY(0deg)]';
            
            // Background ambient glow that only appears on the active card
            let ambientGlow = null;

            if (isActive) {
              // ACTIVE CENTER CARD: Deep luxury shadow, full scale, dead center
              transformStyle = 'opacity-100 z-30 pointer-events-auto [transform:translateX(0)_scale(1)_rotateY(0deg)] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] ring-1 ring-lime-400/40';
              ambientGlow = (
                <div className="absolute inset-0 bg-lime-400/20 blur-[80px] -z-10 rounded-full scale-110 pointer-events-none transition-all duration-700" />
              );
            } else if (isLeft) {
              // LEFT CARD: Pushed left, scaled down, rotated inward, deeply darkened
              transformStyle = 'opacity-80 z-20 pointer-events-auto cursor-pointer [transform:translateX(-65%)_scale(0.82)_rotateY(-15deg)] md:[transform:translateX(-75%)_scale(0.82)_rotateY(-15deg)] brightness-40 contrast-125 hover:brightness-75 shadow-2xl';
            } else if (isRight) {
              // RIGHT CARD: Pushed right, scaled down, rotated inward, deeply darkened
              transformStyle = 'opacity-80 z-20 pointer-events-auto cursor-pointer [transform:translateX(65%)_scale(0.82)_rotateY(15deg)] md:[transform:translateX(75%)_scale(0.82)_rotateY(15deg)] brightness-40 contrast-125 hover:brightness-75 shadow-2xl';
            }

            return (
              <div 
                key={service.id}
                onClick={() => {
                  if (isLeft) prevSlide();
                  if (isRight) nextSlide();
                }}
                className={`absolute w-[310px] sm:w-[340px] md:w-[370px] transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${transformStyle}`}
              >
                {/* Ambient Center Glow */}
                {ambientGlow}

                {/* Premium Luxury Card Container */}
                <div className="relative bg-[#071513] border border-emerald-800/40 rounded-2xl p-6 h-[480px] flex flex-col justify-between overflow-hidden backdrop-blur-2xl">
                  
                  {/* Subtle inner card gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-transparent pointer-events-none" />

                  <div className="relative z-10">
                    {/* Treatment Image with refined border */}
                    <div className="relative w-full h-48 rounded-xl overflow-hidden mb-5 border border-emerald-950 shadow-inner">
                      <img 
                        src={service.image} 
                        alt={service.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 right-2 bg-[#071513]/90 backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded text-emerald-300 border border-emerald-800/60 uppercase tracking-widest shadow-lg">
                        {service.code}
                      </span>
                    </div>

                    {/* Badge & Title */}
                    <div className="text-lime-400 text-[10px] font-extrabold uppercase tracking-widest mb-2 drop-shadow-md">
                      {service.badge}
                    </div>
                    
                    {/* Amharic Text Alignment: Clean line height and spacing */}
                    <h3 className="text-white text-lg font-bold tracking-wide mb-3 flex items-start justify-between leading-snug">
                      <span className="pr-2">{service.name}</span>
                      <span className="text-xl flex-shrink-0 opacity-90">{service.icon}</span>
                    </h3>

                    {/* Description: Polished line clamping and height */}
                    <p className="text-emerald-100/70 text-sm leading-relaxed line-clamp-3 font-light">
                      {service.desc}
                    </p>
                  </div>

                  {/* Card Footer Notes */}
                  <div className="relative z-10 pt-4 border-t border-emerald-800/30 text-emerald-400/60 text-xs font-semibold tracking-wide uppercase">
                    {service.notes}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

          {/* Right Arrow Button */}
          <button 
            onClick={nextSlide}
            aria-label="Next Service"
            className="absolute right-2 md:right-6 z-40 p-3.5 rounded-full bg-emerald-900/80 text-white hover:bg-lime-400 hover:text-emerald-950 transition-all duration-300 shadow-xl backdrop-blur-md border border-emerald-700/50 cursor-pointer"
          >
            <ChevronRight size={26} />
          </button>

        </div>

        {/* Carousel Indicators / Dots */}
        <div className="flex justify-center items-center gap-2 mt-4">
          {services.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveIndex(idx);
                startTimer();
              }}
              aria-label={`Go to service slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeIndex 
                  ? 'w-8 bg-lime-400' 
                  : 'w-2.5 bg-emerald-800/60 hover:bg-emerald-600'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ══════════ ABOUT / TESTIMONIAL ══════════ */}
      <section id="about-section">
        <div className="about-grid">
          <div className="about-card reveal">
            <div className="quote-icon">"</div>
            <p>At Kena Speciality Dental Clinic, we combine state-of-the-art technology with compassionate care.</p>
            <div className="quote-author">— Kena Speciality Dental Clinic</div>

            {/* Coming Soon video card */}
            <div style={{ marginTop: '24px', width: '100%', height: '200px', borderRadius: '14px', overflow: 'hidden', position: 'relative', background: '#000', border: '1px solid rgba(196,225,82,0.2)' }}>
              <div
                id="kena-comingsoon-iframe"
                style={{ position: 'absolute', top: '50%', left: '50%', width: '300%', height: '300%', transform: 'translate(-50%, -50%) scale(0.6)', pointerEvents: 'none' }}
              />
              {/* Interaction shield */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'transparent', pointerEvents: 'auto' }} />
              {/* Label overlay */}
              <div style={{ position: 'absolute', bottom: '12px', left: '14px', zIndex: 4, pointerEvents: 'none' }}>
                <span style={{ fontSize: '0.65rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', fontWeight: 600, background: 'rgba(0,0,0,0.4)', padding: '4px 10px', borderRadius: '6px' }}>KENA DENTAL CLINIC</span>
              </div>
            </div>
          </div>
          <div className="about-feature-list">
            <div className="about-feature reveal delay-1">
              <span className="icon">🏆</span>
              <div>
                <div className="title">Speciality Care</div>
                <div className="sub">Experienced dental specialists for every treatment</div>
              </div>
            </div>
            <div className="about-feature reveal delay-2">
              <span className="icon">🧼</span>
              <div>
                <div className="title">Modern Hygiene Standards</div>
                <div className="sub">Sterilized equipment and a clean, safe clinic</div>
              </div>
            </div>
            <div className="about-feature reveal delay-3">
              <span className="icon">💬</span>
              <div>
                <div className="title">Friendly Bilingual Staff</div>
                <div className="sub">Service in Amharic, Afaan Oromo, and English</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ CONTACT ══════════ */}
      <section id="contact-section">
        <div className="contact-grid">
          <div className="reveal">
            <span className="section-tag">✦ CONTACT</span>
            <h2 className="section-h2">Book Your Visit</h2>
            <p style={{ fontSize: '0.85rem', lineHeight: 2, color: 'var(--text-dim)', marginBottom: '14px' }}>Reach out to schedule an appointment or ask any questions about our services. We're happy to help.</p>
            <div className="contact-channels">
              <div className="contact-channel">
                <span className="channel-icon">📞</span>
                <div style={{ flex: 1 }}>
                  <span className="channel-label">PHONE</span>
                  <span className="channel-val">09-11-89-20-11 / 09-30-20-21-24</span>
                </div>
                <button 
                  onClick={() => handlePhoneClick('0911892011')}
                  style={{
                    background: 'var(--teal)',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    letterSpacing: '1px'
                  }}
                >
                  CALL
                </button>
              </div>
              <div className="contact-channel">
                <span className="channel-icon">✉️</span>
                <div>
                  <span className="channel-label">EMAIL</span>
                  <span className="channel-val">kennakoo54@gmail.com</span>
                </div>
              </div>
              <div className="contact-channel">
                <span className="channel-icon">📍</span>
                <div>
                  <span className="channel-label">LOCATION</span>
                  <span className="channel-val">Piazza, Addis Ababa</span>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-box reveal delay-2">
            <div className="form-title">Send a Message</div>
            {formError && (
              <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.83rem' }}>
                ⚠️ {formError}
              </div>
            )}
            <div className="form-group">
              <label className="form-label">YOUR NAME <span style={{ color: '#ef4444' }}>*</span></label>
              <input className="form-input" type="text" placeholder="Enter your name" value={nameInput} onChange={e => { setNameInput(e.target.value); if (formError) setFormError(''); }} />
            </div>
            <div className="form-group">
              <label className="form-label">PHONE NUMBER <span style={{ fontWeight: 'normal', opacity: 0.7 }}>(Optional)</span></label>
              <input className="form-input" type="tel" placeholder="Your phone number" value={phoneInput} onChange={e => { setPhoneInput(e.target.value); if (formError) setFormError(''); }} />
            </div>
            <div className="form-group">
              <label className="form-label">MESSAGE <span style={{ color: '#ef4444' }}>*</span></label>
              <textarea className="form-textarea" placeholder="What would you like to book or ask about?" value={msgInput} onChange={e => { setMsgInput(e.target.value); if (formError) setFormError(''); }} />
            </div>
            <button className="btn-send" onClick={sendMsg}>SEND MESSAGE →</button>
          </div>
        </div>
      </section>

      {/* ══════════ ADDRESS ══════════ */}
      <section id="address-section" style={{ position: 'relative', overflow: 'hidden' }}>

        {/* YouTube video background */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 1 }}>
          <div
            id="kena-address-iframe"
            style={{ position: 'absolute', top: '50%', left: '50%', width: '130%', height: '130%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}
          />
        </div>
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'rgba(13,40,36,0.78)', pointerEvents: 'none' }} />
        {/* Teal tint overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'radial-gradient(circle at 10% 10%, rgba(19,74,74,0.7) 0%, transparent 40%), radial-gradient(circle at 90% 90%, rgba(19,74,74,0.7) 0%, transparent 40%)', pointerEvents: 'none' }} />
        {/* Interaction shield */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'transparent', pointerEvents: 'auto' }} />

        <div style={{ position: 'relative', zIndex: 4 }}>
        <div className="services-header reveal" style={{ color: '#fff' }}>
          <span className="section-tag" style={{ color: 'var(--lime-bright)' }}>✦ ADDRESS</span>
          <h2 className="section-h2" style={{ color: '#fff' }}>Find Our Clinic</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)' }}>Visit us in Piazza, Addis Ababa. We're open every day to take care of your smile.</p>
        </div>
        <div className="address-grid">
          <div className="address-map-box reveal" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)', border: '1px solid rgba(196,225,82,0.2)' }}>
            <div className="address-map-inner">
              <div className="map-icon">🦷</div>
              <div className="map-title" style={{ color: '#fff' }}>Kena Speciality Dental Clinic</div>
              <div className="map-sub" style={{ color: 'rgba(255,255,255,0.6)' }}>Piazza, Addis Ababa, Ethiopia</div>
              <button className="btn-map" onClick={() => window.open('https://maps.google.com/?q=Piazza+Addis+Ababa', '_blank')}>OPEN IN GOOGLE MAPS →</button>
            </div>
          </div>
          <div className="address-details">
            <div className="address-card reveal" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)', border: '1px solid rgba(196,225,82,0.2)' }}>
              <div className="address-card-icon">🏥</div>
              <span className="address-card-label" style={{ color: 'rgba(255,255,255,0.45)' }}>CLINIC ADDRESS</span>
              <div className="address-card-val" style={{ color: 'rgba(255,255,255,0.8)' }}>Piazza<br />Addis Ababa, Ethiopia</div>
            </div>
            <div className="address-card reveal delay-1" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)', border: '1px solid rgba(196,225,82,0.2)' }}>
              <div className="address-card-icon">📞</div>
              <span className="address-card-label" style={{ color: 'rgba(255,255,255,0.45)' }}>CALL US</span>
              <div className="address-card-val" style={{ color: 'rgba(255,255,255,0.8)' }}>09-11-89-20-11<br />09-30-20-21-24</div>
            </div>
          </div>
        </div>
        </div>{/* end zIndex:4 wrapper */}
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer>
        <div className="footer-copy">© 2026 Kena Speciality Dental Clinic · All rights reserved.</div>
        <div className="footer-status">
          <div className="footer-status-dot" />
          <span className="footer-status-text">CLINIC OPEN · ADDIS ABABA</span>
        </div>
        <div className="footer-links"><a href="#contact-section">CONTACT</a></div>
      </footer>
    </>
  );
}
