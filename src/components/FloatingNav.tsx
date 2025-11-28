'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Users, Zap, Shield, Headphones, BarChart3, Music, History } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: <Home size={20} />, href: '#home' },
  { id: 'features', label: 'Features', icon: <Zap size={20} />, href: '#features' },
  { id: 'commands', label: 'Commands', icon: <Users size={20} />, href: '#commands' },
  { id: 'changelog', label: 'Changelog', icon: <History size={20} />, href: '#changelog' },
];

export default function FloatingNav() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if navbar should be visible (scrolled past halfway through hero section)
      const heroSection = document.getElementById('home');
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        const heroHalfway = heroHeight / 2;
        const scrollPosition = window.scrollY;

        setIsVisible(scrollPosition > heroHalfway);
      }

      // Update active section for navigation highlighting
      const sections = navItems.map(item => item.id);
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections.reverse()) {
        const element = document.getElementById(sectionId);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sectionId);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Check initial state
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smooth animation
          }}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-red-500/20 rounded-full blur-xl" />

            <div className="relative bg-black/60 backdrop-blur-2xl border border-cyan-500/30 rounded-full px-6 py-3 shadow-2xl shadow-cyan-500/20">
              {/* Animated border */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-red-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

              <div className="flex items-center gap-2 relative">
                {/* Logo */}
                <div className="flex items-center gap-2 pr-4 border-r border-cyan-500/30">
                  <div className="relative">
                    <Music className="text-cyan-400 animate-pulse" size={24} />
                    <div className="absolute inset-0 text-cyan-400 blur-md opacity-50">
                      <Music size={24} />
                    </div>
                  </div>
                  <span className="text-white font-bold text-lg tracking-wider text-glow">STREAMSYNC</span>
                </div>

                {/* Nav Items */}
                <div className="flex items-center gap-1 pl-2">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        backgroundColor: activeSection === item.id
                          ? 'rgba(6, 182, 212, 0.2)' // cyan-500/20
                          : 'rgba(255, 255, 255, 0)',
                        color: activeSection === item.id
                          ? '#22d3ee' // cyan-400
                          : '#9ca3af', // gray-400
                      }}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: activeSection === item.id
                          ? 'rgba(6, 182, 212, 0.3)'
                          : 'rgba(255, 255, 255, 0.05)',
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.1,
                        ease: "easeOut",
                        backgroundColor: { duration: 0.2 },
                        color: { duration: 0.2 }
                      }}
                      className="relative px-4 py-2 rounded-full group overflow-hidden"
                    >
                      <div className="flex items-center gap-2 relative z-10">
                        <motion.div
                          animate={{
                            scale: activeSection === item.id ? 1.1 : 1,
                            rotate: activeSection === item.id ? [0, -10, 10, 0] : 0,
                          }}
                          transition={{
                            scale: { duration: 0.2, ease: "easeOut" },
                            rotate: { duration: 0.4, ease: "easeInOut" }
                          }}
                          className={activeSection === item.id ? 'animate-pulse' : ''}
                        >
                          {item.icon}
                        </motion.div>
                        <motion.span
                          animate={{
                            opacity: hoveredItem === item.id || activeSection === item.id ? 1 : 0,
                            width: hoveredItem === item.id || activeSection === item.id ? 'auto' : 0,
                            marginLeft: hoveredItem === item.id || activeSection === item.id ? 8 : 0,
                          }}
                          transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                            opacity: { duration: 0.2 },
                            width: { duration: 0.3 },
                            marginLeft: { duration: 0.3 }
                          }}
                          className="text-sm font-medium whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      </div>

                      {/* Active state glow effect */}
                      <AnimatePresence>
                        {activeSection === item.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute inset-0 rounded-full bg-cyan-500/10"
                          />
                        )}
                      </AnimatePresence>

                      {/* Active state border glow */}
                      <AnimatePresence>
                        {activeSection === item.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-cyan-500/50 to-purple-500/50 blur-sm"
                          />
                        )}
                      </AnimatePresence>

                      {/* Hover effect */}
                      <motion.div
                        animate={{
                          background: hoveredItem === item.id
                            ? 'linear-gradient(to right, rgba(6, 182, 212, 0.1), rgba(147, 51, 234, 0.1))'
                            : 'linear-gradient(to right, rgba(6, 182, 212, 0), rgba(147, 51, 234, 0))'
                        }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 rounded-full"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
