import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Icons } from '../components/Icons';
import { COURTS } from '../mocks/data';

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

interface CourtsProps {
  userLocation: { lat: number, lng: number, city: string } | null;
  searchRadius: number;
  setSearchRadius: (r: number) => void;
  onLocate: () => void;
  isLocating: boolean;
  onBook: (court: any) => void;
}

export function Courts({ userLocation, searchRadius, setSearchRadius, onLocate, isLocating, onBook }: CourtsProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCourt, setSelectedCourt] = React.useState(COURTS[0]);
  const [showResults, setShowResults] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'map' | 'list'>('map');
  const [selectedSport, setSelectedSport] = React.useState<string | null>(null);
  const [showRadiusFilter, setShowRadiusFilter] = React.useState(false);

  const filteredCourts = COURTS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = !selectedSport || c.sports.includes(selectedSport);
    
    let matchesRadius = true;
    if (userLocation && searchRadius < 100) {
      const dist = calculateDistance(userLocation.lat, userLocation.lng, c.lat, c.lng);
      matchesRadius = dist <= searchRadius;
    }

    return matchesSearch && matchesSport && matchesRadius;
  });

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div className="relative h-[calc(100vh-64px)] w-full bg-surface-container-lowest overflow-hidden flex flex-col">
      {/* Search & Filters Header */}
      <div className="absolute top-20 sm:top-24 left-4 sm:left-6 right-4 sm:right-6 z-50 max-w-lg mx-auto space-y-3">
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary-fixed transition-colors">
            <Icons.Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Buscar canchas o clubes..."
            className="w-full bg-surface-container-low/90 backdrop-blur-xl border border-white/10 rounded-2xl pl-12 pr-6 py-3.5 sm:py-4 text-white font-headline font-bold focus:outline-none focus:border-primary-fixed focus:bg-surface-container-low transition-all shadow-2xl text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
          />
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setShowResults(false);
              }}
              className="absolute inset-y-0 right-5 flex items-center text-on-surface-variant hover:text-white"
            >
              <Icons.Plus size={20} className="rotate-45" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {['Fútbol', 'Padel', 'Tenis'].map(sport => (
              <button 
                key={sport}
                onClick={() => setSelectedSport(selectedSport === sport ? null : sport)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${
                  selectedSport === sport 
                    ? 'bg-primary-fixed text-on-primary-fixed border-primary-fixed shadow-lg shadow-primary-fixed/20' 
                    : 'bg-surface-container-low/80 backdrop-blur-md text-on-surface-variant border-white/5 hover:bg-surface-container-high'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
            className="bg-surface-container-low/80 backdrop-blur-md p-2 rounded-xl border border-white/5 text-primary-fixed hover:bg-surface-container-high transition-colors shrink-0"
          >
            {viewMode === 'map' ? <Icons.Menu size={20} /> : <Icons.MapPin size={20} />}
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowRadiusFilter(!showRadiusFilter)}
              className={`bg-surface-container-low/80 backdrop-blur-md p-2 rounded-xl border transition-all shrink-0 ${showRadiusFilter ? 'border-primary-fixed text-primary-fixed' : 'border-white/5 text-on-surface-variant'}`}
            >
              <Icons.Filter size={20} />
            </button>
            <AnimatePresence>
              {showRadiusFilter && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute top-full right-0 mt-2 w-64 bg-surface-container-low/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 z-[60] shadow-2xl"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold text-xs">Radio de Búsqueda</span>
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
                    <div className="flex justify-between text-[8px] text-on-surface-variant font-bold uppercase tracking-widest">
                      <span>5KM</span>
                      <span>Ilimitado</span>
                    </div>
                    <div className="h-px bg-white/10"></div>
                    <button 
                      onClick={onLocate}
                      disabled={isLocating}
                      className="w-full py-3 rounded-xl bg-primary-fixed/10 text-primary-fixed text-[10px] font-bold uppercase tracking-widest hover:bg-primary-fixed/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <Icons.Navigation size={14} className={isLocating ? "animate-spin" : ""} />
                      {isLocating ? "Detectando..." : "GPS Automático"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showResults && searchQuery && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 bg-surface-container-low/95 backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl max-h-[300px] overflow-y-auto"
            >
              {filteredCourts.length > 0 ? (
                filteredCourts.map(court => (
                  <button 
                    key={court.id}
                    onClick={() => {
                      setSelectedCourt(court);
                      setShowResults(false);
                      setSearchQuery(court.name);
                      setViewMode('map');
                    }}
                    className="w-full px-6 py-4 flex items-center gap-4 hover:bg-surface-container-high transition-colors text-left border-b border-white/5 last:border-0"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-fixed/10 flex items-center justify-center text-primary-fixed shrink-0">
                      <Icons.MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">{court.name}</h4>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{court.address}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-on-surface-variant text-sm">No se encontraron canchas.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative">
        {viewMode === 'map' ? (
          <div className="absolute inset-0">
            {apiKey ? (
              <iframe
                title="Map view"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(selectedCourt.name + ', ' + selectedCourt.address)}`}
              />
            ) : (
              <div className="w-full h-full bg-surface-container-lowest flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 rounded-3xl bg-surface-container-high flex items-center justify-center text-on-surface-variant mb-6">
                  <Icons.MapPin size={40} />
                </div>
                <h3 className="text-2xl font-headline font-black text-white italic tracking-tighter uppercase mb-2">Mapa no configurado</h3>
                <p className="text-on-surface-variant text-sm max-w-xs">
                  Para ver el mapa interactivo, configura tu <span className="text-primary-fixed font-bold">VITE_GOOGLE_MAPS_API_KEY</span> en los ajustes.
                </p>
                <div className="mt-8 grayscale invert-[0.1] contrast-[1.1] brightness-[0.6] absolute inset-0 -z-10">
                  <img 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPeJp2yJOQ9sb17oeTcbg6PAgbwxTfiD0-bGoruhmS8aR0KSmvvptn85PKOu2uM_mdoOTUslWPH7ysEDXWLyirxB8z-D5IXyjNTbgxoLEtrFYoZUh_VkGIzX5plUGA2LPZ5M561gACXmW6JRB4YAj8llYTecbcuQbla8yNxWjT85kybRHm7OTmSOhOMyJ4bHJZ0Zkt3qS5X0tRZhcCpC0M5sDAUqRFYicbJYqQl4J60f2z-U2_1PCBW-BDYJiUXweq17aV-OE-s_o" 
                    alt="Map Fallback"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 map-gradient-overlay pointer-events-none"></div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 pt-48 pb-24 px-6 overflow-y-auto space-y-4 no-scrollbar">
            {filteredCourts.map(court => (
              <div 
                key={court.id}
                onClick={() => {
                  setSelectedCourt(court);
                  setViewMode('map');
                }}
                className="bg-surface-container-low p-4 rounded-3xl border border-white/5 flex gap-4 hover:bg-surface-container-high transition-all cursor-pointer group active:scale-[0.98]"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                  <img src={court.image} alt={court.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-white font-headline font-bold uppercase italic tracking-tight">{court.name}</h4>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Icons.Star size={12} fill="currentColor" />
                        <span className="text-xs font-bold">{court.rating}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">{court.city}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-fixed font-black text-lg">${court.price} <span className="text-[10px] text-on-surface-variant font-bold uppercase">/ hora</span></span>
                    <div className="flex gap-1">
                      {court.sports.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-white/5 text-[8px] font-bold uppercase text-on-surface-variant">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Sheet Details (Only in Map View) */}
      <AnimatePresence>
        {viewMode === 'map' && !showResults && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 left-0 right-0 z-40 px-6 max-w-lg mx-auto"
          >
            <div className="bg-surface-container-low/95 backdrop-blur-2xl rounded-t-[2rem] sm:rounded-[2rem] p-5 sm:p-6 shadow-2xl border border-white/5">
              <div className="w-12 h-1.5 bg-surface-container-highest rounded-full mx-auto mb-6 sm:hidden"></div>
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-primary-fixed-dim">{selectedCourt.city}</span>
                    <span className="w-1 h-1 bg-white/20 rounded-full hidden sm:block"></span>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{selectedCourt.distance}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black font-headline text-white italic tracking-tighter uppercase leading-none">{selectedCourt.name}</h2>
                  <div className="flex items-center gap-1 mt-1 text-yellow-400">
                    <Icons.Star size={14} fill="currentColor" />
                    <span className="text-xs font-bold">{selectedCourt.rating}</span>
                    <span className="text-[10px] text-on-surface-variant ml-1 font-medium">({selectedCourt.reviews} Reseñas)</span>
                  </div>
                </div>
                <div className="bg-surface-container-high p-3 rounded-2xl flex flex-col items-center">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Desde</span>
                  <span className="text-xl font-black text-primary-fixed">${selectedCourt.price}</span>
                  <span className="text-[8px] text-on-surface-variant uppercase font-bold">/ hora</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6">
                <CourtSpec icon={<Icons.Navigation size={16} />} label="Superficie" value={selectedCourt.surface} />
                <CourtSpec icon={<Icons.Bell size={16} />} label="Iluminación" value={selectedCourt.lighting} />
                <CourtSpec icon={<Icons.Clock size={16} />} label="Horario" value={selectedCourt.schedule || 'No disponible'} />
                <div className="bg-surface-container-high p-3 sm:p-4 rounded-2xl flex items-center justify-between min-w-0">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Icons.MapPin size={16} className="text-primary-fixed-dim" />
                      <span className="text-[9px] sm:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Dirección</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-white truncate">{selectedCourt.address}</p>
                  </div>
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedCourt.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-surface-container-highest p-2 rounded-xl text-primary-fixed hover:bg-primary-fixed hover:text-on-primary-fixed transition-all"
                  >
                    <Icons.Navigation size={20} />
                  </a>
                </div>
              </div>

              {selectedCourt.features && (
                <div className="mb-8">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-3">Servicios Disponibles</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourt.features.map(feature => (
                      <span key={feature} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-white uppercase tracking-wider">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={() => onBook(selectedCourt)}
                className="w-full py-5 rounded-2xl pitch-gradient text-on-primary-fixed font-headline font-black text-xl uppercase tracking-widest shadow-2xl shadow-primary-fixed/30 active:scale-[0.98] transition-all"
              >
                Reservar Ahora
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CourtSpec({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-surface-container-high p-4 rounded-2xl flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="text-primary-fixed-dim">{icon}</div>
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-sm font-bold text-white">{value}</p>
    </div>
  );
}
