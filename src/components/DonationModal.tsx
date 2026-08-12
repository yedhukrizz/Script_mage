import React from 'react';
import { X, Heart, Coffee, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';

interface DonationModalProps {
  onClose: () => void;
}

export function DonationModal({ onClose }: DonationModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-panel-bg border border-panel-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-panel-border bg-button-bg/50">
          <div className="flex items-center gap-2">
            <Heart className="text-red-500" size={20} fill="currentColor" />
            <h2 className="text-lg font-semibold text-text-main">Support the Project</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-text-main hover:bg-button-hover rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6 text-center">
          <p className="text-sm text-text-muted leading-relaxed">
            This application is open-source and free to use. If you find it valuable and want to support its ongoing development, consider buying me a coffee or making a donation!
          </p>

          <div className="flex flex-col gap-3">
            <a 
              href="https://buymeacoffee.com/yedhukrizz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-3.5 bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Coffee size={20} />
              Buy Me a Coffee
            </a>
            
            <a 
              href="https://razorpay.me/@thesheeprun" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-3.5 bg-[#02042B] hover:bg-[#0B1238] border border-blue-500/30 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <CreditCard size={20} className="text-blue-400" />
              Donate with Razorpay
            </a>
          </div>
          
          <p className="text-xs text-text-muted/60 mt-2">
            Thank you for your support! ❤️
          </p>
        </div>
      </motion.div>
    </div>
  );
}
