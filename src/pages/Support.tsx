import React from 'react';
import { Icons } from '../components/Icons';

export function Support() {
  return (
    <div className="pt-24 px-6 max-w-2xl mx-auto space-y-12 pb-12">
      <div className="space-y-2 text-center">
        <div className="w-20 h-20 bg-primary-fixed/20 rounded-3xl flex items-center justify-center text-primary-fixed mx-auto mb-6">
          <Icons.HelpCircle size={40} />
        </div>
        <h2 className="text-4xl font-headline font-black text-white uppercase italic tracking-tighter">¿Cómo podemos ayudarte?</h2>
        <p className="text-on-surface-variant font-medium">Nuestro equipo de soporte está disponible 24/7.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SupportCard icon={<Icons.Search size={24} />} title="Centro de Ayuda" desc="Preguntas frecuentes y guías" />
        <SupportCard icon={<Icons.Bell size={24} />} title="Estado del Servicio" desc="Verifica si hay problemas técnicos" />
      </div>

      <div className="bg-surface-container-high p-8 rounded-3xl border border-white/5 space-y-6">
        <h3 className="text-white font-headline font-bold text-xl uppercase italic tracking-tight">Envíanos un mensaje</h3>
        <div className="space-y-4">
          <input type="text" placeholder="Asunto" className="w-full bg-surface-container border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary-fixed" />
          <textarea placeholder="Describe tu problema..." className="w-full bg-surface-container border border-white/10 rounded-xl p-4 text-white h-32 focus:outline-none focus:border-primary-fixed resize-none"></textarea>
          <button className="w-full pitch-gradient py-4 rounded-xl text-on-primary-fixed font-headline font-black uppercase tracking-widest active:scale-95 transition-transform">Enviar Solicitud</button>
        </div>
      </div>
    </div>
  );
}

function SupportCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-surface-container p-6 rounded-2xl border border-white/5 hover:bg-surface-container-high transition-colors cursor-pointer group">
      <div className="text-primary-fixed mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
      <p className="text-on-surface-variant text-xs">{desc}</p>
    </div>
  );
}
