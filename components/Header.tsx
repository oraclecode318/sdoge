'use client';

import { motion } from 'framer-motion';
import { FaXTwitter } from 'react-icons/fa6';
import { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { LINKS } from '@/utils/constants';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Typing scramble effect (slower)
  const scrambleText = (element: HTMLElement, finalText: string, duration: number = 1.2) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    const length = finalText.length;
    let frame = 0;
    const totalFrames = Math.floor(duration * 60); // 60 fps

    const interval = setInterval(() => {
      if (frame >= totalFrames) {
        element.textContent = finalText;
        clearInterval(interval);
        return;
      }

      let scrambled = '';
      for (let i = 0; i < length; i++) {
        const progress = frame / totalFrames;
        if (progress > i / length) {
          scrambled += finalText[i];
        } else {
          scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      element.textContent = scrambled;
      frame++;
    }, 1000 / 60);
  };

  const handleMenuItemHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const element = e.currentTarget;
    const originalText = element.getAttribute('data-text') || element.textContent || '';
    
    // Only typing scramble effect (no flip)
    scrambleText(element, originalText, 1.2);
  };

  const handleButtonHover = () => {
    if (!buttonRef.current) return;
    const originalText = buttonRef.current.getAttribute('data-text') || buttonRef.current.textContent || '';
    
    // Only typing scramble effect (no flip)
    scrambleText(buttonRef.current, originalText, 1.2);
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 md:px-8 py-3 backdrop-blur-sm bg-transparent"
        style={{ padding: '12px' }}
      >
        {/* Logo */}
        <motion.div
          className="text-3xl font-black cursor-pointer hover:text-yellow-400 transition-colors text-white tracking-tight"
          whileHover={{ scale: 1.05 }}
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          sDOGE
        </motion.div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {['HOME', 'DOCS', 'COMMUNITY', 'INVEST'].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-normal text-white hover:text-yellow-400 transition-colors uppercase tracking-wider relative"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              data-text={item}
              onMouseEnter={handleMenuItemHover}
              style={{ display: 'inline-block' }}
            >
              {item}
            </motion.a>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3 md:gap-4">
          <motion.a
            href={LINKS.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-yellow-400 transition-colors"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaXTwitter size={20} />
          </motion.a>
          <motion.button
            ref={buttonRef}
            className="bg-[#ffd841] text-black rounded-[2px] cursor-pointer font-normal text-xs md:text-sm hover:bg-yellow-300 transition-all uppercase tracking-wider shadow-lg shadow-yellow-300/20"
            style={{ padding: '6px', display: 'inline-block' }}
            whileTap={{ scale: 0.95 }}
            data-text="STAKE AND EARN"
            onMouseEnter={handleButtonHover}
          >
            STAKE AND EARN
          </motion.button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <motion.nav
        initial={false}
        animate={{
          x: isMenuOpen ? 0 : '100%',
          opacity: isMenuOpen ? 1 : 0,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="fixed top-0 right-0 bottom-0 w-64 bg-[#1a1a1a] border-l border-yellow-400/20 z-40 md:hidden flex flex-col p-8 gap-6 pt-24"
      >
        {['HOME', 'DOCS', 'COMMUNITY', 'INVEST'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-lg font-normal text-white/80 hover:text-yellow-400 transition-colors uppercase tracking-wider"
            onClick={() => setIsMenuOpen(false)}
          >
            {item}
          </a>
        ))}
      </motion.nav>
    </>
  );
}

