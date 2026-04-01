import { z } from 'zod';
import * as schemas from './schemas';

export type Stats = z.infer<typeof schemas.statsSchema>;
export type PlayerProfile = z.infer<typeof schemas.playerProfileSchema>;
export type Team = z.infer<typeof schemas.teamSchema>;
export type League = z.infer<typeof schemas.leagueSchema>;
export type Court = z.infer<typeof schemas.courtSchema>;
export type Match = z.infer<typeof schemas.matchSchema>;
export type Reservation = z.infer<typeof schemas.reservationSchema>;
export type Challenge = z.infer<typeof schemas.challengeSchema>;
export type Notification = z.infer<typeof schemas.notificationSchema>;
export type Standing = z.infer<typeof schemas.standingSchema>;

export type Screen = 'home' | 'teams' | 'leagues' | 'courts' | 'profile' | 'create-team' | 'create-league' | 'manage-leagues' | 'reservations' | 'history' | 'settings' | 'support' | 'free-agents' | 'manage-team' | 'notifications';
