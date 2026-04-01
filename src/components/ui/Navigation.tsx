import React from 'react';

export function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center transition-all active:scale-90 duration-300 ease-out ${
        active ? 'text-primary-fixed bg-surface-container-high rounded-xl px-3 py-2' : 'text-on-surface-variant opacity-60 hover:text-white'
      }`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-[10px] font-semibold uppercase tracking-widest">{label}</span>
    </button>
  );
}

export function DrawerItem({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-white opacity-70 hover:bg-surface-container-high transition-all duration-200 group w-full text-left"
    >
      <div className="group-hover:text-primary-fixed">{icon}</div>
      <span className="font-headline font-medium text-sm">{label}</span>
    </button>
  );
}
