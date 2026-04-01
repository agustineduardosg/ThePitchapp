import React from 'react';
import { toast } from 'sonner';
import { Icons } from '../components/Icons';
import { Screen, League } from '../types';
import { leagueSchema } from '../types/schemas';

interface CreateLeagueProps { 
  onNavigate: (screen: Screen) => void;
  leagues: League[];
  setLeagues: (leagues: League[] | ((prev: League[]) => League[])) => void;
  selectedLeagueId: string | null;
}

export function CreateLeague({ 
  onNavigate, 
  leagues, 
  setLeagues, 
  selectedLeagueId 
}: CreateLeagueProps) {
  const isEditing = !!selectedLeagueId;
  const leagueToEdit = leagues.find(l => l.id === selectedLeagueId);

  const [formData, setFormData] = React.useState({
    name: leagueToEdit?.name || '',
    region: leagueToEdit?.region || 'Metropolitana',
    startDate: leagueToEdit?.startDate || '',
    prize: leagueToEdit?.prize || '',
    maxTeams: leagueToEdit?.maxTeams || '16',
    fee: leagueToEdit?.fee || '',
    description: leagueToEdit?.description || '',
    status: (leagueToEdit?.status as any) || 'Inscripciones',
    format: leagueToEdit?.format || 'Fútbol 7',
    rules: leagueToEdit?.rules || 'Reglas estándar de la federación.'
  });

  const handleSave = () => {
    if (isEditing) {
      const updatedLeague = { 
        ...leagueToEdit, 
        ...formData,
        teams: leagueToEdit?.teams || '0/16'
      };
      const result = leagueSchema.safeParse(updatedLeague);
      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return;
      }
      setLeagues(leagues.map(l => l.id === selectedLeagueId ? result.data as League : l));
      toast.success(`¡Liga "${formData.name}" actualizada con éxito!`);
    } else {
      const newLeagueData = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        teams: `0/${formData.maxTeams}`,
        status: 'Inscripciones'
      };
      const result = leagueSchema.safeParse(newLeagueData);
      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return;
      }
      setLeagues([...leagues, result.data as League]);
      toast.success(`¡Liga "${formData.name}" creada con éxito!`);
    }
    onNavigate('manage-leagues');
  };

  return (
    <div className="pt-24 px-6 max-w-4xl mx-auto space-y-10 pb-24">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => onNavigate('manage-leagues')}
          className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-white hover:bg-surface-container-highest transition-all active:scale-90"
        >
          <Icons.ChevronRight size={24} className="rotate-180" />
        </button>
        <h2 className="text-4xl sm:text-6xl font-headline font-black text-white italic tracking-tighter uppercase">
          {isEditing ? 'Editar' : 'Organizar'} <span className="text-primary-fixed">Liga</span>
        </h2>
      </div>

      <div className="bg-surface-container-low p-8 md:p-12 rounded-[3rem] border border-white/5 space-y-12 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="block text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em]">Nombre del Torneo *</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ej: Liga de Invierno 2026"
              className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-5 text-white font-headline font-bold text-lg focus:outline-none focus:border-primary-fixed transition-colors"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em]">Región / Ciudad</label>
            <select 
              value={formData.region}
              onChange={(e) => setFormData({...formData, region: e.target.value})}
              className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-5 text-white font-headline font-bold text-lg focus:outline-none focus:border-primary-fixed transition-colors appearance-none"
            >
              <option>Metropolitana</option>
              <option>Valparaíso</option>
              <option>Biobío</option>
              <option>Araucanía</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em]">Fecha de Inicio *</label>
            <input 
              type="date" 
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-5 text-white font-headline font-bold text-lg focus:outline-none focus:border-primary-fixed transition-colors"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em]">Formato de Juego</label>
            <select 
              value={formData.format}
              onChange={(e) => setFormData({...formData, format: e.target.value})}
              className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-5 text-white font-headline font-bold text-lg focus:outline-none focus:border-primary-fixed transition-colors appearance-none"
            >
              <option>Fútbol 5</option>
              <option>Fútbol 7</option>
              <option>Fútbol 11</option>
              <option>Padel (Parejas)</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em]">Fondo de Premios (CLP)</label>
            <input 
              type="text" 
              value={formData.prize}
              onChange={(e) => setFormData({...formData, prize: e.target.value})}
              placeholder="Ej: 500.000"
              className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-5 text-white font-headline font-bold text-lg focus:outline-none focus:border-primary-fixed transition-colors"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em]">Costo Inscripción (CLP) *</label>
            <input 
              type="text" 
              value={formData.fee}
              onChange={(e) => setFormData({...formData, fee: e.target.value})}
              placeholder="Ej: 45.000"
              className="w-full bg-surface-container-high border border-white/10 rounded-2xl px-6 py-5 text-white font-headline font-bold text-lg focus:outline-none focus:border-primary-fixed transition-colors"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em]">Descripción de la Liga</label>
          <textarea 
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Describe el formato, premios y ambiente de tu liga..."
            className="w-full bg-surface-container-high border border-white/10 rounded-[2rem] px-8 py-6 text-white font-medium focus:outline-none focus:border-primary-fixed transition-colors resize-none"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em]">Reglamento Específico</label>
          <textarea 
            rows={4}
            value={formData.rules}
            onChange={(e) => setFormData({...formData, rules: e.target.value})}
            placeholder="Detalla las reglas de conducta, arbitraje y sanciones..."
            className="w-full bg-surface-container-high border border-white/10 rounded-[2rem] px-8 py-6 text-white font-medium focus:outline-none focus:border-primary-fixed transition-colors resize-none"
          />
        </div>

        <div className="pt-8 flex flex-col md:flex-row gap-4">
          <button 
            onClick={handleSave}
            className="flex-1 py-6 rounded-2xl pitch-gradient text-on-primary-fixed font-headline font-black text-2xl uppercase tracking-widest italic shadow-2xl shadow-primary-fixed/30 active:scale-[0.98] transition-all"
          >
            {isEditing ? 'Guardar Cambios' : 'Lanzar Liga'}
          </button>
          <button 
            onClick={() => onNavigate('manage-leagues')}
            className="px-12 py-6 rounded-2xl bg-white/5 text-white font-headline font-black text-xl uppercase tracking-widest italic hover:bg-white/10 transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
