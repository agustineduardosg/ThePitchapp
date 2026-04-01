import React from 'react';
import { toast } from 'sonner';
import { Icons } from '../components/Icons';
import { useAppStore } from '../store/appStore';
import { Screen, Team } from '../types';
import { teamSchema } from '../types/schemas';

export function CreateTeam({ onNavigate, setTeams }: { onNavigate: (screen: Screen) => void, setTeams: (teams: Team[] | ((prev: Team[]) => Team[])) => void }) {
  const [teamName, setTeamName] = React.useState('');
  const [region, setRegion] = React.useState('Metropolitana');
  const [format, setFormat] = React.useState('11v11');
  const [level, setLevel] = React.useState('Amateur');

  const handleCreate = () => {
    if (!teamName.trim()) {
      toast.error('Por favor ingresa un nombre para tu equipo');
      return;
    }
    
    const teamData = {
      id: Math.random().toString(36).substr(2, 9),
      name: teamName,
      region,
      format,
      level,
      members: 1,
      wins: 0,
      image: `https://picsum.photos/seed/${teamName}/200/200`
    };

    const result = teamSchema.safeParse(teamData);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setTeams(prev => [...prev, result.data as Team]);
    toast.success(`¡Equipo "${teamName}" creado con éxito!`);
    onNavigate('profile');
  };

  return (
    <div className="pt-24 px-6 max-w-2xl mx-auto space-y-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('home')}
          className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-white hover:bg-surface-container-highest transition-colors shrink-0"
        >
          <Icons.ChevronRight size={20} className="rotate-180" />
        </button>
        <h2 className="text-3xl sm:text-4xl font-headline font-extrabold text-white italic tracking-tighter uppercase">Crear mi <span className="text-primary-fixed">Equipo</span></h2>
      </div>

      <div className="bg-surface-container-low p-8 rounded-3xl border border-white/5 space-y-8">
        <div className="space-y-3">
          <label className="block text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em]">Nombre del Equipo</label>
          <input 
            type="text" 
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Ej: Los Galácticos de Santiago"
            className="w-full bg-surface-container-high border border-white/10 rounded-xl px-6 py-4 text-white font-headline font-bold focus:outline-none focus:border-primary-fixed transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em]">Región</label>
            <select 
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-surface-container-high border border-white/10 rounded-xl px-6 py-4 text-white font-headline font-bold focus:outline-none focus:border-primary-fixed appearance-none"
            >
              <option value="Metropolitana">Metropolitana</option>
              <option value="Valparaíso">Valparaíso</option>
              <option value="Biobío">Biobío</option>
              <option value="Maule">Maule</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em]">Formato</label>
            <div className="flex gap-2">
              {['5v5', '7v7', '11v11'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${format === f ? 'bg-primary-fixed text-on-primary-fixed shadow-lg shadow-primary-fixed/20' : 'bg-surface-container-high text-on-surface-variant hover:text-white'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em]">Nivel de Habilidad</label>
          <div className="grid grid-cols-3 gap-2">
            {['Amateur', 'Semi-Pro', 'Pro'].map(l => (
              <button 
                key={l}
                onClick={() => setLevel(l)}
                className={`py-3 rounded-xl font-bold text-sm transition-all ${level === l ? 'bg-primary-fixed text-on-primary-fixed shadow-lg shadow-primary-fixed/20' : 'bg-surface-container-high text-on-surface-variant hover:text-white'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button 
            onClick={handleCreate}
            className="w-full py-5 rounded-2xl pitch-gradient text-on-primary-fixed font-headline font-black text-xl uppercase tracking-widest shadow-2xl shadow-primary-fixed/30 active:scale-[0.98] transition-all"
          >
            Fundar Equipo
          </button>
        </div>
      </div>

      <div className="bg-surface-container-highest/30 p-6 rounded-2xl border border-white/5 flex items-start gap-4">
        <Icons.ShieldCheck size={24} className="text-primary-fixed shrink-0" />
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Al fundar un equipo, te conviertes en el **Capitán**. Podrás invitar jugadores, gestionar el plantel y desafiar a otros equipos en el circuito de <span className="text-white font-bold italic">THE PITCH</span>.
        </p>
      </div>
    </div>
  );
}
