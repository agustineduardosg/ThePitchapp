import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Icons } from '../components/Icons';
import { Screen } from '../types';

interface ManageLeaguesProps { 
  onNavigate: (screen: Screen) => void;
  leagues: any[];
  setLeagues: React.Dispatch<React.SetStateAction<any[]>>;
  onEdit: (id: string) => void;
  matches: any[];
  setMatches: React.Dispatch<React.SetStateAction<any[]>>;
  setStandings: React.Dispatch<React.SetStateAction<any[]>>;
  addNotification: (title: string, message: string, type?: string, actionData?: any) => void;
}

export function ManageLeagues({ onNavigate, leagues, setLeagues, onEdit, matches, setMatches, setStandings, addNotification }: ManageLeaguesProps) {
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
