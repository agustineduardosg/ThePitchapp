import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icons } from '../Icons';

export function FilterSelect({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-surface-container-low p-6 rounded-xl group hover:bg-surface-container transition-colors cursor-pointer border ${isOpen ? 'border-primary-fixed' : 'border-transparent'}`}
      >
        <label className="block text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] mb-3">{label}</label>
        <div className="flex items-center justify-between text-white font-headline font-bold">
          <span>{value}</span>
          <Icons.ChevronRight size={18} className={`text-primary-fixed transition-transform ${isOpen ? '-rotate-90' : 'rotate-90'}`} />
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-surface-container-high border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl"
          >
            {options.map(opt => (
              <button 
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full px-6 py-3 text-left text-sm font-bold transition-colors hover:bg-primary-fixed hover:text-black ${value === opt ? 'text-primary-fixed' : 'text-white'}`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
