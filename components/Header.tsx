'use client';

import { motion } from 'framer-motion';
import { FaXTwitter } from 'react-icons/fa6';
import { useState } from 'react';
import { LINKS } from '@/utils/constants';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              whileHover={{ y: -2 }}
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
            className="bg-yellow-400 text-black cursor-pointer font-normal text-xs md:text-sm hover:bg-yellow-300 transition-all uppercase tracking-wider shadow-lg shadow-yellow-300/20"
            style={{ padding: '6px' }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 237, 78, 0.4)' }}
            whileTap={{ scale: 0.95 }}
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

