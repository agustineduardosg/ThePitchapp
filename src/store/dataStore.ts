import { create } from 'zustand';

interface DataState {
  leagues: any[];
  setLeagues: (leagues: any[] | ((prev: any[]) => any[])) => void;
  teams: any[];
  setTeams: (teams: any[] | ((prev: any[]) => any[])) => void;
  reservations: any[];
  setReservations: (reservations: any[] | ((prev: any[]) => any[])) => void;
  challenges: any[];
  setChallenges: (challenges: any[] | ((prev: any[]) => any[])) => void;
  standings: any[];
  setStandings: (standings: any[] | ((prev: any[]) => any[])) => void;
  matches: any[];
  setMatches: (matches: any[] | ((prev: any[]) => any[])) => void;
  notifications: any[];
  setNotifications: (notifications: any[] | ((prev: any[]) => any[])) => void;
  addNotification: (title: string, message: string, type?: string, actionData?: any) => void;
}

export const useDataStore = create<DataState>((set) => ({
  leagues: [],
  setLeagues: (updater) => set((state) => ({ leagues: typeof updater === 'function' ? updater(state.leagues) : updater })),
  teams: [],
  setTeams: (updater) => set((state) => ({ teams: typeof updater === 'function' ? updater(state.teams) : updater })),
  reservations: [],
  setReservations: (updater) => set((state) => ({ reservations: typeof updater === 'function' ? updater(state.reservations) : updater })),
  challenges: [],
  setChallenges: (updater) => set((state) => ({ challenges: typeof updater === 'function' ? updater(state.challenges) : updater })),
  standings: [],
  setStandings: (updater) => set((state) => ({ standings: typeof updater === 'function' ? updater(state.standings) : updater })),
  matches: [],
  setMatches: (updater) => set((state) => ({ matches: typeof updater === 'function' ? updater(state.matches) : updater })),
  notifications: [],
  setNotifications: (updater) => set((state) => ({ notifications: typeof updater === 'function' ? updater(state.notifications) : updater })),
  addNotification: (title, message, type = 'info', actionData) => set((state) => {
    const newNotif = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      time: 'Ahora',
      read: false,
      type,
      actionData
    };
    
    if (typeof window !== 'undefined' && "Notification" in window) {
      if (Notification.permission === "granted") {
        try {
          new Notification(title, { body: message });
        } catch (e) {
          console.error("Error showing notification:", e);
        }
      }
    }
    
    return { notifications: [newNotif, ...state.notifications] };
  })
}));
