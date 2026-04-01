import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Icons } from '../components/Icons';
import { FilterSelect } from '../components/ui/FilterSelect';
import { FREE_AGENTS } from '../mocks/data';

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

interface FreeAgentsProps {
  userLocation: { lat: number; lng: number; city: string } | null;
  searchRadius: number;
  setSearchRadius: (r: number) => void;
  onLocate: () => void;
  isLocating: boolean;
}

export function FreeAgents({ userLocation, searchRadius, setSearchRadius, onLocate, isLocating }: FreeAgentsProps) {
  const [posFilter, setPosFilter] = React.useState('Todas');
  const [levelFilter, setLevelFilter] = React.useState('Todos');
  const [showRadiusFilter, setShowRadiusFilter] = React.useState(false);

  const positions = ['Todas', 'Portero', 'Defensa', 'Mediocampista', 'Delantero'];
  const levels = ['Todos', 'Amateur', 'Semi-Pro', 'Nivel Pro'];

  const filteredPlayers = FREE_AGENTS.filter(player => {
    const matchesPos = posFilter === 'Todas' || player.position === posFilter;
    const matchesLevel = levelFilter === 'Todos' || player.level === levelFilter;
    
    let matchesRadius = true;
    if (userLocation && searchRadius < 100) {
      const dist = calculateDistance(userLocation.lat, userLocation.lng, player.lat, player.lng);
      matchesRadius = dist <= searchRadius;
    }

    return matchesPos && matchesLevel && matchesRadius;
  });

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto pb-20">
      <section className="mb-12">
        <h2 className="font-headline font-extrabold text-5xl md:text-7xl text-white tracking-tighter mb-4 leading-none uppercase italic">Mercado de <span className="text-primary-fixed">Agentes Libres</span></h2>
        <p className="text-on-surface-variant text-lg max-w-xl">Encuentra el refuerzo perfecto para tu equipo. Jugadores disponibles ahora en tu zona.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <FilterSelect label="Posición" value={posFilter} options={positions} onChange={setPosFilter} />
        <FilterSelect label="Nivel" value={levelFilter} options={levels} onChange={setLevelFilter} />
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
                  <button 
                    onClick={onLocate}
                    disabled={isLocating}
                    className="w-full py-3 rounded-lg bg-white/5 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icons.Navigation size={14} className={isLocating ? "animate-spin" : ""} />
                    {isLocating ? "Localizando..." : "GPS Automático"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map(player => (
          <motion.div 
            key={player.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-container-low rounded-[2rem] border border-white/5 overflow-hidden group hover:bg-surface-container-high transition-all"
          >
            <div className="p-8">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary-fixed/20 group-hover:border-primary-fixed transition-colors">
                  <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-2xl font-headline font-black text-white uppercase italic tracking-tighter leading-none mb-1">{player.name}</h3>
                  <p className="text-primary-fixed font-bold text-xs uppercase tracking-widest">{player.position} • {player.age} años</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 p-3 rounded-xl">
                  <p className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Nivel</p>
                  <p className="text-xs font-bold text-white">{player.level}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                  <p className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Partidos</p>
                  <p className="text-xs font-bold text-white">{player.matches}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {player.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-surface-container-highest text-[8px] font-bold text-on-surface-variant uppercase tracking-widest border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>

              <button 
                onClick={() => toast.success(`¡Invitación enviada a ${player.name}!`)}
                className="w-full py-4 rounded-xl bg-white text-black font-headline font-black text-sm uppercase tracking-widest hover:bg-primary-fixed transition-colors active:scale-95"
              >
                Invitar al Equipo
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-20 bg-surface-container-low rounded-3xl border border-dashed border-white/10">
          <Icons.Users size={48} className="mx-auto text-on-surface-variant/20 mb-4" />
          <p className="text-on-surface-variant">No hay agentes libres con estos filtros en tu zona.</p>
        </div>
      )}
    </div>
  );
}
