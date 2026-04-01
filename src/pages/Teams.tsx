import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Icons } from '../components/Icons';
import { FilterSelect } from '../components/ui/FilterSelect';
import { TEAMS } from '../mocks/data';
import { Screen, Team, PlayerProfile } from '../types';
import { useAppStore } from '../store/appStore';

// Helper to calculate distance between two points in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

interface TeamsProps {
  isFreeAgent: boolean;
  setIsFreeAgent: (val: boolean) => void;
  playerProfile: any;
  userLocation: { lat: number, lng: number, city: string } | null;
  searchRadius: number;
  setSearchRadius: (r: number) => void;
  onLocate: () => void;
  isLocating: boolean;
}

export function Teams({ isFreeAgent, setIsFreeAgent, playerProfile, userLocation, searchRadius, setSearchRadius, onLocate, isLocating }: TeamsProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [regionFilter, setRegionFilter] = React.useState('Todas');
  const [levelFilter, setLevelFilter] = React.useState('Todos');
  const [formatFilter, setFormatFilter] = React.useState('Todos');
  const [showRadiusFilter, setShowRadiusFilter] = React.useState(false);

  const [showChallengeModal, setShowChallengeModal] = React.useState(false);
  const [showJoinModal, setShowJoinModal] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<any>(null);

  const regions = ['Todas', 'Metropolitana', 'Valparaíso', 'Bio Bio', 'Maule'];
  const levels = ['Todos', 'Amateur', 'Semi-Pro', 'Nivel Pro'];
  const formats = ['Todos', '5v5', '7v7', '11v11'];

  const filteredTeams = TEAMS.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         team.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = regionFilter === 'Todas' || team.region === regionFilter;
    const matchesLevel = levelFilter === 'Todos' || team.level === levelFilter;
    const matchesFormat = formatFilter === 'Todos' || team.format === formatFilter;
    
    let matchesRadius = true;
    if (userLocation && searchRadius < 100) {
      const dist = calculateDistance(userLocation.lat, userLocation.lng, team.lat, team.lng);
      matchesRadius = dist <= searchRadius;
    }

    return matchesSearch && matchesRegion && matchesLevel && matchesFormat && matchesRadius;
  });

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto pb-20">
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <h2 className="font-headline font-extrabold text-5xl md:text-7xl text-white tracking-tighter mb-4 leading-none uppercase italic">Encuentra tu <span className="text-primary-fixed">Equipo</span></h2>
            <p className="text-on-surface-variant text-lg max-w-xl">Únete al circuito amateur de élite en Chile. Filtra por región, nivel y formato.</p>
          </div>
          <div className="md:col-span-4 flex md:justify-end">
            <div className="bg-surface-container-high p-5 rounded-xl w-full md:w-auto border border-white/5 shadow-lg">
              <div 
                onClick={() => {
                  setIsFreeAgent(!isFreeAgent);
                  toast.success(isFreeAgent ? 'Modo Agente Libre desactivado' : 'Modo Agente Libre activado');
                }}
                className="flex items-center justify-between gap-8 cursor-pointer group"
              >
                <div>
                  <p className="font-headline font-bold text-white uppercase tracking-wider text-xs mb-1">Estado</p>
                  <p className="text-primary-fixed font-bold text-sm">MODO AGENTE LIBRE</p>
                </div>
                <div className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${isFreeAgent ? 'bg-primary-fixed/20' : 'bg-white/10'}`}>
                  <span className={`inline-block h-4 w-4 rounded-full bg-primary-fixed transition shadow-md ${isFreeAgent ? 'translate-x-7' : 'translate-x-1'}`}></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="relative group max-w-2xl">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary-fixed transition-colors">
            <Icons.Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Buscar por nombre de equipo o ciudad..."
            className="w-full bg-surface-container-low border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white font-headline font-bold focus:outline-none focus:border-primary-fixed transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
        <FilterSelect 
          label="Región" 
          value={regionFilter} 
          options={regions} 
          onChange={setRegionFilter} 
        />
        <div className="relative">
          <div 
            onClick={() => setShowRadiusFilter(!showRadiusFilter)}
            className={`bg-surface-container-low p-6 rounded-xl group hover:bg-surface-container transition-colors cursor-pointer border ${showRadiusFilter ? 'border-primary-fixed' : 'border-transparent'}`}
          >
            <label className="block text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Radio de Búsqueda</label>
            <div className="flex items-center justify-between text-white font-headline font-bold">
              <span>{searchRadius >= 100 ? 'Ilimitado' : `${searchRadius} km`}</span>
              <Icons.MapPin size={18} className="text-primary-fixed" />
            </div>
          </div>
          <AnimatePresence>
            {showRadiusFilter && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-surface-container-high border border-white/10 rounded-xl p-6 z-50 shadow-2xl"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-xs">Ajustar Radio</span>
                    <span className="text-primary-fixed font-black">{searchRadius}km</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="100" 
                    step="5"
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                    className="w-full accent-primary-fixed"
                  />
                  <div className="flex justify-between text-[10px] text-on-surface-variant font-bold">
                    <span>5KM</span>
                    <span>100KM+</span>
                  </div>
                  <button 
                    onClick={onLocate}
                    disabled={isLocating}
                    className="w-full py-3 rounded-lg bg-white/5 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icons.Navigation size={14} className={isLocating ? "animate-spin" : ""} />
                    {isLocating ? "Localizando..." : "Recalibrar GPS"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <FilterSelect 
          label="Nivel de Habilidad" 
          value={levelFilter} 
          options={levels} 
          onChange={setLevelFilter} 
        />
        <FilterSelect 
          label="Tipo de Partido" 
          value={formatFilter} 
          options={formats} 
          onChange={setFormatFilter} 
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-9 space-y-8">
          {filteredTeams.length > 0 ? (
            filteredTeams.map(team => (
              <TeamCard 
                key={team.id}
                team={team}
                playerProfile={playerProfile}
                onChallenge={(t) => { setSelectedTeam(t); setShowChallengeModal(true); }}
                onJoin={(t) => { setSelectedTeam(t); setShowJoinModal(true); }}
              />
            ))
          ) : (
            <div className="py-20 text-center bg-surface-container-low rounded-3xl border border-dashed border-white/10">
              <Icons.Users size={48} className="mx-auto text-on-surface-variant/20 mb-4" />
              <h3 className="text-xl font-headline font-bold text-white">No se encontraron equipos</h3>
              <p className="text-on-surface-variant">Prueba ajustando los filtros de búsqueda.</p>
            </div>
          )}
        </div>
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-surface-container-low rounded-xl p-6 border border-white/5">
            <h4 className="font-headline font-bold text-white uppercase tracking-widest text-sm mb-6 flex items-center justify-between">
              Puntos Calientes
              <Icons.Navigation size={16} className="text-primary-fixed" />
            </h4>
            <div className="space-y-4">
              <HotPoint number="01" name="San Carlos de Apoquindo" desc="8 Partidos Hoy" />
              <HotPoint number="02" name="Estadio Monumental Hub" desc="12 Partidos Hoy" />
              <HotPoint number="03" name="Ciudad Deportiva USS" desc="5 Partidos Hoy" />
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-primary-fixed/5 text-center">
            <Icons.ShieldCheck size={40} className="text-primary-fixed-dim mx-auto mb-4" />
            <p className="font-headline font-bold text-white text-lg mb-2">Reservas Seguras</p>
            <p className="text-on-surface-variant text-xs mb-6">Todas las transacciones protegidas por Transbank y Webpay CL</p>
            <div className="flex justify-center gap-3 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
              <span className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold text-white">WEBPAY+</span>
              <span className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold text-white">TRANSBANK</span>
            </div>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {showChallengeModal && selectedTeam && (
          <Modal 
            title={`Desafiar a ${selectedTeam.name}`} 
            onClose={() => setShowChallengeModal(false)}
          >
            <div className="space-y-6">
              <div className="bg-primary-fixed/10 p-4 rounded-xl border border-primary-fixed/20">
                <p className="text-primary-fixed text-xs font-bold uppercase tracking-widest mb-1">Regla de Negocio</p>
                <p className="text-white text-sm">Solo los capitanes pueden emitir desafíos oficiales. El equipo rival tendrá 24h para responder.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-2">Fecha del Encuentro</label>
                  <input type="date" className="w-full bg-surface-container border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary-fixed" />
                </div>
                <div>
                  <label className="block text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-2">Hora Sugerida</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['19:00', '20:00', '21:00', '22:00', '23:00', '00:00'].map(time => (
                      <button key={time} className="bg-surface-container border border-white/5 py-2 rounded-lg text-white text-sm font-bold hover:bg-primary-fixed hover:text-black transition-colors">{time}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-2">Mensaje para el Capitán</label>
                  <textarea 
                    placeholder="Ej: Tenemos cancha reservada en el Monumental..."
                    className="w-full bg-surface-container border border-white/10 rounded-xl p-4 text-white h-24 focus:outline-none focus:border-primary-fixed"
                  ></textarea>
                </div>
              </div>
              <button 
                onClick={() => {
                  toast.success(`¡Desafío enviado a ${selectedTeam.name}!`);
                  setShowChallengeModal(false);
                }}
                className="w-full pitch-gradient py-4 rounded-xl text-on-primary-fixed font-headline font-black uppercase tracking-widest"
              >
                Enviar Desafío Oficial
              </button>
            </div>
          </Modal>
        )}

        {showJoinModal && selectedTeam && (
          <Modal 
            title={`Postular a ${selectedTeam.name}`} 
            onClose={() => setShowJoinModal(false)}
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-surface-container p-4 rounded-xl border border-white/5">
                <div className="w-12 h-12 rounded-full bg-primary-fixed/20 flex items-center justify-center text-primary-fixed">
                  <Icons.User size={24} />
                </div>
                <div>
                  <p className="text-white font-bold">Tu Perfil de Jugador</p>
                  <p className="text-on-surface-variant text-xs">Nivel {playerProfile.level} • {playerProfile.position} • {playerProfile.foot}</p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-on-surface-variant text-sm">Al postular, el capitán de <strong>{selectedTeam.name}</strong> podrá ver tus estadísticas de los últimos 10 partidos y tu reputación en la liga.</p>
                <div className="bg-surface-container p-4 rounded-xl border border-white/5">
                  <p className="text-[10px] font-bold text-primary-fixed uppercase tracking-widest mb-2">Lo que busca el equipo:</p>
                  <div className="flex gap-2">
                    <span className="bg-white/5 px-2 py-1 rounded text-[10px] text-white">Defensa Central</span>
                    <span className="bg-white/5 px-2 py-1 rounded text-[10px] text-white">Portero</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  toast.success(`Tu postulación ha sido enviada a ${selectedTeam.name}`);
                  setShowJoinModal(false);
                }}
                className="w-full pitch-gradient py-4 rounded-xl text-on-primary-fixed font-headline font-black uppercase tracking-widest"
              >
                Enviar Mi Ficha Técnica
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

interface TeamCardProps {
  team: Team;
  playerProfile: PlayerProfile;
  onChallenge: (t: Team) => void;
  onJoin: (t: Team) => void;
  key?: string | number;
}

function TeamCard({ team, playerProfile, onChallenge, onJoin }: TeamCardProps) {
  return (
    <div className="bg-surface-container-high rounded-xl overflow-hidden group border border-white/5">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-64 h-64 md:h-auto overflow-hidden relative">
          <img src={team.image} alt={team.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high to-transparent"></div>
          <div className="absolute bottom-4 left-4">
            <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded uppercase">Club de Élite</span>
          </div>
        </div>
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-headline font-extrabold text-3xl text-white italic tracking-tighter uppercase mb-1">{team.name}</h3>
              <p className="text-on-surface-variant flex items-center gap-2 text-sm">
                <Icons.MapPin size={14} /> {team.location}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-primary-fixed mb-1">
                <Icons.Star size={20} fill="currentColor" />
                <span className="font-headline font-bold text-xl">{team.rating}</span>
              </div>
              <p className="text-on-surface-variant text-[10px] uppercase tracking-widest">{team.wins} Victorias</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mb-8">
            {team.tags.map((tag: any) => (
              <div key={tag} className="bg-surface-container-low px-4 py-2 rounded-lg flex items-center gap-3">
                <Icons.CheckCircle2 size={16} className="text-primary-fixed-dim" />
                <span className="text-sm font-medium">{tag}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => onChallenge(team)}
              className="pitch-gradient flex-1 py-4 rounded-xl font-headline font-black uppercase tracking-widest text-on-primary-fixed active:scale-95 transition-transform"
            >
              Desafiar Equipo
            </button>
            <button 
              onClick={() => onJoin(team)}
              className="border border-white/10 flex-1 py-4 rounded-xl font-headline font-black uppercase tracking-widest text-white hover:bg-white/5 active:scale-95 transition-transform"
            >
              Unirse al Plantel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-surface-container-lowest border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-surface-container-low">
          <h3 className="font-headline font-black text-white uppercase italic tracking-tight text-xl">{title}</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-white transition-colors">
            <Icons.X size={24} />
          </button>
        </div>
        <div className="p-8 max-h-[70vh] overflow-y-auto no-scrollbar">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

function HotPoint({ number, name, desc }: { number: string, name: string, desc: string }) {
  return (
    <div className="flex items-center gap-4 group cursor-pointer">
      <div className="w-12 h-12 rounded bg-surface-container-high flex items-center justify-center text-primary-fixed font-headline font-bold">{number}</div>
      <div>
        <p className="text-white font-bold text-sm">{name}</p>
        <p className="text-on-surface-variant text-xs italic">{desc}</p>
      </div>
    </div>
  );
}
