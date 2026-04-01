import React from 'react';
import { Icons } from '../components/Icons';

export function MatchHistory() {
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
