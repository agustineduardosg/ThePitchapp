import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Icons } from '../components/Icons';
import { Screen, PlayerProfile, Team } from '../types';
import { playerProfileSchema } from '../types/schemas';

interface ProfileProps {
  onNavigate: (screen: Screen) => void;
  teams: Team[];
  playerProfile: PlayerProfile;
  setPlayerProfile: (p: PlayerProfile) => void;
  onManageTeam: (id: string) => void;
}

export function Profile({ onNavigate, teams, playerProfile, setPlayerProfile, onManageTeam }: ProfileProps) {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  return (
    <div className="pt-24 px-6 max-w-4xl mx-auto space-y-12 pb-24">
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        profile={playerProfile} 
        onSave={setPlayerProfile} 
      />
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-surface-container-low p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative">
          <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-primary-fixed p-1.5 bg-surface-container-low shadow-2xl">
            <img 
              className="w-full h-full object-cover rounded-[2rem]" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNlMsaIxKAx1JJ9FSYpvJp99JfPF5GpYpRQeT9A-gYguKAJNm0Y7Jsz7YVsby1hoGxcCcWq-OB_H3n3yWiVqome5QCWBRmhn2SwFp0a_blQbA9UhU_kRBcKr1pOI-3mz4liwXqubaJ5q6Jd5B2NT0tSEptiNtaWqMjxi4u4igKREbcQRvawJYERibAhEOzmG8c6coxH6aSxY3U5znjj-q29lMg1tcUqrFQogBBEd3GzrbTMz-6lOesti7d5zwpvRQVmFoRab0LU8A" 
              alt="Diego Silva"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-primary-fixed text-black text-xs font-black px-3 py-1 rounded-xl italic shadow-lg">{playerProfile.level.toUpperCase()}</div>
        </div>
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-4xl sm:text-5xl font-headline font-black text-white italic tracking-tighter uppercase">Diego Silva</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-4 text-on-surface-variant font-medium">
            <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-xs"><Icons.MapPin size={14} className="text-primary-fixed" /> Santiago, Chile</span>
            <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-xs"><Icons.Trophy size={14} className="text-primary-fixed" /> Capitán</span>
            <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-xs"><Icons.Star size={14} className="text-primary-fixed" /> 4.9 Rating</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ProfileStat label="Partidos" value="124" />
        <ProfileStat label="Goles" value="86" />
        <ProfileStat label="Asistencias" value="42" />
        <ProfileStat label="MVP" value="12" />
      </div>

      {/* Technical Sheet (Ficha Técnica) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-headline font-bold text-white italic tracking-tighter uppercase">Ficha <span className="text-primary-fixed">Técnica</span></h3>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="text-primary-fixed text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-2"
          >
            <Icons.Edit size={14} /> Editar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Physical & Preferences */}
          <div className="bg-surface-container-low p-8 rounded-3xl border border-white/5 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <TechInfo label="Posición" value={playerProfile.position} />
              <TechInfo label="Pierna Hábil" value={playerProfile.foot} />
              <TechInfo label="Altura" value={playerProfile.height} />
              <TechInfo label="Peso" value={playerProfile.weight} />
              <TechInfo label="Edad" value={playerProfile.age} />
              <TechInfo label="Nivel" value={playerProfile.level} />
            </div>
          </div>

          {/* Skill Radar (Simplified) */}
          <div className="bg-surface-container-low p-8 rounded-3xl border border-white/5 space-y-6">
            <h4 className="text-white font-headline font-bold uppercase tracking-widest text-xs">Atributos</h4>
            <div className="space-y-4">
              <SkillBar label="Ritmo" value={playerProfile.stats.pace} />
              <SkillBar label="Tiro" value={playerProfile.stats.shooting} />
              <SkillBar label="Pase" value={playerProfile.stats.passing} />
              <SkillBar label="Regate" value={playerProfile.stats.dribbling} />
              <SkillBar label="Defensa" value={playerProfile.stats.defending} />
              <SkillBar label="Físico" value={playerProfile.stats.physical} />
            </div>
          </div>
        </div>
      </section>

      {/* My Teams Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-headline font-bold text-white italic tracking-tighter uppercase">Mis <span className="text-primary-fixed">Equipos</span></h3>
          <button 
            onClick={() => onNavigate('create-team')}
            className="text-primary-fixed text-xs font-bold uppercase tracking-widest hover:underline"
          >
            + Crear Nuevo
          </button>
        </div>
        
        {teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map(team => (
              <div 
                key={team.id}
                onClick={() => onManageTeam(team.id)}
                className="bg-surface-container-low p-6 rounded-3xl border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-surface-container-high transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden">
                    <img src={team.image || `https://picsum.photos/seed/${team.id}/200/200`} alt={team.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-white font-headline font-bold uppercase italic">{team.name}</h4>
                    <p className="text-on-surface-variant text-xs">{team.format} • {team.location.split(',')[0]}</p>
                  </div>
                </div>
                <Icons.ChevronRight size={20} className="text-on-surface-variant group-hover:text-primary-fixed transition-colors" />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-low/50 p-12 rounded-[2.5rem] border border-dashed border-white/10 text-center">
            <Icons.Users size={48} className="text-on-surface-variant/20 mx-auto mb-4" />
            <p className="text-on-surface-variant text-sm">Aún no tienes equipos creados.</p>
            <button 
              onClick={() => onNavigate('create-team')}
              className="mt-6 text-primary-fixed font-bold text-xs uppercase tracking-widest"
            >
              Crear mi primer equipo
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function ProfileStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-surface-container-low p-6 rounded-2xl text-center border border-white/5">
      <p className="text-xs text-on-surface-variant uppercase mb-1 font-bold tracking-widest">{label}</p>
      <p className="text-2xl font-headline font-bold text-white">{value}</p>
    </div>
  );
}

function TechInfo({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">{label}</p>
      <p className="text-white font-bold">{value}</p>
    </div>
  );
}

function SkillBar({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
        <span className="text-on-surface-variant">{label}</span>
        <span className="text-white">{value}</span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary-fixed transition-all duration-1000" 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}

function EditProfileModal({ 
  isOpen, 
  onClose, 
  profile, 
  onSave 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  profile: PlayerProfile, 
  onSave: (p: PlayerProfile) => void 
}) {
  const [formData, setFormData] = React.useState(profile);

  React.useEffect(() => {
    if (isOpen) {
      setFormData(profile);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSave = () => {
    const result = playerProfileSchema.safeParse(formData);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    onSave(result.data as PlayerProfile);
    onClose();
    toast.success('Perfil actualizado correctamente');
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
        className="relative w-full max-w-2xl bg-surface-container-low rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-3xl font-headline font-black text-white italic tracking-tighter uppercase">Editar <span className="text-primary-fixed">Ficha Técnica</span></h3>
              <p className="text-on-surface-variant text-sm font-medium mt-1">Actualiza tus atributos y estadísticas</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-on-surface-variant hover:text-white transition-colors">
              <Icons.X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Physical Info */}
            <div className="space-y-6">
              <h4 className="text-white font-headline font-bold uppercase tracking-widest text-xs">Información Física</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Posición</label>
                  <select 
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full bg-surface-container-high border-none rounded-xl text-white text-sm p-3 focus:ring-2 focus:ring-primary-fixed"
                  >
                    <option>Portero</option>
                    <option>Defensa</option>
                    <option>Mediocampista</option>
                    <option>Delantero</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Pierna Hábil</label>
                  <select 
                    value={formData.foot}
                    onChange={(e) => setFormData({...formData, foot: e.target.value})}
                    className="w-full bg-surface-container-high border-none rounded-xl text-white text-sm p-3 focus:ring-2 focus:ring-primary-fixed"
                  >
                    <option>Diestro</option>
                    <option>Zurdo</option>
                    <option>Ambidiestro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Altura</label>
                  <input 
                    type="text"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    className="w-full bg-surface-container-high border-none rounded-xl text-white text-sm p-3 focus:ring-2 focus:ring-primary-fixed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Peso</label>
                  <input 
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className="w-full bg-surface-container-high border-none rounded-xl text-white text-sm p-3 focus:ring-2 focus:ring-primary-fixed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Edad</label>
                  <input 
                    type="text"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full bg-surface-container-high border-none rounded-xl text-white text-sm p-3 focus:ring-2 focus:ring-primary-fixed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Nivel</label>
                  <select 
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    className="w-full bg-surface-container-high border-none rounded-xl text-white text-sm p-3 focus:ring-2 focus:ring-primary-fixed"
                  >
                    <option>Principiante</option>
                    <option>Intermedio</option>
                    <option>Avanzado</option>
                    <option>Pro</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Stats Info */}
            <div className="space-y-6">
              <h4 className="text-white font-headline font-bold uppercase tracking-widest text-xs">Atributos (0-99)</h4>
              <div className="space-y-4">
                {Object.entries(formData.stats).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{key}</label>
                      <span className="text-primary-fixed font-black text-xs">{value as number}</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="99"
                      value={value as number}
                      onChange={(e) => setFormData({
                        ...formData, 
                        stats: { ...formData.stats, [key]: parseInt(e.target.value) }
                      })}
                      className="w-full accent-primary-fixed"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-5 rounded-2xl pitch-gradient text-on-primary-fixed font-headline font-black text-xl uppercase tracking-widest shadow-2xl shadow-primary-fixed/30 active:scale-[0.98] transition-all mt-4"
          >
            Guardar Cambios
          </button>
        </div>
      </motion.div>
    </div>
  );
}
