import React from 'react';
import { toast } from 'sonner';
import { Icons } from '../components/Icons';

export function Reservations({ reservations, setReservations }: { reservations: any[], setReservations: React.Dispatch<React.SetStateAction<any[]>> }) {
  return (
    <div className="pt-24 px-6 max-w-4xl mx-auto space-y-8 pb-12">
      <div className="space-y-2">
        <h2 className="text-4xl font-headline font-black text-white uppercase italic tracking-tighter">Mis Reservas</h2>
        <p className="text-on-surface-variant font-medium">Gestiona tus próximos partidos y entrenamientos.</p>
      </div>

      <div className="space-y-4">
        {reservations.map(res => (
          <div key={res.id} className="bg-surface-container-high rounded-2xl overflow-hidden border border-white/5 flex flex-col sm:flex-row group">
            <div className="sm:w-48 h-32 sm:h-auto relative overflow-hidden">
              <img src={res.image} alt={res.court} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-headline font-bold text-xl uppercase italic tracking-tight">{res.court}</h3>
                  <div className="flex items-center gap-2 text-on-surface-variant text-sm mt-1">
                    <Icons.Clock size={14} className="text-primary-fixed" />
                    <span>{res.date}</span>
                  </div>
                  {res.type === 'Dividido' && (
                    <div className="mt-3 flex items-center gap-2 bg-primary-fixed/10 px-3 py-1 rounded-full w-fit">
                      <Icons.Users size={12} className="text-primary-fixed" />
                      <span className="text-[10px] font-bold text-primary-fixed uppercase tracking-widest">Pago Dividido: {res.splitInfo.paidParticipants}/{res.splitInfo.totalParticipants} Pagados</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-primary-fixed font-headline font-black text-lg">${res.price}</p>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${res.status === 'Confirmada' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {res.status}
                  </span>
                </div>
              </div>

              {res.type === 'Dividido' && (
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Estado del Grupo</span>
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">${res.splitInfo.amountPerPerson} / persona</span>
                  </div>
                  <div className="flex gap-2">
                    {res.splitInfo.participants.map((p: any, i: number) => (
                      <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${p.status === 'Pagado' ? 'border-primary-fixed bg-primary-fixed/20 text-primary-fixed' : 'border-white/10 bg-white/5 text-on-surface-variant'}`} title={p.name}>
                        {p.isOrganizer ? <Icons.User size={14} /> : <Icons.Plus size={14} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                {res.type === 'Dividido' && res.splitInfo.paidParticipants < res.splitInfo.totalParticipants && (
                  <button 
                    onClick={() => toast.success('Link de invitación copiado')}
                    className="flex-1 pitch-gradient py-2.5 rounded-xl text-on-primary-fixed text-xs font-bold uppercase tracking-widest active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Icons.Share size={14} /> Invitar
                  </button>
                )}
                <button className="flex-1 bg-surface-container-highest py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">Modificar</button>
                <button 
                  onClick={() => {
                    setReservations(prev => prev.filter(r => r.id !== res.id));
                    toast.success('Reserva cancelada');
                  }}
                  className="flex-1 border border-red-500/30 text-red-400 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        ))}
        {reservations.length === 0 && (
          <div className="text-center py-20 bg-surface-container-low rounded-3xl border border-dashed border-white/10">
            <Icons.Calendar size={48} className="mx-auto text-on-surface-variant/20 mb-4" />
            <p className="text-on-surface-variant">No tienes reservas activas.</p>
            <button 
              onClick={() => toast.info('Busca una cancha para reservar')}
              className="mt-6 text-primary-fixed font-bold uppercase tracking-widest text-xs hover:underline"
            >
              Explorar Canchas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
