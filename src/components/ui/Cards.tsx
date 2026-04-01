import React from 'react';
import { Icons } from '../Icons';

export function ActionCard({ icon, title, desc, color, iconColor = "text-on-primary-fixed", onClick }: { icon: React.ReactNode, title: string, desc: string, color: string, iconColor?: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="group p-8 rounded-3xl bg-surface-container-high border border-white/5 hover:border-primary-fixed/50 transition-all active:scale-95 text-left w-full"
    >
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 shadow-xl group-hover:-translate-y-1 transition-transform ${iconColor}`}>
        {icon}
      </div>
      <h3 className="text-xl font-headline font-extrabold text-white mb-2">{title}</h3>
      <p className="text-on-surface-variant text-sm leading-relaxed">{desc}</p>
    </button>
  );
}

export function EventCard({ date, month, title, location, status, isAction, onAction }: { date: string, month: string, title: string, location: string, status: string, isAction?: boolean, onAction?: () => void }) {
  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-surface-container-low flex items-center gap-4 sm:gap-6 border-l-4 ${isAction ? 'border-transparent' : 'border-primary-fixed'} group hover:bg-surface-container-high transition-colors`}>
      <div className="text-center min-w-[50px] sm:min-w-[60px]">
        <span className="block text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase">{month}</span>
        <span className="block text-xl sm:text-2xl font-headline font-black text-white">{date}</span>
      </div>
      <div className="flex-grow min-w-0">
        <h4 className="text-base sm:text-lg font-headline font-bold text-white group-hover:text-primary-fixed transition-colors truncate">{title}</h4>
        <p className="text-on-surface-variant text-xs sm:text-sm truncate">{location}</p>
      </div>
      <div className="flex flex-col items-end shrink-0">
        {isAction ? (
          <button 
            onClick={onAction}
            className="text-primary-fixed font-bold text-xs uppercase tracking-widest flex items-center gap-1 hover:opacity-80 active:scale-95 transition-all"
          >
            {status} <Icons.Plus size={14} />
          </button>
        ) : (
          <span className="px-3 py-1 bg-surface-container-highest text-white text-[10px] font-bold rounded-lg">{status}</span>
        )}
      </div>
    </div>
  );
}
