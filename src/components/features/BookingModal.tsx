import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Icons } from '../Icons';
import { Court, Reservation } from '../../types';

export function BookingModal({ isOpen, onClose, court, onConfirm }: { isOpen: boolean, onClose: () => void, court: Court | null, onConfirm: (res: Reservation) => void }) {
  const [bookingType, setBookingType] = React.useState<'Individual' | 'Dividido'>('Individual');
  const [participants, setParticipants] = React.useState(4);
  const [selectedTime, setSelectedTime] = React.useState('20:00');

  if (!isOpen || !court) return null;

  const priceNum = parseInt(court.price.replace('k', '')) * 1000;
  const amountPerPerson = Math.round(priceNum / participants);

  const handleConfirm = () => {
    const newRes: Reservation = {
      id: Math.random().toString(36).substr(2, 9),
      court: court.name,
      date: `Hoy, ${selectedTime}`,
      price: court.price,
      status: (bookingType === 'Individual' ? 'Confirmada' : 'Pendiente') as 'Confirmada' | 'Pendiente',
      image: court.image,
      type: bookingType,
      splitInfo: bookingType === 'Dividido' ? {
        totalParticipants: participants,
        paidParticipants: 1,
        amountPerPerson: amountPerPerson,
        participants: Array.from({ length: participants }).map((_, i) => ({
          name: i === 0 ? 'Diego Silva' : 'Pendiente',
          status: i === 0 ? 'Pagado' : 'Pendiente',
          isOrganizer: i === 0
        }))
      } : null
    };
    onConfirm(newRes);
    toast.success(bookingType === 'Dividido' ? 'Reserva creada. ¡Invita a tus amigos para completar el pago!' : '¡Reserva confirmada!');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg bg-surface-container-low rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl"
      >
        <div className="p-8 sm:p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-3xl font-headline font-black text-white uppercase italic tracking-tighter leading-none mb-2">Reservar Cancha</h3>
              <p className="text-on-surface-variant font-bold text-xs uppercase tracking-widest">{court.name}</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <Icons.Plus size={24} className="rotate-45" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Time Selection */}
            <div className="space-y-4">
              <label className="block text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em]">Seleccionar Horario</label>
              <div className="grid grid-cols-3 gap-2">
                {['18:00', '19:00', '20:00', '21:00', '22:00', '23:00'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-3 rounded-xl font-bold text-sm transition-all ${selectedTime === t ? 'bg-primary-fixed text-on-primary-fixed shadow-lg shadow-primary-fixed/20' : 'bg-surface-container-high text-on-surface-variant hover:text-white'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Booking Type */}
            <div className="space-y-4">
              <label className="block text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em]">Método de Pago</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setBookingType('Individual')}
                  className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-2 ${bookingType === 'Individual' ? 'bg-primary-fixed/10 border-primary-fixed' : 'bg-surface-container-high border-transparent hover:border-white/10'}`}
                >
                  <Icons.User size={20} className={bookingType === 'Individual' ? 'text-primary-fixed' : 'text-on-surface-variant'} />
                  <div>
                    <p className={`font-bold text-sm ${bookingType === 'Individual' ? 'text-white' : 'text-on-surface-variant'}`}>Pago Total</p>
                    <p className="text-[10px] text-on-surface-variant">Pagas el 100% ahora</p>
                  </div>
                </button>
                <button 
                  onClick={() => setBookingType('Dividido')}
                  className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-2 ${bookingType === 'Dividido' ? 'bg-primary-fixed/10 border-primary-fixed' : 'bg-surface-container-high border-transparent hover:border-white/10'}`}
                >
                  <Icons.Users size={20} className={bookingType === 'Dividido' ? 'text-primary-fixed' : 'text-on-surface-variant'} />
                  <div>
                    <p className={`font-bold text-sm ${bookingType === 'Dividido' ? 'text-white' : 'text-on-surface-variant'}`}>Pago Dividido</p>
                    <p className="text-[10px] text-on-surface-variant">Divide con tu equipo</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Split Options */}
            <AnimatePresence>
              {bookingType === 'Dividido' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em]">Número de Jugadores</label>
                      <span className="text-primary-fixed font-black">{participants}</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max="12" 
                      value={participants}
                      onChange={(e) => setParticipants(parseInt(e.target.value))}
                      className="w-full accent-primary-fixed"
                    />
                    <div className="flex justify-between items-center bg-surface-container-high p-4 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-fixed/10 flex items-center justify-center text-primary-fixed">
                          <Icons.Trophy size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Costo por Persona</p>
                          <p className="text-xl font-black text-white">${amountPerPerson.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Total</p>
                        <p className="text-sm font-bold text-white">${priceNum.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={handleConfirm}
              className="w-full py-5 rounded-2xl pitch-gradient text-on-primary-fixed font-headline font-black text-xl uppercase tracking-widest shadow-2xl shadow-primary-fixed/30 active:scale-[0.98] transition-all mt-4"
            >
              {bookingType === 'Dividido' ? 'Crear Pago Dividido' : 'Confirmar Reserva'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
