import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { useAppStore } from './store/appStore';
import { Screen } from './types';
import { AppLayout } from './layouts/AppLayout';

// Pages
import { Home } from './pages/Home';
import { Courts } from './pages/Courts';
import { Teams } from './pages/Teams';
import { FreeAgents } from './pages/FreeAgents';
import { Leagues } from './pages/Leagues';
import { Profile } from './pages/Profile';
import { CreateTeam } from './pages/CreateTeam';
import { ManageTeam } from './pages/ManageTeam';
import { CreateLeague } from './pages/CreateLeague';
import { ManageLeagues } from './pages/ManageLeagues';
import { Reservations } from './pages/Reservations';
import { MatchHistory } from './pages/MatchHistory';
import { Settings } from './pages/Settings';
import { Support } from './pages/Support';
import { Notifications } from './pages/Notifications';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const store = useAppStore();
  
  const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false);
  const [bookingCourt, setBookingCourt] = React.useState<any>(null);

  // Sync current screen with location for the bottom nav active state
  const currentScreen = React.useMemo(() => {
    const path = location.pathname.substring(1) || 'home';
    // Mapping some paths to base screens for nav highlighting
    if (path.startsWith('manage-team')) return 'profile';
    if (path.startsWith('create-team')) return 'profile';
    if (path.startsWith('create-league')) return 'leagues';
    if (path.startsWith('manage-leagues')) return 'leagues';
    return path as Screen;
  }, [location.pathname]);

  const handleNavigation = (screen: Screen) => {
    if (screen === 'home') navigate('/');
    else navigate(`/${screen}`);
  };

  const handleAutoLocate = () => {
    if ("geolocation" in navigator) {
      store.setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          let city = "Ubicación Actual";
          if (latitude < -36) city = "Concepción, Biobío";
          else if (latitude < -33.2) city = "Santiago, RM";
          else city = "Valparaíso, V Región";

          store.setUserLocation({ lat: latitude, lng: longitude, city });
          store.setIsLocating(false);
          toast.success(`Ubicación detectada: ${city}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          store.setIsLocating(false);
          toast.error("No se pudo obtener tu ubicación automáticamente.");
        }
      );
    }
  };

  React.useEffect(() => {
    if (!store.userLocation) {
      handleAutoLocate();
    }
  }, []);

  return (
    <AppLayout
      currentScreen={currentScreen}
      onNavigate={handleNavigation}
      userLocation={store.userLocation}
      onLocate={handleAutoLocate}
      isLocating={store.isLocating}
      setUserLocation={store.setUserLocation}
      notifications={store.notifications}
      isBookingModalOpen={isBookingModalOpen}
      setIsBookingModalOpen={setIsBookingModalOpen}
      bookingCourt={bookingCourt}
      onConfirmBooking={(res) => {
        store.setReservations(prev => [res, ...prev]);
        setIsBookingModalOpen(false);
        store.addNotification(
          'Reserva Confirmada',
          `Tu reserva en ${res.court} para el ${res.date} ha sido confirmada.`,
          'reservation'
        );
        navigate('/reservations');
      }}
    >
      <Toaster position="top-center" expand={false} richColors theme="dark" />
      <Routes>
        <Route path="/" element={<Home onNavigate={handleNavigation} />} />
        <Route path="/courts" element={
          <Courts 
            userLocation={store.userLocation} 
            searchRadius={store.searchRadius} 
            setSearchRadius={store.setSearchRadius} 
            onLocate={handleAutoLocate} 
            isLocating={store.isLocating} 
            onBook={(court) => { setBookingCourt(court); setIsBookingModalOpen(true); }} 
          />
        } />
        <Route path="/teams" element={
          <Teams 
            isFreeAgent={store.isFreeAgent} 
            setIsFreeAgent={store.setIsFreeAgent} 
            playerProfile={store.playerProfile} 
            userLocation={store.userLocation} 
            searchRadius={store.searchRadius} 
            setSearchRadius={store.setSearchRadius} 
            onLocate={handleAutoLocate} 
            isLocating={store.isLocating} 
          />
        } />
        <Route path="/free-agents" element={
          <FreeAgents 
            userLocation={store.userLocation} 
            searchRadius={store.searchRadius} 
            setSearchRadius={store.setSearchRadius} 
            onLocate={handleAutoLocate} 
            isLocating={store.isLocating} 
          />
        } />
        <Route path="/leagues" element={<Leagues leagues={store.leagues} standings={store.standings} matches={store.matches} />} />
        <Route path="/profile" element={
          <Profile 
            onNavigate={handleNavigation} 
            teams={store.teams} 
            playerProfile={store.playerProfile} 
            setPlayerProfile={store.setPlayerProfile} 
            onManageTeam={(id) => { store.setSelectedTeamId(id); navigate(`/manage-team/${id}`); }} 
          />
        } />
        <Route path="/create-team" element={<CreateTeam onNavigate={handleNavigation} setTeams={store.setTeams} />} />
        <Route path="/manage-team/:id" element={<ManageTeam onNavigate={handleNavigation} />} />
        <Route path="/create-league" element={
          <CreateLeague 
            onNavigate={handleNavigation} 
            leagues={store.leagues} 
            setLeagues={store.setLeagues} 
            selectedLeagueId={store.selectedLeagueId}
          />
        } />
        <Route path="/manage-leagues" element={
          <ManageLeagues 
            onNavigate={handleNavigation} 
            leagues={store.leagues} 
            setLeagues={store.setLeagues} 
            onEdit={(id) => {
              store.setSelectedLeagueId(id);
              navigate('/create-league');
            }}
            matches={store.matches}
            setMatches={store.setMatches}
            setStandings={store.setStandings}
            addNotification={store.addNotification}
          />
        } />
        <Route path="/reservations" element={<Reservations reservations={store.reservations} setReservations={store.setReservations} />} />
        <Route path="/history" element={<MatchHistory />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/support" element={<Support />} />
        <Route path="/notifications" element={
          <Notifications 
            notifications={store.notifications} 
            setNotifications={store.setNotifications} 
            setChallenges={store.setChallenges}
            teams={store.teams}
          />
        } />
      </Routes>
    </AppLayout>
  );
}
