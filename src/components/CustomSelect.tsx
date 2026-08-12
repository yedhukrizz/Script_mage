import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}

export function CustomSelect({ value, onChange, options, className = "", placeholder, icon }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Allow clicking inside the dropdown without closing if we had a ref to it,
      // but since we stopPropagation on clicks inside it, it's fine.
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        // Also check if they clicked inside the portal
        const portal = document.getElementById('custom-select-portal');
        if (portal && portal.contains(event.target as Node)) return;
        setIsOpen(false);
      }
    };
    
    const handleScroll = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true); // Capture phase for all scrolls
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const handleOpen = () => {
    if (selectRef.current) {
      setRect(selectRef.current.getBoundingClientRect());
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  // If the dropdown would go off screen bottom, show it above
  const showAbove = rect ? (rect.bottom + 256 > window.innerHeight) : false;

  const dropdown = isOpen && rect && createPortal(
    <div id="custom-select-portal" className="fixed inset-0 z-[99999] pointer-events-none">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: showAbove ? 10 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: showAbove ? 10 : -10 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'absolute',
            top: showAbove ? undefined : rect.bottom + 8,
            bottom: showAbove ? window.innerHeight - rect.top + 8 : undefined,
            left: rect.left,
            width: rect.width,
          }}
          className="bg-panel-bg/95 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] max-h-64 overflow-y-auto custom-scrollbar flex flex-col p-1.5 pointer-events-auto"
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={(e) => { e.stopPropagation(); handleSelect(opt.value); }}
              className={`flex items-center justify-between w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${value === opt.value ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)] font-semibold' : 'text-text-main hover:bg-white/10'}`}
            >
              <span>{opt.label}</span>
              {value === opt.value && <Check size={16} />}
            </button>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body
  );

  return (
    <div ref={selectRef} className="relative w-full">
      <button
        type="button"
        onClick={handleOpen}
        className={`w-full flex items-center justify-between bg-white/5 hover:bg-white/10 text-text-main rounded-xl px-4 py-3 outline-none border border-white/10 transition-colors text-sm font-medium ${className}`}
      >
        <span className="flex items-center gap-2 truncate">
          {icon}
          {selectedOption ? selectedOption.label : placeholder || 'Select option'}
        </span>
        <ChevronDown size={16} className={`transition-transform opacity-50 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {dropdown}
    </div>
  );
}
