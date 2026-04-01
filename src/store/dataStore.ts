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
  leagues: [
    { id: '1', name: 'Clausura 2026', region: 'Metropolitana', teams: '24/32', status: 'Activa', startDate: '2026-06-15', prize: '1.000.000', fee: '150.000', description: 'Torneo principal de invierno.' },
    { id: '2', name: 'Copa de Verano', region: 'Valparaíso', teams: '12/16', status: 'Inscripciones', startDate: '2026-12-01', prize: '500.000', fee: '80.000', description: 'Torneo relámpago en la costa.' }
  ],
  setLeagues: (updater) => set((state) => ({ leagues: typeof updater === 'function' ? updater(state.leagues) : updater })),
  teams: [],
  setTeams: (updater) => set((state) => ({ teams: typeof updater === 'function' ? updater(state.teams) : updater })),
  reservations: [
    { id: '1', court: 'Club Padel Biobío', date: 'Hoy, 20:00', price: '25.000', status: 'Confirmada', image: 'https://picsum.photos/seed/padel1/400/300', type: 'Individual' },
    { id: '2', court: 'Estadio Español', date: 'Mañana, 19:00', price: '18.000', status: 'Pendiente', image: 'https://picsum.photos/seed/tennis1/400/300', type: 'Dividido', splitInfo: { totalParticipants: 4, paidParticipants: 1, amountPerPerson: 4500, participants: [{ name: 'Diego Silva', status: 'Pagado', isOrganizer: true }, { name: 'Pendiente', status: 'Pendiente', isOrganizer: false }, { name: 'Pendiente', status: 'Pendiente', isOrganizer: false }, { name: 'Pendiente', status: 'Pendiente', isOrganizer: false }] } },
  ],
  setReservations: (updater) => set((state) => ({ reservations: typeof updater === 'function' ? updater(state.reservations) : updater })),
  challenges: [
    { id: '1', challengerId: '2', challengedId: '1', status: 'Pendiente', date: '2026-04-05', time: '21:00', court: 'Club Padel Biobío' },
  ],
  setChallenges: (updater) => set((state) => ({ challenges: typeof updater === 'function' ? updater(state.challenges) : updater })),
  standings: [
    { id: '1', leagueId: '1', teamName: 'Galácticos FC', pj: 12, g: 9, e: 2, p: 1, gf: 34, gc: 12, dg: 22, pts: 29 },
    { id: '2', leagueId: '1', teamName: 'Titanes del Biobío', pj: 12, g: 8, e: 3, p: 1, gf: 28, gc: 15, dg: 13, pts: 27 },
    { id: '3', leagueId: '1', teamName: 'Rayo Penquista', pj: 12, g: 7, e: 2, p: 3, gf: 25, gc: 18, dg: 7, pts: 23 },
    { id: '4', leagueId: '1', teamName: 'Padel Kings', pj: 12, g: 6, e: 4, p: 2, gf: 22, gc: 16, dg: 6, pts: 22 },
    { id: '5', leagueId: '1', teamName: 'Sporting Concepción', pj: 12, g: 5, e: 3, p: 4, gf: 19, gc: 20, dg: -1, pts: 18 },
    { id: '6', leagueId: '1', teamName: 'Los Troncos FC', pj: 12, g: 4, e: 2, p: 6, gf: 15, gc: 22, dg: -7, pts: 14 },
    { id: '7', leagueId: '1', teamName: 'Deportivo Sur', pj: 12, g: 3, e: 1, p: 8, gf: 12, gc: 25, dg: -13, pts: 10 },
    { id: '8', leagueId: '1', teamName: 'Real Padel', pj: 12, g: 1, e: 1, p: 10, gf: 8, gc: 35, dg: -27, pts: 4 },
  ],
  setStandings: (updater) => set((state) => ({ standings: typeof updater === 'function' ? updater(state.standings) : updater })),
  matches: [
    { id: 'm1', leagueId: '1', homeTeam: 'Galácticos FC', awayTeam: 'Titanes del Biobío', homeScore: null, awayScore: null, date: '2026-04-05', time: '20:00', status: 'Programado' },
    { id: 'm2', leagueId: '1', homeTeam: 'Rayo Penquista', awayTeam: 'Padel Kings', homeScore: null, awayScore: null, date: '2026-04-05', time: '21:30', status: 'Programado' },
  ],
  setMatches: (updater) => set((state) => ({ matches: typeof updater === 'function' ? updater(state.matches) : updater })),
  notifications: [
    { id: '1', title: '¡Nuevo Desafío!', message: 'Los Troncos FC te han desafiado para este viernes.', time: 'Hace 5 min', read: false, type: 'challenge' },
    { id: '2', title: 'Reserva Confirmada', message: 'Tu reserva en Club Padel Biobío ha sido confirmada.', time: 'Hace 1 hora', read: true, type: 'reservation' },
  ],
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
