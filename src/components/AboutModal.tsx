import React from 'react';
import { X, Heart, Github, Coffee, Globe, ArrowDown, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface AboutModalProps {
  onClose: () => void;
}

export function AboutModal({ onClose }: AboutModalProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[150] p-2 sm:p-4 md:p-6"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="glass-panel-heavy text-text-main w-full max-h-[90vh] max-w-2xl rounded-[32px] sm:rounded-[40px] flex flex-col pointer-events-auto relative overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-panel-border shrink-0 z-10 glass-panel border-x-0 border-t-0 rounded-none">
          <div className="font-semibold text-lg tracking-tight shrink-0 flex items-center gap-3 text-text-main">
            <div className="w-8 h-8 rounded-full bg-panel-bg flex items-center justify-center overflow-hidden border border-panel-border shadow-sm">
              <img src="/favicon.ico" alt="Script Mage Icon" className="w-full h-full object-cover" />
            </div>
            Script Mage
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-text-muted hover:text-text-main transition-colors rounded-full hover:bg-button-hover"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 w-full mx-auto space-y-8 custom-scrollbar">
          
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-main">Welcome to Script Mage</h2>
            <p className="text-sm text-text-muted max-w-lg mx-auto leading-relaxed">
              A powerful, lightweight, timeline-based video and animation editor right in your browser. 
              Bring your ideas to life with text, images, shapes, and intelligent script generation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-panel-bg p-5 rounded-xl border border-panel-border space-y-3">
              <h3 className="font-semibold text-text-main flex items-center gap-2 text-sm uppercase tracking-wider">
                <SparklesIcon /> Features
              </h3>
              <ul className="text-sm text-text-muted space-y-2 list-disc pl-4 marker:text-[var(--color-accent)]">
                <li>Timeline-based editing with keyframe-like control</li>
                <li>AI Script generation and automated layout</li>
                <li>Multiple canvas aspect ratios</li>
                <li>Animated backgrounds & gradients</li>
                <li>Full project import & export (JSON)</li>
                <li>Local-first auto-saving</li>
              </ul>
            </div>

            <div className="bg-panel-bg p-5 rounded-xl border border-panel-border space-y-3">
              <h3 className="font-semibold text-text-main flex items-center gap-2 text-sm uppercase tracking-wider">
                <ShieldIcon /> Privacy Policy
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Script Mage respects your privacy. All your projects, edits, and assets stay strictly on your device. We do not collect, store, or transmit any of your personal content to external servers. Your data is yours.
              </p>
            </div>
          </div>

          <div className="bg-panel-bg p-5 rounded-xl border border-panel-border space-y-4">
             <h3 className="font-semibold text-text-main flex items-center gap-2 text-sm uppercase tracking-wider">
                <ArrowDown size={16} /> Offline Version
              </h3>
              <p className="text-sm text-text-muted">
                Download the standalone version of Script Mage for Windows, Mac, and Linux to edit without an internet connection.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <a href="#" className="flex justify-center items-center gap-2 bg-button-bg hover:bg-button-hover border border-panel-border transition-colors text-text-main px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-center">
                  Windows (.exe)
                </a>
                <a href="#" className="flex justify-center items-center gap-2 bg-button-bg hover:bg-button-hover border border-panel-border transition-colors text-text-main px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-center">
                  Mac (.dmg)
                </a>
                <a href="#" className="flex justify-center items-center gap-2 bg-button-bg hover:bg-button-hover border border-panel-border transition-colors text-text-main px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-center">
                  Linux (.AppImage)
                </a>
              </div>
              <p className="text-xs text-text-muted italic opacity-70 mt-2">* Links coming soon in the next release!</p>
          </div>

          <div className="pt-6 border-t border-panel-border flex flex-col items-center justify-center space-y-4">
            <div className="text-sm font-medium flex items-center gap-2 text-text-main">
              Made by <span className="text-[var(--color-accent)] font-bold">Yedhukrizz</span> with <Heart size={16} className="text-red-500 fill-red-500 inline-block animate-pulse" />
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a 
                href="https://instagram.com/yedhukrizz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-button-bg hover:bg-button-hover border border-panel-border transition-all text-sm font-medium hover:scale-105"
              >
                <Globe size={16} /> @yedhukrizz
              </a>
              <a 
                href="https://razorpay.me/@thesheeprun" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent)] text-white hover:opacity-90 transition-all text-sm font-semibold hover:scale-105 shadow-sm"
              >
                <Coffee size={16} /> Support the Developer
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
  );
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
  );
}
