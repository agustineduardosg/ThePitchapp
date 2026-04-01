import React from 'react';
import { toast } from 'sonner';
import { Icons } from '../components/Icons';

interface LeaguesProps {
  leagues: any[];
  standings: any[];
  matches: any[];
}

export function Leagues({ leagues, standings, matches }: LeaguesProps) {
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
