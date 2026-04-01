import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Icons } from '../components/Icons';
import { ActionCard, EventCard } from '../components/ui/Cards';
import { Screen } from '../types';

export function Home({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto space-y-12">
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-on-surface-variant text-sm uppercase tracking-widest">Santiago, Chile</span>
            <h2 className="text-3xl sm:text-4xl font-headline font-extrabold tracking-tighter text-white mt-1">Canchas Destacadas</h2>
          </div>
          <button 
            onClick={() => onNavigate('courts')}
            className="text-primary-fixed text-sm font-bold flex items-center gap-1 hover:opacity-80"
          >
            VER TODO <Icons.ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 group relative overflow-hidden rounded-3xl h-[400px] bg-surface-container-high">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9Nh6niSV6mCNE_HYYf2Hi23OyERm5A7dT3gQrfjNRoMDRdpI1SyigQ2yC-QKhFlrz_DVX4tHsfRml_-3B0-o9-BEBWZekRhbEOMet6lUXhZ6CYKM8VAFwhmZJkkaJIZy71h0w_kp927bvzECnAhRWDdJtboo18mNfs5SCmovwQi6dfRTyFJkZ17jpLwuj_7tN817XaS6S2_-KjZoH354wQQ1d9SiKq7tS2Kct41nVr52GMKxMy9hq55_Gi-yeeYhgpTwaFA-s_5E" 
              alt="Estadio Nacional" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <div className="flex gap-2 mb-3">
                <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed text-[10px] font-bold rounded-full uppercase tracking-tighter">Llenado Rápido</span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-tighter">Liga Pro</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-headline font-bold text-white leading-tight mb-2">Estadio Nacional: 7v7 Midnight Clash</h3>
              <div className="flex items-center gap-4 text-on-surface-variant text-sm">
                <span className="flex items-center gap-1"><Icons.Clock size={14} className="text-primary-fixed" /> 22:30 Esta noche</span>
                <span className="flex items-center gap-1"><Icons.User size={14} className="text-primary-fixed" /> 12/14 Jugadores</span>
              </div>
            </div>
            <button 
              onClick={() => toast.success('Añadido a favoritos')}
              className="absolute top-6 right-6 w-12 h-12 rounded-full glass-card flex items-center justify-center text-white active:scale-90 transition-transform"
            >
              <Icons.Star size={20} />
            </button>
          </div>

          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="flex-1 rounded-3xl bg-surface-container-high p-6 flex flex-col justify-between border border-white/5">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-primary-fixed/10 flex items-center justify-center">
                  <Icons.Navigation size={24} className="text-primary-fixed" />
                </div>
                <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">A 0.8km</span>
              </div>
              <div>
                <h4 className="text-xl font-headline font-bold text-white mb-1">Club Oriente</h4>
                <p className="text-on-surface-variant text-sm mb-4">Quedan 5 cupos para la sesión de mañana por la mañana.</p>
                <button 
                  onClick={() => toast.success('Cupo reservado en Club Oriente')}
                  className="w-full py-3 rounded-xl bg-surface-container-highest text-white font-bold text-sm hover:bg-surface-bright transition-colors active:scale-95"
                >
                  Reservar Cupo
                </button>
              </div>
            </div>
            <div 
              onClick={() => onNavigate('teams')}
              className="flex-1 rounded-3xl bg-surface-container-low p-6 flex flex-col justify-between border border-white/5 cursor-pointer hover:bg-surface-container-high transition-colors"
            >
              <div className="flex -space-x-3 mb-4">
                {[1, 2, 3].map(i => (
                  <img 
                    key={i}
                    src={`https://picsum.photos/seed/user${i}/100/100`} 
                    className="w-10 h-10 rounded-full border-2 border-surface-container-low object-cover" 
                    alt="User"
                    referrerPolicy="no-referrer"
                  />
                ))}
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed text-[10px] font-black border-2 border-surface-container-low">+8</div>
              </div>
              <div>
                <span className="text-primary-fixed-dim text-xs font-bold uppercase tracking-widest">Activo Ahora</span>
                <h4 className="text-lg font-headline font-bold text-white">Tu Equipo está en Línea</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-on-surface-variant mb-6 text-center">Diseñado para el Rendimiento</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <ActionCard 
            icon={<Icons.Home size={32} />} 
            title="Reservar Cancha" 
            desc="Reserva instantánea en sedes premium." 
            color="pitch-gradient" 
            onClick={() => onNavigate('courts')}
          />
          <ActionCard 
            icon={<Icons.Users size={32} />} 
            title="Agentes Libres" 
            desc="Encuentra refuerzos para tu equipo hoy." 
            color="bg-white" 
            iconColor="text-black" 
            onClick={() => onNavigate('free-agents')}
          />
          <ActionCard 
            icon={<Icons.Search size={32} />} 
            title="Buscar Equipo" 
            desc="Únete a equipos activos en tu zona." 
            color="bg-surface-container-high" 
            iconColor="text-primary-fixed" 
            onClick={() => onNavigate('teams')}
          />
          <ActionCard 
            icon={<Icons.Trophy size={32} />} 
            title="Torneos" 
            desc="Inscríbete en ligas profesionales." 
            color="bg-yellow-400" 
            iconColor="text-black" 
            onClick={() => onNavigate('leagues')}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-headline font-extrabold text-white">Próximos Eventos</h2>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-fixed"></span>
              <span className="w-2 h-2 rounded-full bg-surface-container-highest"></span>
              <span className="w-2 h-2 rounded-full bg-surface-container-highest"></span>
            </div>
          </div>
          <div className="space-y-4">
            <EventCard date="24" month="Oct" title="Cuartos de Final de Liga" location="Las Condes Arena • 20:00" status="LISTO PARA EL PARTIDO" />
            <EventCard 
              date="27" 
              month="Oct" 
              title="Sesión de Práctica Abierta" 
              location="Polideportivo Vitacura • 18:30" 
              status="UNIRSE" 
              isAction 
              onAction={() => toast.success('Te has unido a la sesión de práctica')}
            />
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="rounded-3xl bg-surface-container-highest p-8 relative overflow-hidden h-full">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-fixed/5 blur-3xl rounded-full"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-headline font-extrabold text-white">Disponibilidad</h3>
                <Icons.Calendar className="text-primary-fixed" />
              </div>
              <div className="grid grid-cols-7 gap-3 mb-8">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                  <div key={`${d}-${i}`} className="text-center text-[10px] font-bold text-on-surface-variant uppercase">{d}</div>
                ))}
                {[21, 22, 23, 24, 25, 26, 27].map(d => (
                  <div 
                    key={d} 
                    onClick={() => toast.info(`Disponibilidad para el día ${d}`)}
                    className={`h-8 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-transform active:scale-90 ${d === 24 ? 'bg-primary-fixed text-on-primary-fixed ring-4 ring-primary-fixed/20' : 'bg-surface-container-high hover:bg-surface-container-highest'}`}
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/5">
                <p className="text-xs text-on-surface-variant mb-2 uppercase">Horas punta esta semana</p>
                <div className="flex items-center gap-3">
                  <div className="flex-grow h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full w-3/4 pitch-gradient"></div>
                  </div>
                  <span className="text-xs font-bold text-white">75%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
