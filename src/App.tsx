import React from 'react';
import { Icons } from './components/Icons';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';

type Screen = 'home' | 'teams' | 'leagues' | 'courts' | 'profile' | 'create-team' | 'create-league' | 'manage-leagues' | 'reservations' | 'history' | 'settings' | 'support' | 'free-agents' | 'manage-team' | 'notifications';

export default function App() {
  const [currentScreen, setCurrentScreen] = React.useState<Screen>('home');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isFreeAgent, setIsFreeAgent] = React.useState(true);
  const [isAvailable, setIsAvailable] = React.useState(true);
  const [leagues, setLeagues] = React.useState([
    { id: '1', name: 'Clausura 2026', region: 'Metropolitana', teams: '24/32', status: 'Activa', startDate: '2026-06-15', prize: '1.000.000', fee: '150.000', description: 'Torneo principal de invierno.' },
    { id: '2', name: 'Copa de Verano', region: 'Valparaíso', teams: '12/16', status: 'Inscripciones', startDate: '2026-12-01', prize: '500.000', fee: '80.000', description: 'Torneo relámpago en la costa.' }
  ]);
  const [selectedLeagueId, setSelectedLeagueId] = React.useState<string | null>(null);
  const [teams, setTeams] = React.useState<any[]>([]);
  const [reservations, setReservations] = React.useState<any[]>([
    { id: '1', court: 'Club Padel Biobío', date: 'Hoy, 20:00', price: '25.000', status: 'Confirmada', image: 'https://picsum.photos/seed/padel1/400/300', type: 'Individual' },
    { id: '2', court: 'Estadio Español', date: 'Mañana, 19:00', price: '18.000', status: 'Pendiente', image: 'https://picsum.photos/seed/tennis1/400/300', type: 'Dividido', splitInfo: { totalParticipants: 4, paidParticipants: 1, amountPerPerson: 4500, participants: [{ name: 'Diego Silva', status: 'Pagado', isOrganizer: true }, { name: 'Pendiente', status: 'Pendiente', isOrganizer: false }, { name: 'Pendiente', status: 'Pendiente', isOrganizer: false }, { name: 'Pendiente', status: 'Pendiente', isOrganizer: false }] } },
  ]);
  const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false);
  const [bookingCourt, setBookingCourt] = React.useState<any>(null);
  const [selectedTeamId, setSelectedTeamId] = React.useState<string | null>(null);
  const [challenges, setChallenges] = React.useState<any[]>([
    { id: '1', challengerId: '2', challengedId: '1', status: 'Pendiente', date: '2026-04-05', time: '21:00', court: 'Club Padel Biobío' },
  ]);
  const [playerProfile, setPlayerProfile] = React.useState({
    position: 'Mediocampista',
    level: 'Pro',
    foot: 'Diestro',
    height: '1.78m',
    weight: '75kg',
    age: '24',
    stats: {
      pace: 85,
      shooting: 78,
      passing: 92,
      dribbling: 88,
      defending: 65,
      physical: 74
    }
  });

  const [standings, setStandings] = React.useState<any[]>([
    { id: '1', leagueId: '1', teamName: 'Galácticos FC', pj: 12, g: 9, e: 2, p: 1, gf: 34, gc: 12, dg: 22, pts: 29 },
    { id: '2', leagueId: '1', teamName: 'Titanes del Biobío', pj: 12, g: 8, e: 3, p: 1, gf: 28, gc: 15, dg: 13, pts: 27 },
    { id: '3', leagueId: '1', teamName: 'Rayo Penquista', pj: 12, g: 7, e: 2, p: 3, gf: 25, gc: 18, dg: 7, pts: 23 },
    { id: '4', leagueId: '1', teamName: 'Padel Kings', pj: 12, g: 6, e: 4, p: 2, gf: 22, gc: 16, dg: 6, pts: 22 },
    { id: '5', leagueId: '1', teamName: 'Sporting Concepción', pj: 12, g: 5, e: 3, p: 4, gf: 19, gc: 20, dg: -1, pts: 18 },
    { id: '6', leagueId: '1', teamName: 'Los Troncos FC', pj: 12, g: 4, e: 2, p: 6, gf: 15, gc: 22, dg: -7, pts: 14 },
    { id: '7', leagueId: '1', teamName: 'Deportivo Sur', pj: 12, g: 3, e: 1, p: 8, gf: 12, gc: 25, dg: -13, pts: 10 },
    { id: '8', leagueId: '1', teamName: 'Real Padel', pj: 12, g: 1, e: 1, p: 10, gf: 8, gc: 35, dg: -27, pts: 4 },
  ]);

  const [matches, setMatches] = React.useState<any[]>([
    { id: 'm1', leagueId: '1', homeTeam: 'Galácticos FC', awayTeam: 'Titanes del Biobío', homeScore: null, awayScore: null, date: '2026-04-05', time: '20:00', status: 'Programado' },
    { id: 'm2', leagueId: '1', homeTeam: 'Rayo Penquista', awayTeam: 'Padel Kings', homeScore: null, awayScore: null, date: '2026-04-05', time: '21:30', status: 'Programado' },
  ]);

  const [notifications, setNotifications] = React.useState<any[]>([
    { id: '1', title: '¡Nuevo Desafío!', message: 'Los Troncos FC te han desafiado para este viernes.', time: 'Hace 5 min', read: false, type: 'challenge' },
    { id: '2', title: 'Reserva Confirmada', message: 'Tu reserva en Club Padel Biobío ha sido confirmada.', time: 'Hace 1 hora', read: true, type: 'reservation' },
  ]);

  const addNotification = (title: string, message: string, type: string = 'info', actionData?: any) => {
    const newNotif = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      time: 'Ahora',
      read: false,
      type,
      actionData
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Simulated Push Notification
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        try {
          new Notification(title, { body: message });
        } catch (e) {
          console.error("Error showing notification:", e);
        }
      }
    }
  };

  const [userLocation, setUserLocation] = React.useState<{ lat: number, lng: number, city: string } | null>(null);
  const [searchRadius, setSearchRadius] = React.useState(10); // Default 10km
  const [isLocating, setIsLocating] = React.useState(false);

  React.useEffect(() => {
    handleAutoLocate();
  }, []);

  const handleAutoLocate = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, we would reverse geocode here to get the city name
          // For now, we'll mock it based on coordinates
          let city = "Ubicación Actual";
          if (latitude < -36) city = "Concepción, Biobío";
          else if (latitude < -33.2) city = "Santiago, RM";
          else city = "Valparaíso, V Región";

          setUserLocation({ lat: latitude, lng: longitude, city });
          setIsLocating(false);
          toast.success(`Ubicación detectada: ${city}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
          toast.error("No se pudo obtener tu ubicación automáticamente.");
        }
      );
    }
  };

  const handleNavigation = (screen: Screen) => {
    if (screen !== 'create-league') {
      setSelectedLeagueId(null);
    }
    setCurrentScreen(screen);
    setIsMenuOpen(false);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': return <HomeScreen onNavigate={handleNavigation} />;
      case 'courts': return <CourtsScreen userLocation={userLocation} searchRadius={searchRadius} setSearchRadius={setSearchRadius} onLocate={handleAutoLocate} isLocating={isLocating} onBook={(court) => { setBookingCourt(court); setIsBookingModalOpen(true); }} />;
      case 'teams': return <TeamsScreen isFreeAgent={isFreeAgent} setIsFreeAgent={setIsFreeAgent} playerProfile={playerProfile} userLocation={userLocation} searchRadius={searchRadius} setSearchRadius={setSearchRadius} onLocate={handleAutoLocate} isLocating={isLocating} />;
      case 'free-agents': return <FreeAgentsScreen userLocation={userLocation} searchRadius={searchRadius} setSearchRadius={setSearchRadius} onLocate={handleAutoLocate} isLocating={isLocating} />;
      case 'leagues': return <LeaguesScreen leagues={leagues} standings={standings} matches={matches} />;
      case 'profile': return <ProfileScreen onNavigate={handleNavigation} teams={teams} playerProfile={playerProfile} setPlayerProfile={setPlayerProfile} onManageTeam={(id) => { setSelectedTeamId(id); handleNavigation('manage-team'); }} />;
      case 'create-team': return <CreateTeamScreen onNavigate={handleNavigation} setTeams={setTeams} />;
      case 'manage-team': return (
        <ManageTeamScreen 
          onNavigate={handleNavigation} 
          team={teams.find(t => t.id === selectedTeamId)} 
          setTeams={setTeams}
          teams={teams}
          challenges={challenges}
          setChallenges={setChallenges}
          addNotification={addNotification}
        />
      );
      case 'create-league': return (
        <CreateLeagueScreen 
          onNavigate={handleNavigation} 
          leagues={leagues} 
          setLeagues={setLeagues} 
          selectedLeagueId={selectedLeagueId}
        />
      );
      case 'manage-leagues': return (
        <ManageLeaguesScreen 
          onNavigate={handleNavigation} 
          leagues={leagues} 
          setLeagues={setLeagues} 
          onEdit={(id) => {
            setSelectedLeagueId(id);
            setCurrentScreen('create-league');
          }}
          matches={matches}
          setMatches={setMatches}
          setStandings={setStandings}
          addNotification={addNotification}
        />
      );
      case 'reservations': return <ReservationsScreen reservations={reservations} setReservations={setReservations} />;
      case 'history': return <MatchHistoryScreen />;
      case 'settings': return <SettingsScreen />;
      case 'support': return <SupportScreen />;
      case 'notifications': return (
        <NotificationsScreen 
          notifications={notifications} 
          setNotifications={setNotifications} 
          setChallenges={setChallenges}
          teams={teams}
        />
      );
      default: return <HomeScreen onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-sans selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Toaster position="top-center" expand={false} richColors theme="dark" />
      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-gradient-to-b from-[#1c1b1b] to-transparent">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="text-primary-fixed hover:opacity-80 transition-opacity active:scale-95 duration-200"
          >
            <Icons.Menu size={24} />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black text-white italic tracking-tighter font-headline">THE PITCH</h1>
          </div>
          
          {/* Location Selector in Header */}
          <div className="relative group/loc">
            <div 
              onClick={() => {
                if (currentScreen !== 'teams' && currentScreen !== 'courts') {
                  handleNavigation('courts');
                }
              }}
              className="flex items-center gap-2 bg-surface-container-high/50 px-4 py-2 rounded-full border border-white/5 cursor-pointer hover:bg-surface-container-high transition-colors"
            >
              <Icons.MapPin size={14} className={isLocating ? "animate-bounce text-primary-fixed" : "text-primary-fixed"} />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest truncate max-w-[100px]">
                {userLocation ? userLocation.city : 'Seleccionar Ubicación'}
              </span>
              <Icons.ChevronRight size={12} className="text-on-surface-variant rotate-90" />
            </div>
            
            {/* Quick Location Dropdown */}
            <div className="absolute top-full left-0 mt-2 w-64 bg-surface-container-low/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 opacity-0 translate-y-2 pointer-events-none group-hover/loc:opacity-100 group-hover/loc:translate-y-0 transition-all z-[100] shadow-2xl">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">Cambiar Ciudad</p>
              <div className="space-y-1">
                {[
                  { name: 'Santiago, RM', lat: -33.4489, lng: -70.6693 },
                  { name: 'Valparaíso, V Región', lat: -33.0472, lng: -71.6127 },
                  { name: 'Concepción, Biobío', lat: -36.8201, lng: -73.0444 }
                ].map(city => (
                  <button 
                    key={city.name}
                    onClick={() => {
                      setUserLocation(city);
                      toast.success(`Buscando en ${city.name}`);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors ${userLocation?.city === city.name ? 'bg-primary-fixed text-black' : 'text-white hover:bg-white/5'}`}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
              <div className="h-px bg-white/10 my-3"></div>
              <button 
                onClick={handleAutoLocate}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary-fixed/10 text-primary-fixed text-[10px] font-bold uppercase tracking-widest hover:bg-primary-fixed/20 transition-colors"
              >
                <Icons.Navigation size={12} />
                Detectar GPS
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleNavigation('notifications')}
            className="bg-surface-container-high rounded-full p-2 hover:opacity-80 transition-all cursor-pointer relative active:scale-95"
          >
            <Icons.Bell size={18} className="text-white" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary-fixed rounded-full border-2 border-[#1c1b1b] shadow-[0_0_8px_rgba(183,255,0,0.6)] animate-pulse"></span>
            )}
          </button>
          <div 
            onClick={() => handleNavigation('profile')}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed hover:opacity-80 transition-opacity cursor-pointer active:scale-95 duration-200"
          >
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKERZ9pVRwZ9IqfMnH-RMGByiQuXX1ff_C5zvqvFa7FJBrXiwkpY_kX8E8hGuVeK1g537Ts8LN_QpaG-Qu3mZXppkSxODkcdANsAmmXfX3S7q4E9_sezFvEkBEFCGyxlFD_XaGmKula-oZGcKCKx60DawInUwXje-OiaX08ZU7YC1Qz8MrstMZq0ohjwXDj4y6WaQtrtdlRHYo1_oCN4LchxAV0NEeuUKxPx9Qoqlnc2DvBRCcrbYYvwGnFc5_1sg1MQjn8qGMOFA" 
              alt="Profile"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>

        <BookingModal 
          isOpen={isBookingModalOpen} 
          onClose={() => setIsBookingModalOpen(false)} 
          court={bookingCourt}
          onConfirm={(res) => {
            setReservations(prev => [res, ...prev]);
            setIsBookingModalOpen(false);
            addNotification(
              'Reserva Confirmada',
              `Tu reserva en ${res.courtName} para el ${res.date} a las ${res.time} ha sido confirmada.`,
              'reservation'
            );
            setCurrentScreen('reservations');
          }}
        />
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 w-full z-50 rounded-t-3xl bg-[#1c1b1b]/90 backdrop-blur-xl shadow-[0_-8px_30px_rgb(0,0,0,0.12)] flex justify-around items-center px-2 pb-6 pt-3">
        <NavItem 
          icon={<Icons.Home size={24} />} 
          label="Inicio" 
          active={currentScreen === 'home'} 
          onClick={() => setCurrentScreen('home')} 
        />
        <NavItem 
          icon={<Icons.Search size={24} />} 
          label="Agentes" 
          active={currentScreen === 'free-agents'} 
          onClick={() => setCurrentScreen('free-agents')} 
        />
        <NavItem 
          icon={<Icons.Users size={24} />} 
          label="Equipos" 
          active={currentScreen === 'teams'} 
          onClick={() => setCurrentScreen('teams')} 
        />
        <NavItem 
          icon={<Icons.Trophy size={24} />} 
          label="Ligas" 
          active={currentScreen === 'leagues'} 
          onClick={() => setCurrentScreen('leagues')} 
        />
        <NavItem 
          icon={<Icons.MapPin size={24} />} 
          label="Canchas" 
          active={currentScreen === 'courts'} 
          onClick={() => setCurrentScreen('courts')} 
        />
        <NavItem 
          icon={<Icons.User size={24} />} 
          label="Perfil" 
          active={currentScreen === 'profile'} 
          onClick={() => setCurrentScreen('profile')} 
        />
      </nav>

      {/* Side Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] md:w-80 bg-[#131313] z-[70] rounded-r-2xl overflow-y-auto flex flex-col p-8 no-scrollbar"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary-fixed p-1 bg-surface-container-low">
                    <img 
                      className="w-full h-full object-cover rounded-xl" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNlMsaIxKAx1JJ9FSYpvJp99JfPF5GpYpRQeT9A-gYguKAJNm0Y7Jsz7YVsby1hoGxcCcWq-OB_H3n3yWiVqome5QCWBRmhn2SwFp0a_blQbA9UhU_kRBcKr1pOI-3mz4liwXqubaJ5q6Jd5B2NT0tSEptiNtaWqMjxi4u4igKREbcQRvawJYERibAhEOzmG8c6coxH6aSxY3U5znjj-q29lMg1tcUqrFQogBBEd3GzrbTMz-6lOesti7d5zwpvRQVmFoRab0LU8A" 
                      alt="Diego Silva"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-primary-fixed text-black text-[10px] font-black px-1.5 py-0.5 rounded italic">PRO</div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-headline font-bold text-xl tracking-tight">Diego Silva</h3>
                    <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                  </div>
                  <p className="text-primary-fixed text-xs font-semibold uppercase tracking-widest">Pro Tier Member</p>
                </div>
              </div>

              <nav className="flex-1 space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em] px-4 mb-2">Acciones Rápidas</p>
                  <DrawerItem icon={<Icons.Plus size={20} />} label="Crear mi Equipo" onClick={() => handleNavigation('create-team')} />
                  <DrawerItem icon={<Icons.Trophy size={20} />} label="Organizar Liga" onClick={() => handleNavigation('manage-leagues')} />
                  <DrawerItem icon={<Icons.MapPin size={20} />} label="Buscar Canchas" onClick={() => handleNavigation('courts')} />
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em] px-4 mb-2">Comunidad</p>
                  <DrawerItem icon={<Icons.Users size={20} />} label="Agentes Libres" onClick={() => handleNavigation('free-agents')} />
                  <DrawerItem icon={<Icons.ShieldCheck size={20} />} label="Ligas Disponibles" onClick={() => handleNavigation('leagues')} />
                  <DrawerItem icon={<Icons.Search size={20} />} label="Buscar Equipos" onClick={() => handleNavigation('teams')} />
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em] px-4 mb-2">Mi Actividad</p>
                  <DrawerItem icon={<Icons.Calendar size={20} />} label="Mis Reservas" onClick={() => handleNavigation('reservations')} />
                  <DrawerItem icon={<Icons.Trophy size={20} />} label="Mis Equipos" onClick={() => handleNavigation('profile')} />
                  <DrawerItem icon={<Icons.History size={20} />} label="Historial" onClick={() => handleNavigation('history')} />
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em] px-4 mb-2">Cuenta</p>
                  <div 
                    onClick={() => {
                      setIsAvailable(!isAvailable);
                      toast.success(isAvailable ? 'Ya no estás disponible' : 'Ahora estás disponible para jugar');
                    }}
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-surface-container-high border border-white/5 cursor-pointer hover:bg-surface-container-highest transition-colors"
                  >
                    <div className="flex items-center gap-4 text-primary-fixed">
                      <Icons.User size={20} />
                      <span className="font-headline font-bold text-sm">Disponibilidad</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative flex items-center px-1 transition-colors ${isAvailable ? 'bg-primary-fixed' : 'bg-white/20'}`}>
                      <div className={`w-3.5 h-3.5 bg-black rounded-full absolute transition-all ${isAvailable ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                  <DrawerItem icon={<Icons.Settings size={20} />} label="Configuración" onClick={() => handleNavigation('settings')} />
                  <DrawerItem icon={<Icons.HelpCircle size={20} />} label="Soporte" onClick={() => handleNavigation('support')} />
                </div>
              </nav>

              <button 
                onClick={() => toast.error('Sesión cerrada')}
                className="flex items-center gap-4 px-4 py-3.5 w-full text-red-400 hover:bg-red-400/10 rounded-xl transition-colors mt-auto"
              >
                <Icons.LogOut size={20} />
                <span className="font-headline font-bold text-sm uppercase tracking-widest">Cerrar Sesión</span>
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
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

function DrawerItem({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
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

function HomeScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
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

function ActionCard({ icon, title, desc, color, iconColor = "text-on-primary-fixed", onClick }: { icon: React.ReactNode, title: string, desc: string, color: string, iconColor?: string, onClick?: () => void }) {
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

function EventCard({ date, month, title, location, status, isAction, onAction }: { date: string, month: string, title: string, location: string, status: string, isAction?: boolean, onAction?: () => void }) {
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

const COURTS = [
  {
    id: '1',
    name: 'Estadio Italiano',
    address: 'Av. Apoquindo 6589, Las Condes',
    lat: -33.4115,
    lng: -70.5664,
    rating: 4.9,
    reviews: 128,
    price: '24k',
    surface: 'Pasto Sintético Pro',
    lighting: 'Estadio 1200 Lux',
    city: 'Vitacura, Santiago',
    distance: '3.2 km',
    sports: ['Fútbol', 'Padel'],
    image: 'https://picsum.photos/seed/stadium/400/300',
    schedule: '08:00 - 23:00',
    features: ['Estacionamiento', 'Camarines', 'Cafetería']
  },
  {
    id: '2',
    name: 'Club Padel Oriente',
    address: 'Av. Las Condes 12345, Lo Barnechea',
    lat: -33.3715,
    lng: -70.5164,
    rating: 4.7,
    reviews: 85,
    price: '18k',
    surface: 'Cristal Panorámico',
    lighting: 'LED Pro',
    city: 'Lo Barnechea, Santiago',
    distance: '5.1 km',
    sports: ['Padel'],
    image: 'https://picsum.photos/seed/padel/400/300',
    schedule: '07:00 - 00:00',
    features: ['Estacionamiento', 'Bar', 'Tienda Pro']
  },
  {
    id: '5',
    name: 'Club de Campo Bellavista',
    address: 'Camino a Penco 3010, Concepción',
    lat: -36.7834,
    lng: -73.0123,
    rating: 4.8,
    reviews: 342,
    price: '20k',
    surface: 'Pasto Natural / Sintético',
    lighting: 'LED Profesional',
    city: 'Concepción, Bio Bio',
    distance: '1.5 km',
    sports: ['Fútbol', 'Padel', 'Tenis'],
    image: 'https://picsum.photos/seed/bellavista/400/300',
    schedule: '08:00 - 22:00',
    features: ['Estacionamiento', 'Camarines', 'Quincho', 'Piscina']
  },
  {
    id: '6',
    name: 'Complejo El Venado',
    address: 'Av. El Venado 560, San Pedro de la Paz',
    lat: -36.8542,
    lng: -73.1021,
    rating: 4.9,
    reviews: 156,
    price: '22k',
    surface: 'Cristal Panorámico Pro',
    lighting: 'LED 1000 Lux',
    city: 'San Pedro de la Paz, Bio Bio',
    distance: '4.2 km',
    sports: ['Padel', 'Fútbol'],
    image: 'https://picsum.photos/seed/venado/400/300',
    schedule: '07:00 - 23:30',
    features: ['Estacionamiento', 'Cafetería', 'Gimnasio']
  },
  {
    id: '7',
    name: 'Estadio Español Chiguayante',
    address: 'Pascual Binimelis 401, Chiguayante',
    lat: -36.9123,
    lng: -73.0234,
    rating: 4.7,
    reviews: 218,
    price: '16k',
    surface: 'Arcilla / Sintético',
    lighting: 'Halógena Pro',
    city: 'Chiguayante, Bio Bio',
    distance: '8.5 km',
    sports: ['Fútbol', 'Tenis', 'Padel'],
    image: 'https://picsum.photos/seed/espanol/400/300',
    schedule: '09:00 - 21:00',
    features: ['Estacionamiento', 'Restaurante', 'Club House']
  },
  {
    id: '8',
    name: 'Padel Oriente Concepción',
    address: 'Av. Jorge Alessandri 3177, Talcahuano',
    lat: -36.7912,
    lng: -73.0645,
    rating: 4.6,
    reviews: 94,
    price: '19k',
    surface: 'Cristal Pro',
    lighting: 'LED Alta Eficiencia',
    city: 'Talcahuano, Bio Bio',
    distance: '5.8 km',
    sports: ['Padel'],
    image: 'https://picsum.photos/seed/padelconcepcion/400/300',
    schedule: '07:30 - 23:00',
    features: ['Estacionamiento', 'Tienda', 'Bar']
  },
  {
    id: '9',
    name: 'Club Hípico Concepción',
    address: 'Av. Colón 1101, Hualpén',
    lat: -36.7989,
    lng: -73.0876,
    rating: 4.4,
    reviews: 120,
    price: '14k',
    surface: 'Pasto Sintético',
    lighting: 'LED Estándar',
    city: 'Hualpén, Bio Bio',
    distance: '6.2 km',
    sports: ['Fútbol'],
    image: 'https://picsum.photos/seed/hipico/400/300',
    schedule: '08:00 - 22:30',
    features: ['Estacionamiento', 'Camarines']
  }
];

function CourtsScreen({ userLocation, searchRadius, setSearchRadius, onLocate, isLocating, onBook }: { userLocation: any, searchRadius: number, setSearchRadius: (r: number) => void, onLocate: () => void, isLocating: boolean, onBook: (court: any) => void }) {
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
          <div className="absolute inset-0 pt-48 pb-24 px-6 overflow-y-auto space-y-4">
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

const FREE_AGENTS = [
  {
    id: 'p1',
    name: "Matías Rojas",
    position: "Portero",
    level: "Nivel Pro",
    city: "Santiago, RM",
    lat: -33.4489,
    lng: -70.6693,
    age: 26,
    rating: 4.8,
    matches: 142,
    image: "https://picsum.photos/seed/matias/200/200",
    tags: ['Reflejos Top', 'Salida Rápida']
  },
  {
    id: 'p2',
    name: "Valentina Soto",
    position: "Mediocampista",
    level: "Semi-Pro",
    city: "Valparaíso, V Región",
    lat: -33.0472,
    lng: -71.6127,
    age: 23,
    rating: 4.9,
    matches: 89,
    image: "https://picsum.photos/seed/valentina/200/200",
    tags: ['Visión de Juego', 'Pase Preciso']
  },
  {
    id: 'p3',
    name: "Lucas Herrera",
    position: "Delantero",
    level: "Amateur",
    city: "Concepción, Biobío",
    lat: -36.8201,
    lng: -73.0444,
    age: 21,
    rating: 4.5,
    matches: 56,
    image: "https://picsum.photos/seed/lucas/200/200",
    tags: ['Goleador', 'Velocidad']
  },
  {
    id: 'p4',
    name: "Camila Paz",
    position: "Defensa",
    level: "Nivel Pro",
    city: "Santiago, RM",
    lat: -33.4567,
    lng: -70.6482,
    age: 28,
    rating: 4.7,
    matches: 210,
    image: "https://picsum.photos/seed/camila/200/200",
    tags: ['Muro', 'Liderazgo']
  }
];

function FreeAgentsScreen({ userLocation, searchRadius, setSearchRadius, onLocate, isLocating }: { userLocation: any, searchRadius: number, setSearchRadius: (r: number) => void, onLocate: () => void, isLocating: boolean }) {
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

const TEAMS = [
  {
    id: '1',
    name: "Los Galácticos FC",
    location: "Santiago, Región Metropolitana",
    region: "Metropolitana",
    lat: -33.4489,
    lng: -70.6693,
    level: "Nivel Pro",
    format: "11v11",
    wins: "32",
    rating: "4.9",
    tags: ['Nivel Pro', 'Solo 11v11', 'Equipo Verificado'],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAi6vS-kH7CiybQZ6Hdak9-oDKsUH2bo4SfS94pqy22Y5bLdA9fIk_FkX17IG0hnvqd9feZuRoYnv-avNPsFuENz5ix4MILQmhi_qjCN25knqbk-hixvZF0aJ5Wg3PteZe02mgt7Gy5BB-pF1EGDGgZetLbkwfqB2TQrE4ux6d__mUmSCLH2nY_KyIekDhwA654UfzibmbA1u4tx6bQ7sdTx3NJ2rqhUrOhY_FlExhakbBXLSmxP6iGO_njxdT4wAmIeaaNhcOhwOM"
  },
  {
    id: '2',
    name: "Andino Wanderers",
    location: "Valparaíso, V Región",
    region: "Valparaíso",
    lat: -33.0472,
    lng: -71.6127,
    level: "Amateur",
    format: "7v7",
    wins: "18",
    rating: "4.7",
    tags: ['Amateur', '7v7 / 5v5'],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2A_T7Y-NQ6Qp2kxhsICjet92-FTP43ZTed4cltXiAxYUFCviWlZ5jPyzZVmNwiZkVr01dmOQe7tUbGk_FuFgbv7CgIkmD2Yobhie9AxCEQhdM8jTtInV2iF2oYgGa_cMAfLMnm_1_5ufqjXiTI1SvvHTcX9BxjaILwlXQNUZxHVq1lWqMwdp2z2R0kLQbztqH_JQ-_MYFio7-yMiXkG7BVgn7yaMoegro91J2tpfLcam4Ft7CfTukWfc4ROHNG7iCpp4fsjTC0kY"
  },
  {
    id: '3',
    name: "Bio Bio Lions",
    location: "Concepción, Bio Bio",
    region: "Bio Bio",
    lat: -36.8201,
    lng: -73.0444,
    level: "Nivel Pro",
    format: "11v11",
    wins: "25",
    rating: "4.8",
    tags: ['Nivel Pro', 'Bio Bio', 'Competitivo'],
    image: "https://picsum.photos/seed/lions/400/300"
  },
  {
    id: '4',
    name: "Padel Masters Concepción",
    location: "Talcahuano, Bio Bio",
    region: "Bio Bio",
    lat: -36.7167,
    lng: -73.1167,
    level: "Semi-Pro",
    format: "5v5",
    wins: "12",
    rating: "4.5",
    tags: ['Semi-Pro', 'Sintético'],
    image: "https://picsum.photos/seed/padelmasters/400/300"
  },
  {
    id: '5',
    name: "Real Talcahuano",
    location: "Talcahuano, Bio Bio",
    region: "Bio Bio",
    lat: -36.7200,
    lng: -73.1200,
    level: "Amateur",
    format: "11v11",
    wins: "8",
    rating: "4.2",
    tags: ['Amateur', 'Comunitario'],
    image: "https://picsum.photos/seed/talcahuano/400/300"
  }
];

function TeamsScreen({ isFreeAgent, setIsFreeAgent, playerProfile, userLocation, searchRadius, setSearchRadius, onLocate, isLocating }: { isFreeAgent: boolean, setIsFreeAgent: (val: boolean) => void, playerProfile: any, userLocation: any, searchRadius: number, setSearchRadius: (r: number) => void, onLocate: () => void, isLocating: boolean }) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [regionFilter, setRegionFilter] = React.useState('Todas');
  const [levelFilter, setLevelFilter] = React.useState('Todos');
  const [formatFilter, setFormatFilter] = React.useState('Todos');
  const [showRadiusFilter, setShowRadiusFilter] = React.useState(false);

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
    <div className="pt-24 px-6 max-w-7xl mx-auto">
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
                name={team.name} 
                location={team.location} 
                wins={team.wins} 
                rating={team.rating} 
                tags={team.tags}
                image={team.image}
                playerProfile={playerProfile}
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
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (val: string) => void }) {
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

function TeamCard({ name, location, wins, rating, tags, image, playerProfile }: { name: string, location: string, wins: string, rating: string, tags: string[], image: string, key?: string, playerProfile: any }) {
  const [showChallengeModal, setShowChallengeModal] = React.useState(false);
  const [showJoinModal, setShowJoinModal] = React.useState(false);

  return (
    <>
      <div className="bg-surface-container-high rounded-xl overflow-hidden group border border-white/5">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-64 h-64 md:h-auto overflow-hidden relative">
            <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded uppercase">Club de Élite</span>
            </div>
          </div>
          <div className="flex-1 p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-headline font-extrabold text-3xl text-white italic tracking-tighter uppercase mb-1">{name}</h3>
                <p className="text-on-surface-variant flex items-center gap-2 text-sm">
                  <Icons.MapPin size={14} /> {location}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-primary-fixed mb-1">
                  <Icons.Star size={20} fill="currentColor" />
                  <span className="font-headline font-bold text-xl">{rating}</span>
                </div>
                <p className="text-on-surface-variant text-[10px] uppercase tracking-widest">{wins} Victorias</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mb-8">
              {tags.map(tag => (
                <div key={tag} className="bg-surface-container-low px-4 py-2 rounded-lg flex items-center gap-3">
                  <Icons.CheckCircle2 size={16} className="text-primary-fixed-dim" />
                  <span className="text-sm font-medium">{tag}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowChallengeModal(true)}
                className="pitch-gradient flex-1 py-4 rounded-xl font-headline font-black uppercase tracking-widest text-on-primary-fixed active:scale-95 transition-transform"
              >
                Desafiar Equipo
              </button>
              <button 
                onClick={() => setShowJoinModal(true)}
                className="border border-white/10 flex-1 py-4 rounded-xl font-headline font-black uppercase tracking-widest text-white hover:bg-white/5 active:scale-95 transition-transform"
              >
                Unirse al Plantel
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showChallengeModal && (
          <Modal 
            title={`Desafiar a ${name}`} 
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
                  toast.success(`¡Desafío enviado a ${name}!`);
                  setShowChallengeModal(false);
                }}
                className="w-full pitch-gradient py-4 rounded-xl text-on-primary-fixed font-headline font-black uppercase tracking-widest"
              >
                Enviar Desafío Oficial
              </button>
            </div>
          </Modal>
        )}

        {showJoinModal && (
          <Modal 
            title={`Postular a ${name}`} 
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
                <p className="text-on-surface-variant text-sm">Al postular, el capitán de <strong>{name}</strong> podrá ver tus estadísticas de los últimos 10 partidos y tu reputación en la liga.</p>
                
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
                  toast.success(`Tu postulación ha sido enviada a ${name}`);
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
    </>
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

function LeaguesScreen({ leagues, standings, matches }: { leagues: any[], standings: any[], matches: any[] }) {
  const activeLeagues = leagues.filter(l => l.status === 'Inscripciones' || l.status === 'Activa');
  const featuredLeague = activeLeagues[0] || leagues[0];

  if (!featuredLeague) {
    return (
      <div className="pt-24 px-6 max-w-7xl mx-auto text-center py-40">
        <Icons.Trophy size={64} className="mx-auto text-on-surface-variant/20 mb-6" />
        <h2 className="text-3xl font-headline font-bold text-white mb-2">No hay ligas disponibles</h2>
        <p className="text-on-surface-variant">Vuelve pronto para ver nuevas competiciones.</p>
      </div>
    );
  }

  const leagueStandings = standings.filter(s => s.leagueId === featuredLeague.id);
  const leagueMatches = matches.filter(m => m.leagueId === featuredLeague.id);

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto space-y-12 pb-24">
      <section>
        <div className="relative w-full rounded-[3rem] overflow-hidden min-h-[450px] flex flex-col justify-end p-8 md:p-16 mb-12 group border border-white/5 shadow-2xl">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAq9fN_YopF1vWxhgl-zRng3OSwKkcpiuCqhwf8MueCcaojSCDtWLIdImXwqRjN69nTd1GX1_RUwvLgr-8GEXzyBjH2CvInE4PyI4GnrpxfLvaFRNqsFeTyOzJQroG8delPIpwKm2UAgKU4qMgLuzA9WU7ntBpc7L-fq4gfvCybq9yUPuYL_hI1GoxxVwz_0vaaooMQk5LOpyw_2vyQ3nWJLOFY2bn3bP9OrCE6F_pp6FJAFcCJfGAe_DQY-HjWnpWlisBM2ty5naE" 
            alt="Stadium" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/60 to-transparent"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-fixed/20 text-primary-fixed text-xs font-black uppercase tracking-[0.2em] mb-4 border border-primary-fixed/30 backdrop-blur-md">
                {featuredLeague.status === 'Inscripciones' ? 'Inscripciones Abiertas' : 'Torneo en Curso'}
              </div>
              <h2 className="text-6xl md:text-8xl font-headline font-black tracking-tighter text-white uppercase italic leading-[0.85]">{featuredLeague.name}</h2>
              <div className="flex flex-wrap items-center gap-8 text-on-surface-variant font-bold text-sm uppercase tracking-widest mt-4">
                <span className="flex items-center gap-3"><Icons.MapPin size={20} className="text-primary-fixed" /> {featuredLeague.region}</span>
                <span className="flex items-center gap-3"><Icons.Calendar size={20} className="text-primary-fixed" /> Inicio {featuredLeague.startDate}</span>
                <span className="flex items-center gap-3"><Icons.Trophy size={20} className="text-primary-fixed" /> ${featuredLeague.prize} CLP</span>
              </div>
            </div>
            <button 
              onClick={() => toast.success(`Redirigiendo a inscripción para ${featuredLeague.name}...`)}
              className="pitch-gradient text-on-primary-fixed px-10 py-5 rounded-2xl font-headline font-black text-xl active:scale-95 transition-all shadow-2xl shadow-primary-fixed/30 flex items-center gap-4 uppercase tracking-widest italic"
            >
              Inscribirme <Icons.Plus size={24} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LeagueStat label="Fondo de Premios" value={`$${featuredLeague.prize} CLP`} desc="Distribuido entre los mejores" onClick={() => toast.info('Detalles de premios próximamente')} />
          <LeagueStat label="Equipos Inscritos" value={featuredLeague.teams} progress={parseInt(featuredLeague.teams.split('/')[0]) / parseInt(featuredLeague.teams.split('/')[1]) * 100} onClick={() => toast.info('Lista de equipos inscritos')} />
          <LeagueStat label="Costo Inscripción" value={`$${featuredLeague.fee}`} desc="Incluye arbitraje y seguro" onClick={() => toast.info('Detalles de costos')} />
        </div>
      </section>

      {/* Standings Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl font-headline font-black text-white italic tracking-tighter uppercase">Tabla de <span className="text-primary-fixed">Posiciones</span></h3>
          <div className="flex items-center gap-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Ascenso</span>
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Descenso</span>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-[2.5rem] border border-white/5 overflow-hidden shadow-xl">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-6 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Pos</th>
                  <th className="px-6 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Equipo</th>
                  <th className="px-6 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] text-center">PJ</th>
                  <th className="px-6 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] text-center">G</th>
                  <th className="px-6 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] text-center">E</th>
                  <th className="px-6 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] text-center">P</th>
                  <th className="px-6 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] text-center hidden md:table-cell">GF</th>
                  <th className="px-6 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] text-center hidden md:table-cell">GC</th>
                  <th className="px-6 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] text-center">DG</th>
                  <th className="px-6 py-5 text-[10px] font-black text-primary-fixed uppercase tracking-[0.2em] text-center bg-primary-fixed/5">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leagueStandings.map((team, index) => (
                  <tr key={team.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-headline font-black text-sm ${index < 2 ? 'bg-green-500/20 text-green-400' : index > 5 ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-on-surface-variant'}`}>
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-white font-headline font-bold border border-white/5 group-hover:border-primary-fixed/30 transition-colors">
                          {team.teamName.charAt(0)}
                        </div>
                        <span className="font-headline font-bold text-white uppercase italic tracking-tight">{team.teamName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center font-bold text-white">{team.pj}</td>
                    <td className="px-6 py-5 text-center font-bold text-green-400">{team.g}</td>
                    <td className="px-6 py-5 text-center font-bold text-on-surface-variant">{team.e}</td>
                    <td className="px-6 py-5 text-center font-bold text-red-400">{team.p}</td>
                    <td className="px-6 py-5 text-center font-medium text-on-surface-variant hidden md:table-cell">{team.gf}</td>
                    <td className="px-6 py-5 text-center font-medium text-on-surface-variant hidden md:table-cell">{team.gc}</td>
                    <td className="px-6 py-5 text-center font-bold text-white">{team.dg > 0 ? `+${team.dg}` : team.dg}</td>
                    <td className="px-6 py-5 text-center font-headline font-black text-xl text-primary-fixed bg-primary-fixed/5">{team.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Matches Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl font-headline font-black text-white italic tracking-tighter uppercase">Resultados y <span className="text-primary-fixed">Calendario</span></h3>
          <button className="text-primary-fixed text-xs font-black uppercase tracking-widest hover:underline">Ver Todo</button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {leagueMatches.map(match => (
            <div key={match.id} className="bg-surface-container-low p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-surface-container-high transition-all group">
              <div className="flex items-center gap-6 flex-1 justify-center md:justify-start">
                <div className="text-right flex-1 hidden md:block">
                  <p className="text-white font-headline font-bold uppercase italic tracking-tight">{match.homeTeam}</p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                  <span className={`text-2xl font-black ${match.status === 'Finalizado' ? 'text-white' : 'text-on-surface-variant'}`}>{match.homeScore ?? '-'}</span>
                  <span className="text-on-surface-variant font-black">VS</span>
                  <span className={`text-2xl font-black ${match.status === 'Finalizado' ? 'text-white' : 'text-on-surface-variant'}`}>{match.awayScore ?? '-'}</span>
                </div>
                <div className="text-left flex-1 hidden md:block">
                  <p className="text-white font-headline font-bold uppercase italic tracking-tight">{match.awayTeam}</p>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-1 min-w-[120px]">
                <p className="text-[10px] font-black text-primary-fixed uppercase tracking-widest">{match.date}</p>
                <p className="text-xs font-bold text-on-surface-variant">{match.time} hrs</p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border ${match.status === 'Finalizado' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-on-surface-variant border-white/5'}`}>
                  {match.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl font-headline font-black text-white italic tracking-tighter uppercase">Otras <span className="text-primary-fixed">Competiciones</span></h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl bg-surface-container-high text-white text-xs font-bold uppercase tracking-widest border border-white/5">Región</button>
            <button className="px-4 py-2 rounded-xl bg-surface-container-high text-white text-xs font-bold uppercase tracking-widest border border-white/5">Formato</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leagues.filter(l => l.id !== featuredLeague.id).map(league => (
            <div key={league.id} className="bg-surface-container-low p-8 rounded-[2.5rem] border border-white/5 hover:bg-surface-container-high transition-all group flex flex-col justify-between gap-8">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h4 className="text-2xl font-headline font-black text-white uppercase italic tracking-tight">{league.name}</h4>
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${league.status === 'Activa' ? 'bg-green-500/20 text-green-400' : 'bg-primary-fixed/20 text-primary-fixed'}`}>
                      {league.status}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-xs font-medium max-w-xs">{league.description}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary-fixed group-hover:scale-110 transition-transform">
                  <Icons.Trophy size={24} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Premio</p>
                  <p className="text-lg font-black text-white tracking-tight">${league.prize}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Inscripción</p>
                  <p className="text-lg font-black text-white tracking-tight">${league.fee}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  <span className="flex items-center gap-2"><Icons.MapPin size={14} className="text-primary-fixed" /> {league.region}</span>
                  <span className="flex items-center gap-2"><Icons.Users size={14} className="text-primary-fixed" /> {league.teams}</span>
                </div>
                <button 
                  onClick={() => toast.success(`Redirigiendo a inscripción para ${league.name}...`)}
                  className="text-primary-fixed text-xs font-black uppercase tracking-widest hover:underline"
                >
                  Inscribirme
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function LeagueStat({ label, value, desc, progress, onClick }: { label: string, value: string, desc?: string, progress?: number, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-surface-container-low p-6 rounded-3xl space-y-4 cursor-pointer hover:bg-surface-container transition-colors"
    >
      <p className="text-on-surface-variant text-xs uppercase tracking-widest">{label}</p>
      <p className="text-4xl font-headline font-bold text-white">{value}</p>
      {progress !== undefined ? (
        <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
          <div className="bg-primary-fixed h-full" style={{ width: `${progress}%` }}></div>
        </div>
      ) : (
        <p className="text-on-surface-variant text-sm">{desc}</p>
      )}
    </div>
  );
}

function TableRow({ pos, name, stats, pts, active, onClick }: { pos: string, name: string, stats: string, pts: string, active?: boolean, onClick?: () => void }) {
  return (
    <tr 
      onClick={onClick}
      className="hover:bg-surface-container-high transition-colors cursor-pointer"
    >
      <td className={`px-6 py-5 font-headline font-bold text-lg ${active ? 'text-primary-fixed' : 'text-on-surface-variant'}`}>{pos}</td>
      <td className="px-6 py-5 flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-white font-black text-xs">
          {name.substring(0, 2).toUpperCase()}
        </div>
        <span className="font-semibold text-white">{name}</span>
      </td>
      <td className="px-6 py-5 text-center text-on-surface font-medium">{stats}</td>
      <td className="px-6 py-5 text-right font-headline font-bold text-white">{pts}</td>
    </tr>
  );
}

function ProfileStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-surface-container-low p-6 rounded-2xl text-center border border-white/5">
      <p className="text-xs text-on-surface-variant uppercase mb-1 font-bold tracking-widest">{label}</p>
      <p className="text-2xl font-headline font-bold text-white">{value}</p>
    </div>
  );
}

function EditProfileModal({ isOpen, onClose, profile, onSave }: { isOpen: boolean, onClose: () => void, profile: any, onSave: (p: any) => void }) {
  const [formData, setFormData] = React.useState(profile);

  React.useEffect(() => {
    if (isOpen) {
      setFormData(profile);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
    toast.success('Perfil actualizado correctamente');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-surface-container-low rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-3xl font-headline font-black text-white italic tracking-tighter uppercase">Editar <span className="text-primary-fixed">Ficha Técnica</span></h3>
              <p className="text-on-surface-variant text-sm font-medium mt-1">Actualiza tus atributos y estadísticas</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-on-surface-variant hover:text-white transition-colors">
              <Icons.X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Physical Info */}
            <div className="space-y-6">
              <h4 className="text-white font-headline font-bold uppercase tracking-widest text-xs">Información Física</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Posición</label>
                  <select 
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full bg-surface-container-high border-none rounded-xl text-white text-sm p-3 focus:ring-2 focus:ring-primary-fixed"
                  >
                    <option>Portero</option>
                    <option>Defensa</option>
                    <option>Mediocampista</option>
                    <option>Delantero</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Pierna Hábil</label>
                  <select 
                    value={formData.foot}
                    onChange={(e) => setFormData({...formData, foot: e.target.value})}
                    className="w-full bg-surface-container-high border-none rounded-xl text-white text-sm p-3 focus:ring-2 focus:ring-primary-fixed"
                  >
                    <option>Diestro</option>
                    <option>Zurdo</option>
                    <option>Ambidiestro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Altura</label>
                  <input 
                    type="text"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    className="w-full bg-surface-container-high border-none rounded-xl text-white text-sm p-3 focus:ring-2 focus:ring-primary-fixed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Peso</label>
                  <input 
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className="w-full bg-surface-container-high border-none rounded-xl text-white text-sm p-3 focus:ring-2 focus:ring-primary-fixed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Edad</label>
                  <input 
                    type="text"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full bg-surface-container-high border-none rounded-xl text-white text-sm p-3 focus:ring-2 focus:ring-primary-fixed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Nivel</label>
                  <select 
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    className="w-full bg-surface-container-high border-none rounded-xl text-white text-sm p-3 focus:ring-2 focus:ring-primary-fixed"
                  >
                    <option>Principiante</option>
                    <option>Intermedio</option>
                    <option>Avanzado</option>
                    <option>Pro</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Stats Info */}
            <div className="space-y-6">
              <h4 className="text-white font-headline font-bold uppercase tracking-widest text-xs">Atributos (0-99)</h4>
              <div className="space-y-4">
                {Object.entries(formData.stats).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{key}</label>
                      <span className="text-primary-fixed font-black text-xs">{value as number}</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="99"
                      value={value as number}
                      onChange={(e) => setFormData({
                        ...formData, 
                        stats: { ...formData.stats, [key]: parseInt(e.target.value) }
                      })}
                      className="w-full accent-primary-fixed"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-5 rounded-2xl pitch-gradient text-on-primary-fixed font-headline font-black text-xl uppercase tracking-widest shadow-2xl shadow-primary-fixed/30 active:scale-[0.98] transition-all mt-4"
          >
            Guardar Cambios
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ProfileScreen({ onNavigate, teams, playerProfile, setPlayerProfile, onManageTeam }: { onNavigate: (screen: Screen) => void, teams: any[], playerProfile: any, setPlayerProfile: (p: any) => void, onManageTeam: (id: string) => void }) {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  return (
    <div className="pt-24 px-6 max-w-4xl mx-auto space-y-12 pb-24">
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        profile={playerProfile} 
        onSave={setPlayerProfile} 
      />
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-surface-container-low p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative">
          <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-primary-fixed p-1.5 bg-surface-container-low shadow-2xl">
            <img 
              className="w-full h-full object-cover rounded-[2rem]" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNlMsaIxKAx1JJ9FSYpvJp99JfPF5GpYpRQeT9A-gYguKAJNm0Y7Jsz7YVsby1hoGxcCcWq-OB_H3n3yWiVqome5QCWBRmhn2SwFp0a_blQbA9UhU_kRBcKr1pOI-3mz4liwXqubaJ5q6Jd5B2NT0tSEptiNtaWqMjxi4u4igKREbcQRvawJYERibAhEOzmG8c6coxH6aSxY3U5znjj-q29lMg1tcUqrFQogBBEd3GzrbTMz-6lOesti7d5zwpvRQVmFoRab0LU8A" 
              alt="Diego Silva"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-primary-fixed text-black text-xs font-black px-3 py-1 rounded-xl italic shadow-lg">{playerProfile.level.toUpperCase()}</div>
        </div>
            <div className="text-center md:text-left space-y-2">
          <h2 className="text-4xl sm:text-5xl font-headline font-black text-white italic tracking-tighter uppercase">Diego Silva</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-4 text-on-surface-variant font-medium">
            <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-xs"><Icons.MapPin size={14} className="text-primary-fixed" /> Santiago, Chile</span>
            <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-xs"><Icons.Trophy size={14} className="text-primary-fixed" /> Capitán</span>
            <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-xs"><Icons.Star size={14} className="text-primary-fixed" /> 4.9 Rating</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ProfileStat label="Partidos" value="124" />
        <ProfileStat label="Goles" value="86" />
        <ProfileStat label="Asistencias" value="42" />
        <ProfileStat label="MVP" value="12" />
      </div>

      {/* Technical Sheet (Ficha Técnica) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-headline font-bold text-white italic tracking-tighter uppercase">Ficha <span className="text-primary-fixed">Técnica</span></h3>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="text-primary-fixed text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-2"
          >
            <Icons.Edit size={14} /> Editar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Physical & Preferences */}
          <div className="bg-surface-container-low p-8 rounded-3xl border border-white/5 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <TechInfo label="Posición" value={playerProfile.position} />
              <TechInfo label="Pierna Hábil" value={playerProfile.foot} />
              <TechInfo label="Altura" value={playerProfile.height} />
              <TechInfo label="Peso" value={playerProfile.weight} />
              <TechInfo label="Edad" value={playerProfile.age} />
              <TechInfo label="Nivel" value={playerProfile.level} />
            </div>
          </div>

          {/* Skill Radar (Simplified) */}
          <div className="bg-surface-container-low p-8 rounded-3xl border border-white/5 space-y-6">
            <h4 className="text-white font-headline font-bold uppercase tracking-widest text-xs">Atributos</h4>
            <div className="space-y-4">
              <SkillBar label="Ritmo" value={playerProfile.stats.pace} />
              <SkillBar label="Tiro" value={playerProfile.stats.shooting} />
              <SkillBar label="Pase" value={playerProfile.stats.passing} />
              <SkillBar label="Regate" value={playerProfile.stats.dribbling} />
              <SkillBar label="Defensa" value={playerProfile.stats.defending} />
              <SkillBar label="Físico" value={playerProfile.stats.physical} />
            </div>
          </div>
        </div>
      </section>

      {/* My Teams Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-headline font-bold text-white italic tracking-tighter uppercase">Mis <span className="text-primary-fixed">Equipos</span></h3>
          <button 
            onClick={() => onNavigate('create-team')}
            className="text-primary-fixed text-xs font-bold uppercase tracking-widest hover:underline"
          >
            + Crear Nuevo
          </button>
        </div>
        
        {teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map(team => (
              <div 
                key={team.id} 
                onClick={() => onManageTeam(team.id)}
                className="bg-surface-container-low p-6 rounded-3xl border border-white/5 flex items-center gap-6 hover:bg-surface-container-high transition-colors group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                  <img src={team.image} alt={team.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-headline font-bold text-white uppercase italic tracking-tight">{team.name}</h4>
                  <div className="flex items-center gap-3 text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mt-1">
                    <span>{team.format}</span>
                    <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                    <span>{team.level}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-primary-fixed font-black text-lg">{team.wins}-{team.draws}-{team.losses}</p>
                  <p className="text-[8px] text-on-surface-variant font-bold uppercase">Récord</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-low/50 border border-dashed border-white/10 rounded-3xl p-12 text-center">
            <Icons.Users size={48} className="mx-auto text-on-surface-variant/30 mb-4" />
            <p className="text-on-surface-variant text-sm">Aún no has fundado ningún equipo.</p>
            <button 
              onClick={() => onNavigate('create-team')}
              className="mt-6 px-6 py-3 rounded-xl bg-surface-container-high text-white font-bold text-sm hover:bg-surface-container-highest transition-colors"
            >
              Fundar mi primer equipo
            </button>
          </div>
        )}
      </section>

      {/* Management Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate('manage-leagues')}
          className="flex items-center justify-between p-6 bg-surface-container-low rounded-3xl border border-white/5 hover:bg-surface-container-high transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-fixed/10 flex items-center justify-center text-primary-fixed group-hover:scale-110 transition-transform">
              <Icons.Trophy size={24} />
            </div>
            <div className="text-left">
              <h4 className="text-white font-bold">Gestionar Ligas</h4>
              <p className="text-xs text-on-surface-variant">Administra tus torneos organizados</p>
            </div>
          </div>
          <Icons.ChevronRight size={20} className="text-on-surface-variant" />
        </button>

        <button 
          onClick={() => toast.info('Configuración próximamente')}
          className="flex items-center justify-between p-6 bg-surface-container-low rounded-3xl border border-white/5 hover:bg-surface-container-high transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Icons.Settings size={24} />
            </div>
            <div className="text-left">
              <h4 className="text-white font-bold">Ajustes de Cuenta</h4>
              <p className="text-xs text-on-surface-variant">Privacidad y notificaciones</p>
            </div>
          </div>
          <Icons.ChevronRight size={20} className="text-on-surface-variant" />
        </button>
      </div>
    </div>
  );
}

function CreateTeamScreen({ onNavigate, setTeams }: { onNavigate: (screen: Screen) => void, setTeams: React.Dispatch<React.SetStateAction<any[]>> }) {
  const [teamName, setTeamName] = React.useState('');
  const [region, setRegion] = React.useState('Metropolitana');
  const [format, setFormat] = React.useState('11v11');
  const [level, setLevel] = React.useState('Amateur');

  const handleCreate = () => {
    if (!teamName.trim()) {
      toast.error('Por favor ingresa un nombre para tu equipo');
      return;
    }
    
    const newTeam = {
      id: Math.random().toString(36).substr(2, 9),
      name: teamName,
      region,
      format,
      level,
      members: 1,
      wins: 0,
      losses: 0,
      draws: 0,
      image: `https://picsum.photos/seed/${teamName}/200/200`
    };

    setTeams(prev => [...prev, newTeam]);
    toast.success(`¡Equipo "${teamName}" creado con éxito!`);
    onNavigate('profile');
  };

  return (
    <div className="pt-24 px-6 max-w-2xl mx-auto space-y-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('home')}
          className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-white hover:bg-surface-container-highest transition-colors shrink-0"
        >
          <Icons.ChevronRight size={20} className="rotate-180" />
        </button>
        <h2 className="text-3xl sm:text-4xl font-headline font-extrabold text-white italic tracking-tighter uppercase">Crear mi <span className="text-primary-fixed">Equipo</span></h2>
      </div>

      <div className="bg-surface-container-low p-8 rounded-3xl border border-white/5 space-y-8">
        <div className="space-y-3">
          <label className="block text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em]">Nombre del Equipo</label>
          <input 
            type="text" 
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Ej: Los Galácticos de Santiago"
            className="w-full bg-surface-container-high border border-white/10 rounded-xl px-6 py-4 text-white font-headline font-bold focus:outline-none focus:border-primary-fixed transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em]">Región</label>
            <select 
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-surface-container-high border border-white/10 rounded-xl px-6 py-4 text-white font-headline font-bold focus:outline-none focus:border-primary-fixed appearance-none"
            >
              <option value="Metropolitana">Metropolitana</option>
              <option value="Valparaíso">Valparaíso</option>
              <option value="Biobío">Biobío</option>
              <option value="Maule">Maule</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em]">Formato</label>
            <div className="flex gap-2">
              {['5v5', '7v7', '11v11'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${format === f ? 'bg-primary-fixed text-on-primary-fixed shadow-lg shadow-primary-fixed/20' : 'bg-surface-container-high text-on-surface-variant hover:text-white'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em]">Nivel de Habilidad</label>
          <div className="grid grid-cols-3 gap-2">
            {['Amateur', 'Semi-Pro', 'Pro'].map(l => (
              <button 
                key={l}
                onClick={() => setLevel(l)}
                className={`py-3 rounded-xl font-bold text-sm transition-all ${level === l ? 'bg-primary-fixed text-on-primary-fixed shadow-lg shadow-primary-fixed/20' : 'bg-surface-container-high text-on-surface-variant hover:text-white'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button 
            onClick={handleCreate}
            className="w-full py-5 rounded-2xl pitch-gradient text-on-primary-fixed font-headline font-black text-xl uppercase tracking-widest shadow-2xl shadow-primary-fixed/30 active:scale-[0.98] transition-all"
          >
            Fundar Equipo
          </button>
        </div>
      </div>

      <div className="bg-surface-container-highest/30 p-6 rounded-2xl border border-white/5 flex items-start gap-4">
        <Icons.ShieldCheck size={24} className="text-primary-fixed shrink-0" />
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Al fundar un equipo, te conviertes en el **Capitán**. Podrás invitar jugadores, gestionar el plantel y desafiar a otros equipos en el circuito de <span className="text-white font-bold italic">THE PITCH</span>.
        </p>
      </div>
    </div>
  );
}

function ManageLeaguesScreen({ onNavigate, leagues, setLeagues, onEdit, matches, setMatches, setStandings, addNotification }: { 
  onNavigate: (screen: Screen) => void, 
  leagues: any[], 
  setLeagues: React.Dispatch<React.SetStateAction<any[]>>,
  onEdit: (id: string) => void,
  matches: any[],
  setMatches: React.Dispatch<React.SetStateAction<any[]>>,
  setStandings: React.Dispatch<React.SetStateAction<any[]>>,
  addNotification: (title: string, message: string, type?: string, actionData?: any) => void
}) {
  const [selectedLeagueId, setSelectedLeagueId] = React.useState<string | null>(leagues[0]?.id || null);
  const [isResultModalOpen, setIsResultModalOpen] = React.useState(false);
  const [selectedMatch, setSelectedMatch] = React.useState<any>(null);
  const [scores, setScores] = React.useState({ home: '', away: '' });

  const handleDelete = (id: string) => {
    setLeagues(leagues.filter(l => l.id !== id));
    toast.success('Liga eliminada correctamente');
  };

  const handleLoadResult = (match: any) => {
    setSelectedMatch(match);
    setScores({ home: '', away: '' });
    setIsResultModalOpen(true);
  };

  const submitResult = () => {
    if (!scores.home || !scores.away) {
      toast.error('Por favor ingresa ambos resultados');
      return;
    }

    const hScore = parseInt(scores.home);
    const aScore = parseInt(scores.away);

    // Update match status
    setMatches(prev => prev.map(m => 
      m.id === selectedMatch.id 
        ? { ...m, homeScore: hScore, awayScore: aScore, status: 'Finalizado' }
        : m
    ));

    // Update Standings logic
    setStandings(prev => {
      return prev.map(team => {
        if (team.teamName === selectedMatch.homeTeam) {
          const isWin = hScore > aScore;
          const isDraw = hScore === aScore;
          return {
            ...team,
            pj: team.pj + 1,
            g: team.g + (isWin ? 1 : 0),
            e: team.e + (isDraw ? 1 : 0),
            p: team.p + (hScore < aScore ? 1 : 0),
            gf: team.gf + hScore,
            gc: team.gc + aScore,
            dg: (team.gf + hScore) - (team.gc + aScore),
            pts: team.pts + (isWin ? 3 : isDraw ? 1 : 0)
          };
        }
        if (team.teamName === selectedMatch.awayTeam) {
          const isWin = aScore > hScore;
          const isDraw = aScore === hScore;
          return {
            ...team,
            pj: team.pj + 1,
            g: team.g + (isWin ? 1 : 0),
            e: team.e + (isDraw ? 1 : 0),
            p: team.p + (aScore < hScore ? 1 : 0),
            gf: team.gf + aScore,
            gc: team.gc + hScore,
            dg: (team.gf + aScore) - (team.gc + hScore),
            pts: team.pts + (isWin ? 3 : isDraw ? 1 : 0)
          };
        }
        return team;
      });
    });

    setIsResultModalOpen(false);
    addNotification(
      'Resultado Cargado',
      `Se ha actualizado el marcador: ${selectedMatch.homeTeam} ${hScore} - ${aScore} ${selectedMatch.awayTeam}`,
      'info'
    );
    toast.success('Resultado cargado y tabla actualizada');
  };

  const leagueMatches = matches.filter(m => m.leagueId === selectedLeagueId);

  return (
    <div className="pt-24 px-6 max-w-5xl mx-auto space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-5xl md:text-7xl font-headline font-black text-white italic tracking-tighter uppercase leading-[0.85]">Gestionar <span className="text-primary-fixed">Ligas</span></h2>
          <p className="text-on-surface-variant font-medium">Administra tus torneos, inscripciones y calendarios.</p>
        </div>
        <button 
          onClick={() => onNavigate('create-league')}
          className="pitch-gradient px-10 py-5 rounded-2xl font-headline font-black text-on-primary-fixed flex items-center gap-4 active:scale-95 transition-all shadow-2xl shadow-primary-fixed/30 uppercase tracking-widest italic"
        >
          Crear Nueva Liga <Icons.Plus size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
          {leagues.map(league => (
            <button
              key={league.id}
              onClick={() => setSelectedLeagueId(league.id)}
              className={`px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs whitespace-nowrap transition-all border ${selectedLeagueId === league.id ? 'bg-primary-fixed text-on-primary-fixed border-primary-fixed shadow-lg shadow-primary-fixed/20' : 'bg-surface-container-low text-on-surface-variant border-white/5 hover:bg-surface-container-high'}`}
            >
              {league.name}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-headline font-black text-white uppercase italic tracking-tight">Próximos Partidos</h3>
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Cargar Resultados</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {leagueMatches.map(match => (
              <div key={match.id} className="bg-surface-container-low p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-surface-container-high transition-all group">
                <div className="flex items-center gap-6 flex-1 justify-center md:justify-start">
                  <div className="text-right flex-1 hidden md:block">
                    <p className="text-white font-headline font-bold uppercase italic tracking-tight">{match.homeTeam}</p>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                    <span className="text-2xl font-black text-white">{match.homeScore ?? '-'}</span>
                    <span className="text-on-surface-variant font-black">VS</span>
                    <span className="text-2xl font-black text-white">{match.awayScore ?? '-'}</span>
                  </div>
                  <div className="text-left flex-1 hidden md:block">
                    <p className="text-white font-headline font-bold uppercase italic tracking-tight">{match.awayTeam}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-1 min-w-[120px]">
                  <p className="text-[10px] font-black text-primary-fixed uppercase tracking-widest">{match.date}</p>
                  <p className="text-xs font-bold text-on-surface-variant">{match.time} hrs</p>
                </div>

                <div className="flex items-center gap-3">
                  {match.status === 'Programado' ? (
                    <button 
                      onClick={() => handleLoadResult(match)}
                      className="bg-primary-fixed text-on-primary-fixed px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-primary-fixed/20"
                    >
                      Cargar Resultado
                    </button>
                  ) : (
                    <span className="px-6 py-3 rounded-xl bg-green-500/10 text-green-400 font-black text-[10px] uppercase tracking-widest border border-green-500/20">
                      Finalizado
                    </span>
                  )}
                </div>
              </div>
            ))}
            {leagueMatches.length === 0 && (
              <div className="text-center py-12 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <p className="text-on-surface-variant text-sm font-medium">No hay partidos programados para esta liga.</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-12 border-t border-white/5">
          <h3 className="text-2xl font-headline font-black text-white uppercase italic tracking-tight mb-8">Configuración de Liga</h3>
          <div className="grid grid-cols-1 gap-4">
            {leagues.map(league => (
              <div key={league.id} className="bg-surface-container-low p-8 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-surface-container-high transition-all group shadow-xl">
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary-fixed/10 flex items-center justify-center text-primary-fixed border border-primary-fixed/20 group-hover:scale-110 transition-transform">
                    <Icons.Trophy size={32} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl font-headline font-black text-white uppercase italic tracking-tight">{league.name}</h3>
                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${league.status === 'Activa' ? 'bg-green-500/20 text-green-400' : 'bg-primary-fixed/20 text-primary-fixed'}`}>
                        {league.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-2"><Icons.MapPin size={14} className="text-primary-fixed" /> {league.region}</span>
                      <span className="flex items-center gap-2"><Icons.Users size={14} className="text-primary-fixed" /> {league.teams}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => onEdit(league.id)}
                    className="p-4 rounded-2xl bg-white/5 text-white hover:bg-white/10 transition-all active:scale-90"
                    title="Editar Liga"
                  >
                    <Icons.Settings size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(league.id)}
                    className="p-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all active:scale-90"
                    title="Eliminar Liga"
                  >
                    <Icons.Trash size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Result Loading Modal */}
      <AnimatePresence>
        {isResultModalOpen && selectedMatch && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsResultModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-surface-container-high rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="p-8 md:p-12 space-y-8">
                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-headline font-black text-white uppercase italic tracking-tight">Cargar Resultado</h3>
                  <p className="text-on-surface-variant text-sm font-medium">Ingresa el marcador final del encuentro</p>
                </div>

                <div className="flex items-center justify-between gap-8">
                  <div className="flex-1 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-white font-headline font-black text-2xl border border-white/5">
                      {selectedMatch.homeTeam.charAt(0)}
                    </div>
                    <p className="text-sm font-black text-white uppercase italic tracking-tight">{selectedMatch.homeTeam}</p>
                    <input 
                      type="number" 
                      value={scores.home}
                      onChange={(e) => setScores({ ...scores, home: e.target.value })}
                      placeholder="0"
                      className="w-full bg-surface-container-highest border border-white/5 rounded-2xl px-4 py-4 text-center text-3xl font-black text-white focus:outline-none focus:border-primary-fixed transition-all"
                    />
                  </div>

                  <div className="text-on-surface-variant font-black text-xl italic">VS</div>

                  <div className="flex-1 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-white font-headline font-black text-2xl border border-white/5">
                      {selectedMatch.awayTeam.charAt(0)}
                    </div>
                    <p className="text-sm font-black text-white uppercase italic tracking-tight">{selectedMatch.awayTeam}</p>
                    <input 
                      type="number" 
                      value={scores.away}
                      onChange={(e) => setScores({ ...scores, away: e.target.value })}
                      placeholder="0"
                      className="w-full bg-surface-container-highest border border-white/5 rounded-2xl px-4 py-4 text-center text-3xl font-black text-white focus:outline-none focus:border-primary-fixed transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setIsResultModalOpen(false)}
                    className="flex-1 px-8 py-4 rounded-2xl bg-white/5 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={submitResult}
                    className="flex-1 pitch-gradient px-8 py-4 rounded-2xl text-on-primary-fixed font-black uppercase tracking-widest text-xs active:scale-95 transition-all shadow-xl shadow-primary-fixed/20"
                  >
                    Confirmar Resultado
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateLeagueScreen({ 
  onNavigate, 
  leagues, 
  setLeagues, 
  selectedLeagueId 
}: { 
  onNavigate: (screen: Screen) => void,
  leagues: any[],
  setLeagues: React.Dispatch<React.SetStateAction<any[]>>,
  selectedLeagueId: string | null
}) {
  const isEditing = !!selectedLeagueId;
  const leagueToEdit = leagues.find(l => l.id === selectedLeagueId);

  const [formData, setFormData] = React.useState({
    name: leagueToEdit?.name || '',
    region: leagueToEdit?.region || 'Metropolitana',
    startDate: leagueToEdit?.startDate || '',
    prize: leagueToEdit?.prize || '',
    maxTeams: leagueToEdit?.maxTeams || '16',
    fee: leagueToEdit?.fee || '',
    description: leagueToEdit?.description || '',
    status: leagueToEdit?.status || 'Inscripciones',
    format: leagueToEdit?.format || 'Fútbol 7',
    rules: leagueToEdit?.rules || 'Reglas estándar de la federación.'
  });

  const handleSave = () => {
    if (!formData.name || !formData.startDate || !formData.fee) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    if (isEditing) {
      setLeagues(leagues.map(l => l.id === selectedLeagueId ? { 
        ...l, 
        ...formData,
        teams: l.teams // Keep existing teams count for now
      } : l));
      toast.success(`¡Liga "${formData.name}" actualizada con éxito!`);
    } else {
      const newLeague = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        teams: `0/${formData.maxTeams}`,
        status: 'Inscripciones'
      };
      setLeagues([...leagues, newLeague]);
      toast.success(`¡Liga "${formData.name}" creada con éxito!`);
    }
    onNavigate('manage-leagues');
  };

  return (
    <div className="pt-24 px-6 max-w-4xl mx-auto space-y-10 pb-24">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => onNavigate('manage-leagues')}
          className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-white hover:bg-surface-container-highest transition-all active:scale-90"
        >
          <Icons.ChevronRight size={24} className="rotate-180" />
        </button>
        <h2 className="text-4xl sm:text-6xl font-headline font-black text-white italic tracking-tighter uppercase">
          {isEditing ? 'Editar' : 'Organizar'} <span className="text-primary-fixed">Liga</span>
        </h2>
      </div>

      <div className="bg-surface-container-low p-8 md:p-12 rounded-[3rem] border border-white/5 space-y-12 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="block text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em]">Nombre del Torneo *</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ej: Liga de Invierno 2026"
              className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-5 text-white font-headline font-bold text-lg focus:outline-none focus:border-primary-fixed transition-colors"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em]">Región / Ciudad</label>
            <select 
              value={formData.region}
              onChange={(e) => setFormData({...formData, region: e.target.value})}
              className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-5 text-white font-headline font-bold text-lg focus:outline-none focus:border-primary-fixed transition-colors appearance-none"
            >
              <option>Metropolitana</option>
              <option>Valparaíso</option>
              <option>Biobío</option>
              <option>Araucanía</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em]">Fecha de Inicio *</label>
            <input 
              type="date" 
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-5 text-white font-headline font-bold text-lg focus:outline-none focus:border-primary-fixed transition-colors"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em]">Formato de Juego</label>
            <select 
              value={formData.format}
              onChange={(e) => setFormData({...formData, format: e.target.value})}
              className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-5 text-white font-headline font-bold text-lg focus:outline-none focus:border-primary-fixed transition-colors appearance-none"
            >
              <option>Fútbol 5</option>
              <option>Fútbol 7</option>
              <option>Fútbol 11</option>
              <option>Padel (Parejas)</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em]">Fondo de Premios (CLP)</label>
            <input 
              type="text" 
              value={formData.prize}
              onChange={(e) => setFormData({...formData, prize: e.target.value})}
              placeholder="Ej: 500.000"
              className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-5 text-white font-headline font-bold text-lg focus:outline-none focus:border-primary-fixed transition-colors"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em]">Costo Inscripción (CLP) *</label>
            <input 
              type="text" 
              value={formData.fee}
              onChange={(e) => setFormData({...formData, fee: e.target.value})}
              placeholder="Ej: 45.000"
              className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-5 text-white font-headline font-bold text-lg focus:outline-none focus:border-primary-fixed transition-colors"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em]">Descripción de la Liga</label>
          <textarea 
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Describe el formato, premios y ambiente de tu liga..."
            className="w-full bg-surface-container-high border border-white/10 rounded-[2rem] px-8 py-6 text-white font-medium focus:outline-none focus:border-primary-fixed transition-colors resize-none"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em]">Reglamento Específico</label>
          <textarea 
            rows={4}
            value={formData.rules}
            onChange={(e) => setFormData({...formData, rules: e.target.value})}
            placeholder="Detalla las reglas de conducta, arbitraje y sanciones..."
            className="w-full bg-surface-container-high border border-white/10 rounded-[2rem] px-8 py-6 text-white font-medium focus:outline-none focus:border-primary-fixed transition-colors resize-none"
          />
        </div>

        <div className="pt-8 flex flex-col md:flex-row gap-4">
          <button 
            onClick={handleSave}
            className="flex-1 py-6 rounded-2xl pitch-gradient text-on-primary-fixed font-headline font-black text-2xl uppercase tracking-widest italic shadow-2xl shadow-primary-fixed/30 active:scale-[0.98] transition-all"
          >
            {isEditing ? 'Guardar Cambios' : 'Lanzar Liga'}
          </button>
          <button 
            onClick={() => onNavigate('manage-leagues')}
            className="px-12 py-6 rounded-2xl bg-white/5 text-white font-headline font-black text-xl uppercase tracking-widest italic hover:bg-white/10 transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function ReservationsScreen({ reservations, setReservations }: { reservations: any[], setReservations: React.Dispatch<React.SetStateAction<any[]>> }) {
  return (
    <div className="pt-24 px-6 max-w-4xl mx-auto space-y-8 pb-12">
      <div className="space-y-2">
        <h2 className="text-4xl font-headline font-black text-white uppercase italic tracking-tighter">Mis Reservas</h2>
        <p className="text-on-surface-variant font-medium">Gestiona tus próximos partidos y entrenamientos.</p>
      </div>

      <div className="space-y-4">
        {reservations.map(res => (
          <div key={res.id} className="bg-surface-container-high rounded-2xl overflow-hidden border border-white/5 flex flex-col sm:flex-row group">
            <div className="sm:w-48 h-32 sm:h-auto relative overflow-hidden">
              <img src={res.image} alt={res.court} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-headline font-bold text-xl uppercase italic tracking-tight">{res.court}</h3>
                  <div className="flex items-center gap-2 text-on-surface-variant text-sm mt-1">
                    <Icons.Clock size={14} className="text-primary-fixed" />
                    <span>{res.date}</span>
                  </div>
                  {res.type === 'Dividido' && (
                    <div className="mt-3 flex items-center gap-2 bg-primary-fixed/10 px-3 py-1 rounded-full w-fit">
                      <Icons.Users size={12} className="text-primary-fixed" />
                      <span className="text-[10px] font-bold text-primary-fixed uppercase tracking-widest">Pago Dividido: {res.splitInfo.paidParticipants}/{res.splitInfo.totalParticipants} Pagados</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-primary-fixed font-headline font-black text-lg">${res.price}</p>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${res.status === 'Confirmada' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {res.status}
                  </span>
                </div>
              </div>

              {res.type === 'Dividido' && (
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Estado del Grupo</span>
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">${res.splitInfo.amountPerPerson} / persona</span>
                  </div>
                  <div className="flex gap-2">
                    {res.splitInfo.participants.map((p: any, i: number) => (
                      <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${p.status === 'Pagado' ? 'border-primary-fixed bg-primary-fixed/20 text-primary-fixed' : 'border-white/10 bg-white/5 text-on-surface-variant'}`} title={p.name}>
                        {p.isOrganizer ? <Icons.User size={14} /> : <Icons.Plus size={14} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                {res.type === 'Dividido' && res.splitInfo.paidParticipants < res.splitInfo.totalParticipants && (
                  <button 
                    onClick={() => toast.success('Link de invitación copiado')}
                    className="flex-1 pitch-gradient py-2.5 rounded-xl text-on-primary-fixed text-xs font-bold uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Icons.Share size={14} /> Invitar
                  </button>
                )}
                <button className="flex-1 bg-surface-container-highest py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">Modificar</button>
                <button 
                  onClick={() => {
                    setReservations(prev => prev.filter(r => r.id !== res.id));
                    toast.success('Reserva cancelada');
                  }}
                  className="flex-1 border border-red-500/30 text-red-400 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        ))}
        {reservations.length === 0 && (
          <div className="text-center py-20 bg-surface-container-low rounded-3xl border border-dashed border-white/10">
            <Icons.Calendar size={48} className="mx-auto text-on-surface-variant/20 mb-4" />
            <p className="text-on-surface-variant">No tienes reservas activas.</p>
            <button 
              onClick={() => toast.info('Busca una cancha para reservar')}
              className="mt-6 text-primary-fixed font-bold uppercase tracking-widest text-xs hover:underline"
            >
              Explorar Canchas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MatchHistoryScreen() {
  const matches = [
    { id: '1', opponent: 'Real Talcahuano', result: 'Victoria 3-1', date: '25 Mar, 2026', type: 'Liga Clausura', score: '+15 pts' },
    { id: '2', opponent: 'Bio Bio Lions', result: 'Derrota 0-2', date: '18 Mar, 2026', type: 'Amistoso', score: '-5 pts' },
    { id: '3', opponent: 'Concepción United', result: 'Empate 2-2', date: '10 Mar, 2026', type: 'Liga Clausura', score: '+2 pts' },
  ];

  return (
    <div className="pt-24 px-6 max-w-4xl mx-auto space-y-8 pb-12">
      <div className="space-y-2">
        <h2 className="text-4xl font-headline font-black text-white uppercase italic tracking-tighter">Historial</h2>
        <p className="text-on-surface-variant font-medium">Revisa tus resultados y estadísticas pasadas.</p>
      </div>

      <div className="space-y-3">
        {matches.map(match => (
          <div key={match.id} className="bg-surface-container-low p-6 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-surface-container-high transition-colors">
            <div className="flex items-center gap-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-headline font-black text-xl ${match.result.startsWith('Victoria') ? 'bg-green-500/20 text-green-400' : match.result.startsWith('Derrota') ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                {match.result[0]}
              </div>
              <div>
                <h3 className="text-white font-headline font-bold uppercase tracking-tight">vs {match.opponent}</h3>
                <p className="text-on-surface-variant text-xs mt-1">{match.type} • {match.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-headline font-black text-lg ${match.score.startsWith('+') ? 'text-primary-fixed' : 'text-red-400'}`}>{match.score}</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Ranking</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsScreen() {
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

function NotificationsScreen({ 
  notifications, 
  setNotifications, 
  setChallenges,
  teams 
}: { 
  notifications: any[], 
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>,
  setChallenges: React.Dispatch<React.SetStateAction<any[]>>,
  teams: any[]
}) {
  const [filter, setFilter] = React.useState('all');
  const [permission, setPermission] = React.useState(typeof Notification !== 'undefined' ? Notification.permission : 'denied');

  const requestPermission = () => {
    if (typeof Notification !== 'undefined') {
      Notification.requestPermission().then(perm => {
        setPermission(perm);
        if (perm === 'granted') {
          toast.success('¡Notificaciones activadas!');
        }
      });
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('Todas las notificaciones marcadas como leídas');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleChallengeAction = (notificationId: string, challengeId: string, action: 'Aceptado' | 'Rechazado') => {
    setChallenges(prev => {
      if (action === 'Rechazado') {
        return prev.filter(c => c.id !== challengeId);
      }
      return prev.map(c => c.id === challengeId ? { ...c, status: action } : c);
    });

    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true, actionTaken: action } : n
    ));

    toast.success(`Desafío ${action.toLowerCase()}`);
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  return (
    <div className="pt-24 px-6 max-w-3xl mx-auto space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-headline font-black text-white uppercase italic tracking-tight">Notificaciones</h2>
          <p className="text-on-surface-variant text-sm font-medium">Mantente al día con tu actividad.</p>
        </div>
        <div className="flex items-center gap-4">
          {permission !== 'granted' && (
            <button 
              onClick={requestPermission}
              className="px-4 py-2 rounded-xl bg-primary-fixed/10 text-primary-fixed text-[10px] font-black uppercase tracking-widest hover:bg-primary-fixed/20 transition-colors"
            >
              Activar Push
            </button>
          )}
          <div className="flex items-center gap-2">
            <button 
              onClick={markAllAsRead}
              className="text-primary-fixed text-[10px] font-black uppercase tracking-widest hover:underline"
            >
              Marcar todo
            </button>
            <span className="text-white/10">|</span>
            <button 
              onClick={() => {
                setNotifications([]);
                toast.success('Notificaciones eliminadas');
              }}
              className="text-red-400 text-[10px] font-black uppercase tracking-widest hover:underline"
            >
              Borrar todo
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['all', 'challenge', 'reservation', 'info'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              filter === f 
                ? 'bg-primary-fixed text-black' 
                : 'bg-white/5 text-on-surface-variant hover:bg-white/10'
            }`}
          >
            {f === 'all' ? 'Todas' : f === 'challenge' ? 'Desafíos' : f === 'reservation' ? 'Reservas' : 'Sistema'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`bg-surface-container-low p-6 rounded-3xl border border-white/5 flex flex-col gap-4 transition-all hover:bg-surface-container-high group relative ${!notification.read ? 'border-l-4 border-l-primary-fixed' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  notification.type === 'challenge' ? 'bg-primary-fixed/10 text-primary-fixed' :
                  notification.type === 'reservation' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-white/10 text-white'
                }`}>
                  {notification.type === 'challenge' ? <Icons.Trophy size={24} /> :
                   notification.type === 'reservation' ? <Icons.Calendar size={24} /> :
                   <Icons.Bell size={24} />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-headline font-bold text-white uppercase italic tracking-tight">{notification.title}</h4>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{notification.time}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{notification.message}</p>
                </div>
                <button 
                  onClick={() => deleteNotification(notification.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-on-surface-variant hover:text-red-400 transition-all"
                >
                  <Icons.X size={16} />
                </button>
              </div>

              {/* Quick Actions for Challenges */}
              {notification.type === 'challenge' && notification.actionData?.challengeId && !notification.actionTaken && (
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => handleChallengeAction(notification.id, notification.actionData.challengeId, 'Aceptado')}
                    className="flex-1 py-3 rounded-xl bg-primary-fixed text-black font-headline font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-transform"
                  >
                    Aceptar Desafío
                  </button>
                  <button 
                    onClick={() => handleChallengeAction(notification.id, notification.actionData.challengeId, 'Rechazado')}
                    className="flex-1 py-3 rounded-xl bg-white/5 text-white font-headline font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-transform"
                  >
                    Rechazar
                  </button>
                </div>
              )}

              {notification.actionTaken && (
                <div className="mt-2 py-2 px-4 rounded-xl bg-white/5 border border-white/5 text-center">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                    {notification.actionTaken === 'Aceptado' ? '✓ Desafío Aceptado' : '✕ Desafío Rechazado'}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
            <Icons.BellOff size={48} className="mx-auto text-on-surface-variant/20 mb-4" />
            <p className="text-on-surface-variant font-medium">No hay notificaciones en esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SupportScreen() {
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

function TechInfo({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mb-1">{label}</p>
      <p className="text-white font-bold">{value}</p>
    </div>
  );
}

function SkillBar({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
        <span className="text-on-surface-variant">{label}</span>
        <span className="text-primary-fixed">{value}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-primary-fixed shadow-[0_0_10px_rgba(210,255,0,0.3)]"
        />
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

function BookingModal({ isOpen, onClose, court, onConfirm }: { isOpen: boolean, onClose: () => void, court: any, onConfirm: (res: any) => void }) {
  const [bookingType, setBookingType] = React.useState<'Individual' | 'Dividido'>('Individual');
  const [participants, setParticipants] = React.useState(4);
  const [selectedTime, setSelectedTime] = React.useState('20:00');

  if (!isOpen || !court) return null;

  const priceNum = parseInt(court.price.replace('k', '')) * 1000;
  const amountPerPerson = Math.round(priceNum / participants);

  const handleConfirm = () => {
    const newRes = {
      id: Math.random().toString(36).substr(2, 9),
      court: court.name,
      date: `Hoy, ${selectedTime}`,
      price: court.price,
      status: bookingType === 'Individual' ? 'Confirmada' : 'Pendiente',
      image: court.image,
      type: bookingType,
      splitInfo: bookingType === 'Dividido' ? {
        totalParticipants: participants,
        paidParticipants: 1,
        amountPerPerson: amountPerPerson,
        participants: Array.from({ length: participants }).map((_, i) => ({
          name: i === 0 ? 'Diego Silva' : 'Pendiente',
          status: i === 0 ? 'Pagado' : 'Pendiente',
          isOrganizer: i === 0
        }))
      } : null
    };
    onConfirm(newRes);
    toast.success(bookingType === 'Dividido' ? 'Reserva creada. ¡Invita a tus amigos para completar el pago!' : '¡Reserva confirmada!');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg bg-surface-container-low rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl"
      >
        <div className="p-8 sm:p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-3xl font-headline font-black text-white uppercase italic tracking-tighter leading-none mb-2">Reservar Cancha</h3>
              <p className="text-on-surface-variant font-bold text-xs uppercase tracking-widest">{court.name}</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <Icons.Plus size={24} className="rotate-45" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Time Selection */}
            <div className="space-y-4">
              <label className="block text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em]">Seleccionar Horario</label>
              <div className="grid grid-cols-3 gap-2">
                {['18:00', '19:00', '20:00', '21:00', '22:00', '23:00'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-3 rounded-xl font-bold text-sm transition-all ${selectedTime === t ? 'bg-primary-fixed text-on-primary-fixed shadow-lg shadow-primary-fixed/20' : 'bg-surface-container-high text-on-surface-variant hover:text-white'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Booking Type */}
            <div className="space-y-4">
              <label className="block text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em]">Método de Pago</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setBookingType('Individual')}
                  className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-2 ${bookingType === 'Individual' ? 'bg-primary-fixed/10 border-primary-fixed' : 'bg-surface-container-high border-transparent hover:border-white/10'}`}
                >
                  <Icons.User size={20} className={bookingType === 'Individual' ? 'text-primary-fixed' : 'text-on-surface-variant'} />
                  <div>
                    <p className={`font-bold text-sm ${bookingType === 'Individual' ? 'text-white' : 'text-on-surface-variant'}`}>Pago Total</p>
                    <p className="text-[10px] text-on-surface-variant">Pagas el 100% ahora</p>
                  </div>
                </button>
                <button 
                  onClick={() => setBookingType('Dividido')}
                  className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-2 ${bookingType === 'Dividido' ? 'bg-primary-fixed/10 border-primary-fixed' : 'bg-surface-container-high border-transparent hover:border-white/10'}`}
                >
                  <Icons.Users size={20} className={bookingType === 'Dividido' ? 'text-primary-fixed' : 'text-on-surface-variant'} />
                  <div>
                    <p className={`font-bold text-sm ${bookingType === 'Dividido' ? 'text-white' : 'text-on-surface-variant'}`}>Pago Dividido</p>
                    <p className="text-[10px] text-on-surface-variant">Divide con tu equipo</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Split Options */}
            <AnimatePresence>
              {bookingType === 'Dividido' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em]">Número de Jugadores</label>
                      <span className="text-primary-fixed font-black">{participants}</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max="12" 
                      value={participants}
                      onChange={(e) => setParticipants(parseInt(e.target.value))}
                      className="w-full accent-primary-fixed"
                    />
                    <div className="flex justify-between items-center bg-surface-container-high p-4 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-fixed/10 flex items-center justify-center text-primary-fixed">
                          <Icons.Trophy size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Costo por Persona</p>
                          <p className="text-xl font-black text-white">${amountPerPerson.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Total</p>
                        <p className="text-sm font-bold text-white">${priceNum.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={handleConfirm}
              className="w-full py-5 rounded-2xl pitch-gradient text-on-primary-fixed font-headline font-black text-xl uppercase tracking-widest shadow-2xl shadow-primary-fixed/30 active:scale-[0.98] transition-all mt-4"
            >
              {bookingType === 'Dividido' ? 'Crear Pago Dividido' : 'Confirmar Reserva'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ChallengeModal({ isOpen, onClose, challengerTeam, targetTeam, onChallenge }: { isOpen: boolean, onClose: () => void, challengerTeam: any, targetTeam: any, onChallenge: (challenge: any) => void }) {
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('20:00');
  const [court, setCourt] = React.useState('Club Padel Biobío');

  if (!isOpen || !targetTeam) return null;

  const handleChallenge = () => {
    if (!date) {
      toast.error('Por favor selecciona una fecha');
      return;
    }
    const newChallenge = {
      id: Math.random().toString(36).substr(2, 9),
      challengerId: challengerTeam.id,
      challengedId: targetTeam.id,
      status: 'Pendiente',
      date,
      time,
      court
    };
    onChallenge(newChallenge);
    onClose();
    toast.success(`¡Desafío enviado a ${targetTeam.name}!`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-xl bg-surface-container-low rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl"
      >
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-3xl font-headline font-black text-white italic tracking-tighter uppercase">Enviar <span className="text-primary-fixed">Desafío</span></h3>
              <p className="text-on-surface-variant text-sm font-medium mt-1">Reta a {targetTeam.name} a un encuentro</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-on-surface-variant hover:text-white transition-colors">
              <Icons.X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Fecha del Encuentro</label>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-surface-container-high border-none rounded-xl text-white text-sm p-4 focus:ring-2 focus:ring-primary-fixed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Horario</label>
                <select 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-surface-container-high border-none rounded-xl text-white text-sm p-4 focus:ring-2 focus:ring-primary-fixed"
                >
                  {['18:00', '19:00', '20:00', '21:00', '22:00'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Cancha / Club</label>
                <select 
                  value={court}
                  onChange={(e) => setCourt(e.target.value)}
                  className="w-full bg-surface-container-high border-none rounded-xl text-white text-sm p-4 focus:ring-2 focus:ring-primary-fixed"
                >
                  <option>Club Padel Biobío</option>
                  <option>Estadio Español</option>
                  <option>Club Oriente</option>
                  <option>Ciudad Deportiva</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            onClick={handleChallenge}
            className="w-full py-5 rounded-2xl pitch-gradient text-on-primary-fixed font-headline font-black text-xl uppercase tracking-widest shadow-2xl shadow-primary-fixed/30 active:scale-[0.98] transition-all"
          >
            Enviar Reto
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ManageTeamScreen({ onNavigate, team, setTeams, teams, challenges, setChallenges, addNotification }: { 
  onNavigate: (screen: Screen) => void, 
  team: any, 
  setTeams: React.Dispatch<React.SetStateAction<any[]>>,
  teams: any[],
  challenges: any[],
  setChallenges: React.Dispatch<React.SetStateAction<any[]>>,
  addNotification: (title: string, message: string, type?: string, actionData?: any) => void
}) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'members' | 'matches' | 'challenges' | 'settings'>('overview');
  const [isChallengeModalOpen, setIsChallengeModalOpen] = React.useState(false);
  const [selectedTeamToChallenge, setSelectedTeamToChallenge] = React.useState<any>(null);

  if (!team) return null;

  const teamChallenges = challenges.filter(c => c.challengerId === team.id || c.challengedId === team.id);
  const members = [
    { id: '1', name: 'Diego Silva', role: 'Capitán', status: 'Online', image: 'https://picsum.photos/seed/diego/100/100' },
    { id: '2', name: 'Andrés Vera', role: 'Jugador', status: 'Offline', image: 'https://picsum.photos/seed/andres/100/100' },
    { id: '3', name: 'Cristian Soto', role: 'Jugador', status: 'Online', image: 'https://picsum.photos/seed/cristian/100/100' },
    { id: '4', name: 'Felipe Ruiz', role: 'Jugador', status: 'Online', image: 'https://picsum.photos/seed/felipe/100/100' },
  ];

  const recentMatches = [
    { id: 'm1', opponent: 'Los Troncos FC', result: 'W', score: '3 - 1', date: '24 Mar' },
    { id: 'm2', opponent: 'Pumas RM', result: 'D', score: '2 - 2', date: '18 Mar' },
    { id: 'm3', opponent: 'Titanes del Sur', result: 'L', score: '0 - 1', date: '12 Mar' },
  ];

  return (
    <div className="pt-24 px-6 max-w-5xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-surface-container-low p-8 rounded-[3rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <button 
          onClick={() => onNavigate('profile')}
          className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <Icons.ChevronRight size={20} className="rotate-180" />
        </button>
        
        <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-primary-fixed p-1.5 bg-surface-container-low shadow-2xl">
          <img src={team.image} alt={team.name} className="w-full h-full object-cover rounded-[2rem]" referrerPolicy="no-referrer" />
        </div>
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-4xl sm:text-5xl font-headline font-black text-white italic tracking-tighter uppercase">{team.name}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-on-surface-variant font-bold text-xs uppercase tracking-widest">
            <span className="flex items-center gap-2"><Icons.MapPin size={14} className="text-primary-fixed" /> {team.region}</span>
            <span className="flex items-center gap-2"><Icons.Users size={14} className="text-primary-fixed" /> {team.members || 1} Miembros</span>
            <span className="flex items-center gap-2"><Icons.Trophy size={14} className="text-primary-fixed" /> {team.level}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-surface-container-low p-2 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Resumen', icon: <Icons.Home size={18} /> },
          { id: 'members', label: 'Plantel', icon: <Icons.Users size={18} /> },
          { id: 'matches', label: 'Partidos', icon: <Icons.Trophy size={18} /> },
          { id: 'challenges', label: 'Desafíos', icon: <Icons.ShieldCheck size={18} /> },
          { id: 'settings', label: 'Ajustes', icon: <Icons.Settings size={18} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-primary-fixed text-on-primary-fixed shadow-lg shadow-primary-fixed/20' : 'text-on-surface-variant hover:text-white hover:bg-white/5'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-surface-container-low p-8 rounded-3xl border border-white/5 space-y-6">
                  <h3 className="text-xl font-headline font-bold text-white italic tracking-tighter uppercase">Últimos <span className="text-primary-fixed">Resultados</span></h3>
                  <div className="space-y-4">
                    {recentMatches.map(match => (
                      <div key={match.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${match.result === 'W' ? 'bg-green-500/20 text-green-400' : match.result === 'D' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                            {match.result}
                          </div>
                          <div>
                            <p className="text-white font-bold">{match.opponent}</p>
                            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{match.date}</p>
                          </div>
                        </div>
                        <p className="text-xl font-headline font-bold text-white">{match.score}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-surface-container-low p-8 rounded-3xl border border-white/5 text-center space-y-4">
                  <p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest">Récord Histórico</p>
                  <div className="flex justify-center items-end gap-4">
                    <div>
                      <p className="text-3xl font-headline font-bold text-white">{team.wins}</p>
                      <p className="text-[8px] text-green-400 font-bold uppercase">Victorias</p>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div>
                      <p className="text-3xl font-headline font-bold text-white">{team.draws || 0}</p>
                      <p className="text-[8px] text-yellow-400 font-bold uppercase">Empates</p>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div>
                      <p className="text-3xl font-headline font-bold text-white">{team.losses}</p>
                      <p className="text-[8px] text-red-400 font-bold uppercase">Derrotas</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('challenges')}
                  className="w-full py-5 rounded-2xl pitch-gradient text-on-primary-fixed font-headline font-black text-lg uppercase tracking-widest shadow-xl active:scale-95 transition-transform"
                >
                  Desafiar Equipo
                </button>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-headline font-bold text-white italic tracking-tighter uppercase">Plantel <span className="text-primary-fixed">Actual</span></h3>
                <button 
                  onClick={() => onNavigate('free-agents')}
                  className="px-4 py-2 rounded-xl bg-primary-fixed/10 text-primary-fixed text-xs font-bold uppercase tracking-widest hover:bg-primary-fixed/20 transition-colors"
                >
                  + Buscar Refuerzos
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members.map(member => (
                  <div key={member.id} className="bg-surface-container-low p-4 rounded-2xl border border-white/5 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-white font-bold">{member.name}</p>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${member.status === 'Online' ? 'bg-green-500' : 'bg-white/20'}`}></span>
                      <button className="p-2 rounded-lg hover:bg-white/5 text-on-surface-variant hover:text-white transition-colors">
                        <Icons.Settings size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="space-y-8">
              <ChallengeModal 
                isOpen={isChallengeModalOpen} 
                onClose={() => setIsChallengeModalOpen(false)} 
                challengerTeam={team} 
                targetTeam={selectedTeamToChallenge} 
                onChallenge={(c) => {
                  setChallenges(prev => [c, ...prev]);
                  addNotification(
                    'Nuevo Desafío Recibido',
                    `El equipo ${team.name} te ha desafiado para el ${c.date}.`,
                    'challenge',
                    { challengeId: c.id }
                  );
                }} 
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pending Challenges */}
                <div className="space-y-6">
                  <h3 className="text-xl font-headline font-bold text-white italic tracking-tighter uppercase">Desafíos <span className="text-primary-fixed">Pendientes</span></h3>
                  <div className="space-y-4">
                    {teamChallenges.filter(c => c.status === 'Pendiente').map(c => {
                      const isChallenger = c.challengerId === team.id;
                      const otherTeamId = isChallenger ? c.challengedId : c.challengerId;
                      const otherTeam = teams.find(t => t.id === otherTeamId) || TEAMS.find(t => t.id === otherTeamId);
                      
                      return (
                        <div key={c.id} className="bg-surface-container-low p-6 rounded-3xl border border-white/5 space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                              <img src={otherTeam?.image} alt={otherTeam?.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-bold">{isChallenger ? 'Desafiaste a' : 'Te desafió'} {otherTeam?.name}</p>
                              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{c.date} • {c.time} • {c.court}</p>
                            </div>
                          </div>
                          {!isChallenger && (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => {
                                  setChallenges(prev => prev.map(ch => ch.id === c.id ? {...ch, status: 'Aceptado'} : ch));
                                  addNotification(
                                    'Desafío Aceptado',
                                    `Has aceptado el desafío de ${otherTeam?.name}. El partido está programado para el ${c.date}.`,
                                    'challenge'
                                  );
                                  toast.success('Desafío aceptado');
                                }}
                                className="flex-1 py-2 rounded-xl bg-primary-fixed text-black font-bold text-xs uppercase tracking-widest"
                              >
                                Aceptar
                              </button>
                              <button 
                                onClick={() => {
                                  setChallenges(prev => prev.filter(ch => ch.id !== c.id));
                                  addNotification(
                                    'Desafío Rechazado',
                                    `Has rechazado el desafío de ${otherTeam?.name}.`,
                                    'challenge'
                                  );
                                  toast.error('Desafío rechazado');
                                }}
                                className="flex-1 py-2 rounded-xl bg-white/5 text-white font-bold text-xs uppercase tracking-widest"
                              >
                                Rechazar
                              </button>
                            </div>
                          )}
                          {isChallenger && (
                            <div className="py-2 px-4 rounded-xl bg-white/5 text-center">
                              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Esperando respuesta...</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {teamChallenges.filter(c => c.status === 'Pendiente').length === 0 && (
                      <div className="p-8 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <p className="text-xs text-on-surface-variant">No hay desafíos pendientes.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Challenge Other Teams */}
                <div className="space-y-6">
                  <h3 className="text-xl font-headline font-bold text-white italic tracking-tighter uppercase">Equipos <span className="text-primary-fixed">Disponibles</span></h3>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto no-scrollbar pr-2">
                    {TEAMS.filter(t => t.id !== team.id).map(otherTeam => (
                      <div key={otherTeam.id} className="bg-surface-container-low p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-surface-container-high transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
                            <img src={otherTeam.image} alt={otherTeam.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">{otherTeam.name}</p>
                            <p className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest">{otherTeam.level} • {otherTeam.format}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedTeamToChallenge(otherTeam);
                            setIsChallengeModalOpen(true);
                          }}
                          className="p-2 rounded-lg bg-primary-fixed/10 text-primary-fixed hover:bg-primary-fixed hover:text-black transition-all"
                        >
                          <Icons.ShieldCheck size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-surface-container-low p-8 rounded-3xl border border-white/5 space-y-8">
              <div className="space-y-6">
                <h3 className="text-xl font-headline font-bold text-white italic tracking-tighter uppercase">Ajustes del <span className="text-primary-fixed">Equipo</span></h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <p className="text-white font-bold">Privacidad del Equipo</p>
                      <p className="text-xs text-on-surface-variant">Permitir que otros equipos te desafíen</p>
                    </div>
                    <div className="w-12 h-6 bg-primary-fixed/20 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-primary-fixed rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <p className="text-white font-bold">Búsqueda de Jugadores</p>
                      <p className="text-xs text-on-surface-variant">Aparecer en la lista de equipos que buscan refuerzos</p>
                    </div>
                    <div className="w-12 h-6 bg-white/10 rounded-full relative">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white/40 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 flex gap-4">
                <button 
                  onClick={() => toast.success('Cambios guardados')}
                  className="flex-1 py-4 rounded-xl bg-surface-container-highest text-white font-bold text-sm hover:bg-surface-bright transition-colors"
                >
                  Guardar Cambios
                </button>
                <button 
                  onClick={() => {
                    if (confirm('¿Estás seguro de que quieres disolver el equipo? Esta acción no se puede deshacer.')) {
                      setTeams(prev => prev.filter(t => t.id !== team.id));
                      onNavigate('profile');
                      toast.success('Equipo disuelto');
                    }
                  }}
                  className="flex-1 py-4 rounded-xl bg-red-500/10 text-red-400 font-bold text-sm hover:bg-red-500/20 transition-colors"
                >
                  Disolver Equipo
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

