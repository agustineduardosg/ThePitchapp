import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Icons } from '../components/Icons';
import { Screen, Notification } from '../types';
import { BookingModal } from '../components/features/BookingModal';

interface AppLayoutProps {
  children: React.ReactNode;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  userLocation: { lat: number, lng: number, city: string } | null;
  onLocate: () => void;
  isLocating: boolean;
  setUserLocation: (loc: { lat: number, lng: number, city: string }) => void;
  notifications: any[];
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  bookingCourt: any;
  onConfirmBooking: (res: any) => void;
}

export function AppLayout({ 
  children, 
  currentScreen, 
  onNavigate, 
  userLocation, 
  onLocate, 
  isLocating,
  setUserLocation,
  notifications,
  isBookingModalOpen,
  setIsBookingModalOpen,
  bookingCourt,
  onConfirmBooking
}: AppLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isAvailable, setIsAvailable] = React.useState(true);

  const handleNavigation = (screen: Screen) => {
    onNavigate(screen);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-sans selection:bg-primary-fixed selection:text-on-primary-fixed">
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
                  { city: 'Santiago, RM', lat: -33.4489, lng: -70.6693 },
                  { city: 'Valparaíso, V Región', lat: -33.0472, lng: -71.6127 },
                  { city: 'Concepción, Biobío', lat: -36.8201, lng: -73.0444 }
                ].map(city => (
                  <button 
                    key={city.city}
                    onClick={() => {
                      setUserLocation(city);
                      toast.success(`Buscando en ${city.city}`);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors ${userLocation?.city === city.city ? 'bg-primary-fixed text-black' : 'text-white hover:bg-white/5'}`}
                  >
                    {city.city}
                  </button>
                ))}
              </div>
              <div className="h-px bg-white/10 my-3"></div>
              <button 
                onClick={onLocate}
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
        {children}
        
        <BookingModal 
          isOpen={isBookingModalOpen} 
          onClose={() => setIsBookingModalOpen(false)} 
          court={bookingCourt}
          onConfirm={onConfirmBooking}
        />
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 w-full z-50 rounded-t-3xl bg-[#1c1b1b]/90 backdrop-blur-xl shadow-[0_-8px_30px_rgb(0,0,0,0.12)] flex justify-around items-center px-2 pb-6 pt-3">
        <NavItem 
          icon={<Icons.Home size={24} />} 
          label="Inicio" 
          active={currentScreen === 'home'} 
          onClick={() => handleNavigation('home')} 
        />
        <NavItem 
          icon={<Icons.Search size={24} />} 
          label="Agentes" 
          active={currentScreen === 'free-agents'} 
          onClick={() => handleNavigation('free-agents')} 
        />
        <NavItem 
          icon={<Icons.Users size={24} />} 
          label="Equipos" 
          active={currentScreen === 'teams'} 
          onClick={() => handleNavigation('teams')} 
        />
        <NavItem 
          icon={<Icons.Trophy size={24} />} 
          label="Ligas" 
          active={currentScreen === 'leagues'} 
          onClick={() => handleNavigation('leagues')} 
        />
        <NavItem 
          icon={<Icons.MapPin size={24} />} 
          label="Canchas" 
          active={currentScreen === 'courts'} 
          onClick={() => handleNavigation('courts')} 
        />
        <NavItem 
          icon={<Icons.User size={24} />} 
          label="Perfil" 
          active={currentScreen === 'profile'} 
          onClick={() => handleNavigation('profile')} 
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
