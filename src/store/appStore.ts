import { create } from 'zustand';
import { 
  Screen, 
  PlayerProfile, 
  Team, 
  League, 
  Reservation, 
  Challenge, 
  Notification as AppNotification, 
  Standing, 
  Match 
} from '../types';

interface AppState {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  isFreeAgent: boolean;
  setIsFreeAgent: (isAgent: boolean) => void;
  isAvailable: boolean;
  setIsAvailable: (isAvailable: boolean) => void;
  userLocation: { lat: number; lng: number; city: string } | null;
  setUserLocation: (location: { lat: number; lng: number; city: string } | null) => void;
  searchRadius: number;
  setSearchRadius: (radius: number) => void;
  isLocating: boolean;
  setIsLocating: (isLocating: boolean) => void;
  playerProfile: PlayerProfile;
  setPlayerProfile: (profile: PlayerProfile) => void;
  leagues: League[];
  setLeagues: (leagues: League[] | ((prev: League[]) => League[])) => void;
  teams: Team[];
  setTeams: (teams: Team[] | ((prev: Team[]) => Team[])) => void;
  reservations: Reservation[];
  setReservations: (reservations: Reservation[] | ((prev: Reservation[]) => Reservation[])) => void;
  challenges: Challenge[];
  setChallenges: (challenges: Challenge[] | ((prev: Challenge[]) => Challenge[])) => void;
  notifications: AppNotification[];
  setNotifications: (notifications: AppNotification[] | ((prev: AppNotification[]) => AppNotification[])) => void;
  standings: Standing[];
  setStandings: (standings: Standing[] | ((prev: Standing[]) => Standing[])) => void;
  matches: Match[];
  setMatches: (matches: Match[] | ((prev: Match[]) => Match[])) => void;
  addNotification: (title: string, message: string, type?: AppNotification['type'], actionData?: any) => void;
  selectedTeamId: string | null;
  setSelectedTeamId: (id: string | null) => void;
  selectedLeagueId: string | null;
  setSelectedLeagueId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isMenuOpen: false,
  setIsMenuOpen: (isMenuOpen) => set({ isMenuOpen }),
  isFreeAgent: true,
  setIsFreeAgent: (isFreeAgent) => set({ isFreeAgent }),
  isAvailable: true,
  setIsAvailable: (isAvailable) => set({ isAvailable }),
  userLocation: null,
  setUserLocation: (userLocation) => set({ userLocation }),
  searchRadius: 10,
  setSearchRadius: (searchRadius) => set({ searchRadius }),
  isLocating: false,
  setIsLocating: (isLocating) => set({ isLocating }),
  playerProfile: {
    name: '',
    position: '',
    level: '',
    foot: '',
    height: '',
    weight: '',
    age: '',
    stats: {
      pace: 0,
      shooting: 0,
      passing: 0,
      dribbling: 0,
      defending: 0,
      physical: 0
    }
  },
  setPlayerProfile: (playerProfile) => set({ playerProfile }),
  leagues: [],
  setLeagues: (leagues) => set((state) => ({ 
    leagues: typeof leagues === 'function' ? leagues(state.leagues) : leagues 
  })),
  teams: [],
  setTeams: (teams) => set((state) => ({ 
    teams: typeof teams === 'function' ? teams(state.teams) : teams 
  })),
  reservations: [],
  setReservations: (reservations) => set((state) => ({ 
    reservations: typeof reservations === 'function' ? reservations(state.reservations) : reservations 
  })),
  challenges: [],
  setChallenges: (challenges) => set((state) => ({ 
    challenges: typeof challenges === 'function' ? challenges(state.challenges) : challenges 
  })),
  notifications: [],
  setNotifications: (notifications) => set((state) => ({ 
    notifications: typeof notifications === 'function' ? notifications(state.notifications) : notifications 
  })),
  standings: [],
  setStandings: (standings) => set((state) => ({ 
    standings: typeof standings === 'function' ? standings(state.standings) : standings 
  })),
  matches: [],
  setMatches: (matches) => set((state) => ({ 
    matches: typeof matches === 'function' ? matches(state.matches) : matches 
  })),
  addNotification: (title, message, type = 'info', actionData) => {
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      time: 'Ahora',
      read: false,
      type,
      actionData
    };
    set((state) => ({ notifications: [newNotif, ...state.notifications] }));
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, { body: message });
      } catch (e) {
        console.error("Error showing notification:", e);
      }
    }
  },
  selectedTeamId: null,
  setSelectedTeamId: (selectedTeamId) => set({ selectedTeamId }),
  selectedLeagueId: null,
  setSelectedLeagueId: (selectedLeagueId) => set({ selectedLeagueId }),
}));
