import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Icons } from '../components/Icons';
import { Screen } from '../types';
import { useAppStore } from '../store/appStore';
import { TEAMS } from '../mocks/data';

interface ManageTeamProps {
  onNavigate: (screen: Screen) => void;
  // team?: any; // We'll get it from store using id
  // setTeams: React.Dispatch<React.SetStateAction<any[]>>;
  // teams: any[];
  // challenges: any[];
  // setChallenges: React.Dispatch<React.SetStateAction<any[]>>;
  // addNotification: (title: string, message: string, type?: string, actionData?: any) => void;
}

export function ManageTeam({ onNavigate }: ManageTeamProps) {
  const { id } = useParams<{ id: string }>();
  const store = useAppStore();
  const team = store.teams.find(t => t.id === id);
  const { setTeams, teams, challenges, setChallenges, addNotification } = store;
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
                            <div className="py-2 px-4 rounded-xl bg-white/5 border border-white/5 text-center">
                              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Esperando respuesta...</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Challenge Discovery */}
                <div className="space-y-6">
                  <h3 className="text-xl font-headline font-bold text-white italic tracking-tighter uppercase">Buscar <span className="text-primary-fixed">Oponentes</span></h3>
                  <div className="space-y-4">
                    {TEAMS.filter(t => t.id !== team.id).slice(0, 3).map(t => (
                      <div key={t.id} className="bg-surface-container-low p-4 rounded-2xl border border-white/5 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden">
                            <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-white font-bold">{t.name}</p>
                            <p className="text-[10px] text-on-surface-variant font-bold uppercase">{t.level} • {t.wins}W</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedTeamToChallenge(t);
                            setIsChallengeModalOpen(true);
                          }}
                          className="p-3 rounded-xl bg-white/5 text-primary-fixed hover:bg-primary-fixed hover:text-black transition-all"
                        >
                          <Icons.ShieldCheck size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-8">
              <section className="space-y-4">
                <h3 className="text-white font-headline font-bold uppercase tracking-widest text-xs">Gestión del Equipo</h3>
                <div className="space-y-2">
                  <TeamSettingItem label="Reclutamiento Activo" desc="Tu equipo aparecerá en la búsqueda para nuevos jugadores" active={true} />
                  <TeamSettingItem label="Desafíos Públicos" desc="Permite que otros equipos te envíen retos directamente" active={true} />
                </div>
              </section>
              <button 
                onClick={() => {
                  setTeams(prev => prev.filter(t => t.id !== team.id));
                  onNavigate('profile');
                  toast.error('Equipo disuelto');
                }}
                className="w-full py-4 rounded-xl border border-red-500/30 text-red-400 font-headline font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors"
              >
                Disolver Equipo
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TeamSettingItem({ label, desc, active }: { label: string, desc: string, active: boolean }) {
  const [isOn, setIsOn] = React.useState(active);
  return (
    <div className="bg-surface-container-high p-5 rounded-2xl border border-white/5 flex items-center justify-between">
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
