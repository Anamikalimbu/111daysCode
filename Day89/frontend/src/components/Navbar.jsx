import React from "react";
import { motion } from "framer-motion";
import { FiSun, FiMoon, FiCreditCard } from "react-icons/fi";

export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-white/40 dark:border-slate-700/60 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md">
            <FiCreditCard className="text-white" size={18} />
          </div>
          <span className="font-bold text-lg tracking-tight text-brand-900 dark:text-white">
            Loan<span className="text-brand-500">Predict</span>
          </span>
        </div>

        <button
          onClick={() => setDarkMode((prev) => !prev)}
          aria-label="Toggle dark mode"
          className="relative flex items-center justify-center w-11 h-11 rounded-full bg-brand-50 dark:bg-slate-800 hover:bg-brand-100 dark:hover:bg-slate-700 transition-colors shadow-inner"
        >
          <motion.div
            key={darkMode ? "moon" : "sun"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {darkMode ? (
              <FiMoon className="text-brand-300" size={20} />
            ) : (
              <FiSun className="text-brand-600" size={20} />
            )}
          </motion.div>
        </button>
      </div>
    </motion.nav>
  );
}
