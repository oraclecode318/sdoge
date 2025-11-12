'use client';

import { motion } from 'framer-motion';
import { FaXTwitter, FaDiscord, FaChevronRight } from 'react-icons/fa6';
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { LINKS } from '@/utils/constants';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInstitutionalOpen, setIsInstitutionalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransparencyModalOpen, setIsTransparencyModalOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle escape key to close modals
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isModalOpen) {
          setIsModalOpen(false);
        }
        if (isTransparencyModalOpen) {
          setIsTransparencyModalOpen(false);
        }
      }
    };

    if (isModalOpen || isTransparencyModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, isTransparencyModalOpen]);

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

  const handleInstitutionalTextHover = (e: React.MouseEvent<HTMLSpanElement>) => {
    const element = e.currentTarget;
    const originalText = 'INSTITUTIONAL';

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
        className="fixed top-0 left-0 right-0 z-[102] flex items-center justify-between bg-transparent"
        style={{ padding: '20px' }}
      >
        {/* Logo */}
        <motion.div
          className="cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src="/image/logo.png"
            alt="sDOGE"
            className="h-6 md:h-8 w-auto object-contain"
          />
        </motion.div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-8" style={{ marginLeft: '100px' }}>
          {['HOME', 'DOCS'].map((item, i) => (
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

          {/* INSTITUTIONAL with dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsInstitutionalOpen(true)}
            onMouseLeave={() => setIsInstitutionalOpen(false)}
          >
            <motion.a
              href="#institutional"
              className="text-sm font-normal text-white hover:text-yellow-400 transition-colors uppercase tracking-wider relative flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * 2 + 0.3 }}
              style={{ display: 'inline-flex' }}
              aria-haspopup="true"
              aria-expanded={isInstitutionalOpen}
            >
              <span 
                onMouseEnter={handleInstitutionalTextHover}
                style={{ display: 'inline-block' }}
              >
                INSTITUTIONAL
              </span>
              <motion.span
                animate={{ rotate: isInstitutionalOpen ? 90 : 0 }}
                transition={{ duration: 0.15 }}
                className="inline-block ml-1"
              >
                <FaChevronRight size={10} style={{marginBottom: '2px'}} />
              </motion.span>
            </motion.a>

            <motion.div
              initial={{ opacity: 0, y: -6, pointerEvents: 'none' }}
              animate={{
                opacity: isInstitutionalOpen ? 1 : 0,
                y: isInstitutionalOpen ? 0 : -6,
                pointerEvents: isInstitutionalOpen ? 'auto' : 'none',
              }}
              transition={{ duration: 0.15 }}
              style={{
                padding: '24px'
              }}
              className="absolute left-0 top-full mt-2 min-w-[300px] min-h-[68px] rounded-md border-2 border-dotted flex flex-col justify-center border-gray-100/50 bg-[#0b0b0b] shadow-xl shadow-black/30 py-4 px-6 gap-1"
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsModalOpen(true);
                  setIsInstitutionalOpen(false);
                }}
                className="flex items-center justify-between block w-full text-left text-sm text-white/90 hover:text-black hover:bg-[#ffd841] transition-colors uppercase tracking-wider cursor-pointer"
              >
                INSTITUTIONAL HOLDERS 
                <FaChevronRight size={10} style={{marginBottom: '2px'}} />

              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsTransparencyModalOpen(true);
                  setIsInstitutionalOpen(false);
                }}
                className="flex items-center justify-between block w-full text-left text-sm text-white/90 hover:text-black hover:bg-[#ffd841] transition-colors uppercase tracking-wider cursor-pointer"
              >
                TRANSAPRENCY & RISK
                <FaChevronRight size={10} style={{marginBottom: '2px'}} />

              </button>
            </motion.div>
          </div>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3 md:gap-4">
          <motion.a
            href={LINKS.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-yellow-400 transition-colors"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDiscord size={20} />
          </motion.a>
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
            style={{ padding: '8px 12px', display: 'inline-block' }}
            whileTap={{ scale: 0.95 }}
            data-text="COMING SOON"
            onMouseEnter={handleButtonHover}
          >
            COMING SOON
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
        className="fixed top-0 right-0 bottom-0 w-64 bg-[#1a1a1a] border-l border-yellow-400/20 z-[101] md:hidden flex flex-col p-8 gap-6 pt-24"
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

      {/* Transparency & Risk Modal */}
      {isTransparencyModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsTransparencyModalOpen(false)}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full max-w-4xl bg-[rgba(11,11,11,0.5)] rounded-md border-2 border-dotted border-gray-400/50 pointer-events-auto p-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsTransparencyModalOpen(false)}
                className="absolute top-6 right-6 text-white hover:text-yellow-400 transition-colors z-10 cursor-pointer"
                aria-label="Close modal"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Title */}
              <h2
                className="text-3xl md:text-4xl font-normal italic text-white mb-6 pl-4"
                style={{ fontFamily: '"Aktiv Grotesk Ex Trial", sans-serif', margin: '1rem' }}
              >
                Transparency & Risk
              </h2>

              {/* Table Structure */}
              <div className="border-2 border-dotted border-gray-400/50">
                {/* Row 1: Items 01 and 02 */}
                <div className="grid grid-cols-2 border-b-2 border-dotted border-gray-400/50">
                  <div className="border-r-2 border-dotted border-gray-400/50 p-4">
                    <div className="flex items-start gap-2" style={{ margin: '1rem' }}>
                      <span className="text-[#ffd841] text-base md:text-lg font-normal flex-shrink-0">01</span>
                      <span className="text-white text-xs md:text-sm font-normal uppercase tracking-wider">
                        STRATEGY MIX AND CAPACITY MAY EVOLVE WITH MARKET CONDITIONS
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-2" style={{ margin: '1rem' }}>
                      <span className="text-[#ffd841] text-base md:text-lg font-normal flex-shrink-0">02</span>
                      <span className="text-white text-xs md:text-sm font-normal uppercase tracking-wider">
                        APY VARIES; PAST PERFORMANCE IS NOT INDICATIVE OF FUTURE RESULTS
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 2: Items 03 and 04 */}
                <div className="grid grid-cols-2">
                  <div className="border-r-2 border-dotted border-gray-400/50 p-4">
                    <div className="flex items-start gap-2" style={{ margin: '1rem' }}>
                      <span className="text-[#ffd841] text-base md:text-lg font-normal flex-shrink-0">03</span>
                      <span className="text-white text-xs md:text-sm font-normal uppercase tracking-wider">
                        PRIMARY RISKS: COUNTERPARTY, MARKET STRUCTURE CHANGES (BASIS COMPRESSION), AND OPERATIONAL RISKS
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-2" style={{ margin: '1rem' }}>
                      <span className="text-[#ffd841] text-base md:text-lg font-normal flex-shrink-0">04</span>
                      <span className="text-white text-xs md:text-sm font-normal uppercase tracking-wider">
                        READ THE DOCS FOR FULL DETAILS AND DISCLOSURES
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Institutional Holders Modal */}
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full max-w-4xl bg-[rgba(11,11,11,0.5)] rounded-md border-2 border-dotted border-gray-400/50 pointer-events-auto p-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-white hover:text-yellow-400 transition-colors z-10 cursor-pointer"
                aria-label="Close modal"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Title */}
              <h2
                className="text-3xl md:text-4xl font-normal italic text-white mb-4 pl-4"
                style={{ fontFamily: '"Aktiv Grotesk Ex Trial", sans-serif', margin: '1rem' }}
              >
                Institutional Holders
              </h2>

              {/* Subtitle */}
              <p className="text-xs md:text-sm font-normal text-[#ffd841] uppercase tracking-wider mb-6 pl-4"
                style={{ margin: '1rem' }}>
                SDOGE OFFERS OPERATIONAL SIMPLICITY WITH PROFESSIONAL CONTROLS:
              </p>

              {/* Table Structure */}
              <div className="border-2 border-dotted border-gray-400/50">
                {/* Row 1: Items 01 and 02 */}
                <div className="grid grid-cols-2 border-b-2 border-dotted border-gray-400/50">
                  <div className="border-r-2 border-dotted border-gray-400/50 p-4">
                    <div className="flex items-center gap-2 m-2" style={{ margin: '1rem' }}>
                      <span className="text-[#ffd841] text-base md:text-lg font-normal">01</span>
                      <span className="text-white text-xs md:text-sm font-normal uppercase tracking-wider">
                        QUALIFIED CUSTODY
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2" style={{ margin: '1rem' }}>
                      <span className="text-[#ffd841] text-base md:text-lg font-normal">02</span>
                      <span className="text-white text-xs md:text-sm font-normal uppercase tracking-wider">
                        SEGREGATED ACCOUNTS
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 2: Items 03 and 04 */}
                <div className="grid grid-cols-2">
                  <div className="border-r-2 border-dotted border-gray-400/50 p-4">
                    <div className="flex items-center gap-2" style={{ margin: '1rem' }}>
                      <span className="text-[#ffd841] text-base md:text-lg font-normal">03</span>
                      <span className="text-white text-xs md:text-sm font-normal uppercase tracking-wider">
                        REPORTING
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2" style={{ margin: '1rem' }}>
                      <span className="text-[#ffd841] text-base md:text-lg font-normal">04</span>
                      <span className="text-white text-xs md:text-sm font-normal uppercase tracking-wider">
                        CUSTOM LIMITS/ALLOW-LISTS
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="border-t-2 border-dotted border-gray-400/50 mt-6 pt-6 pl-4">
                <p className="text-white text-sm md:text-base font-normal">
                  <button
                    onClick={() => {
                      // Handle contact action
                      window.location.href = 'mailto:contact@sdoge.com';
                    }}
                    className="text-[#ffd841] hover:text-yellow-300 transition-colors"
                    style={{ margin: '1rem' }}
                  >
                    Contact us
                  </button>
                  {' '}for an institutional on-ramp.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}

