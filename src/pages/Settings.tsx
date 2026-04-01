import React from 'react';

export function Settings() {
  return (
    <div className="pt-24 px-6 max-w-2xl mx-auto space-y-12 pb-12">
      <div className="space-y-2">
        <h2 className="text-4xl font-headline font-black text-white uppercase italic tracking-tighter">Configuración</h2>
        <p className="text-on-surface-variant font-medium">Personaliza tu experiencia en la plataforma.</p>
      </div>

      <div className="space-y-8">
        <section className="space-y-4">
          <h3 className="text-primary-fixed font-headline font-bold uppercase tracking-[0.2em] text-xs">Cuenta y Privacidad</h3>
          <div className="space-y-2">
            <SettingItem label="Perfil Público" desc="Permitir que otros vean tus estadísticas" active={true} />
            <SettingItem label="Modo Invisible" desc="No aparecer en búsquedas de equipos" active={false} />
            <SettingItem label="Autenticación en Dos Pasos" desc="Añade una capa extra de seguridad" active={false} />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-primary-fixed font-headline font-bold uppercase tracking-[0.2em] text-xs">Notificaciones</h3>
          <div className="space-y-2">
            <SettingItem label="Alertas de Desafío" desc="Recibe avisos cuando un equipo te rete" active={true} />
            <SettingItem label="Recordatorios de Reserva" desc="Te avisamos 2 horas antes de tu partido" active={true} />
            <SettingItem label="Novedades de la Liga" desc="Resultados y tablas de posiciones" active={false} />
          </div>
        </section>

        <button className="w-full py-4 rounded-xl border border-red-500/30 text-red-400 font-headline font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors">Eliminar Cuenta</button>
      </div>
    </div>
  );
}

function SettingItem({ label, desc, active }: { label: string, desc: string, active: boolean }) {
  const [isOn, setIsOn] = React.useState(active);
  return (
    <div className="bg-surface-container p-5 rounded-2xl border border-white/5 flex items-center justify-between">
      <div>
        <p className="text-white font-bold text-sm tracking-tight">{label}</p>
        <p className="text-on-surface-variant text-xs mt-0.5">{desc}</p>
      </div>
      <button 
        onClick={() => setIsOn(!isOn)}
        className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors ${isOn ? 'bg-primary-fixed' : 'bg-white/10'}`}
      >
        <div className={`w-4 h-4 bg-black rounded-full absolute transition-all ${isOn ? 'right-1' : 'left-1'}`}></div>
      </button>
    </div>
  );
}
