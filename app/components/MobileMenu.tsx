'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, LayoutDashboard, PenLine, BarChart3, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface MobileMenuProps {
  isLoggedIn: boolean;
  userName?: string;
  onSignOut: () => Promise<void>;
}

export default function MobileMenu({ isLoggedIn, userName, onSignOut }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { href: '/overview', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/trade-input', label: 'Log Trade', icon: PenLine },
    { href: '/summary', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-400 hover:text-white transition-colors focus:outline-none"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] bg-[#0a0a0a] border-l border-white/10 p-6 z-[70] flex flex-col shadow-2xl h-screen"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-bold text-white">Menu</span>
                <button
                  onClick={closeMenu}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-2 flex-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
                  >
                    <link.icon className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-6 border-t border-white/10">
                {isLoggedIn ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-lg">
                        {userName?.charAt(0) || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{userName}</span>
                        <span className="text-xs text-gray-500">Trader</span>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        await onSignOut();
                        closeMenu();
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-orange-400 hover:bg-orange-500/10 transition-all font-medium"
                    >
                      <LogOut className="w-5 h-5" />
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="flex items-center justify-center h-11 rounded-lg border border-white/10 text-sm font-medium text-white hover:bg-white/5 transition-colors"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      onClick={closeMenu}
                      className="flex items-center justify-center h-11 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
