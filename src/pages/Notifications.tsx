import React from 'react';
import { toast } from 'sonner';
import { Icons } from '../components/Icons';

export function Notifications({ 
  notifications, 
  setNotifications, 
  setChallenges,
  teams 
}: { 
  notifications: any[], 
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>,
  setChallenges: React.Dispatch<React.SetStateAction<any[]>>,
  teams: any[]
}) {
  const [filter, setFilter] = React.useState('all');
  const [permission, setPermission] = React.useState(typeof Notification !== 'undefined' ? Notification.permission : 'denied');

  const requestPermission = () => {
    if (typeof Notification !== 'undefined') {
      Notification.requestPermission().then(perm => {
        setPermission(perm);
        if (perm === 'granted') {
          toast.success('¡Notificaciones activadas!');
        }
      });
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('Todas las notificaciones marcadas como leídas');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleChallengeAction = (notificationId: string, challengeId: string, action: 'Aceptado' | 'Rechazado') => {
    setChallenges(prev => {
      if (action === 'Rechazado') {
        return prev.filter(c => c.id !== challengeId);
      }
      return prev.map(c => c.id === challengeId ? { ...c, status: action } : c);
    });

    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true, actionTaken: action } : n
    ));

    toast.success(`Desafío ${action.toLowerCase()}`);
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  return (
    <div className="pt-24 px-6 max-w-3xl mx-auto space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-headline font-black text-white uppercase italic tracking-tight">Notificaciones</h2>
          <p className="text-on-surface-variant text-sm font-medium">Mantente al día con tu actividad.</p>
        </div>
        <div className="flex items-center gap-4">
          {permission !== 'granted' && (
            <button 
              onClick={requestPermission}
              className="px-4 py-2 rounded-xl bg-primary-fixed/10 text-primary-fixed text-[10px] font-black uppercase tracking-widest hover:bg-primary-fixed/20 transition-colors"
            >
              Activar Push
            </button>
          )}
          <div className="flex items-center gap-2">
            <button 
              onClick={markAllAsRead}
              className="text-primary-fixed text-[10px] font-black uppercase tracking-widest hover:underline"
            >
              Marcar todo
            </button>
            <span className="text-white/10">|</span>
            <button 
              onClick={() => {
                setNotifications([]);
                toast.success('Notificaciones eliminadas');
              }}
              className="text-red-400 text-[10px] font-black uppercase tracking-widest hover:underline"
            >
              Borrar todo
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['all', 'challenge', 'reservation', 'info'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              filter === f 
                ? 'bg-primary-fixed text-black' 
                : 'bg-white/5 text-on-surface-variant hover:bg-white/10'
            }`}
          >
            {f === 'all' ? 'Todas' : f === 'challenge' ? 'Desafíos' : f === 'reservation' ? 'Reservas' : 'Sistema'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`bg-surface-container-low p-6 rounded-3xl border border-white/5 flex flex-col gap-4 transition-all hover:bg-surface-container-high group relative ${!notification.read ? 'border-l-4 border-l-primary-fixed' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  notification.type === 'challenge' ? 'bg-primary-fixed/10 text-primary-fixed' :
                  notification.type === 'reservation' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-white/10 text-white'
                }`}>
                  {notification.type === 'challenge' ? <Icons.Trophy size={24} /> :
                   notification.type === 'reservation' ? <Icons.Calendar size={24} /> :
                   <Icons.Bell size={24} />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-headline font-bold text-white uppercase italic tracking-tight">{notification.title}</h4>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{notification.time}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{notification.message}</p>
                </div>
                <button 
                  onClick={() => deleteNotification(notification.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-on-surface-variant hover:text-red-400 transition-all"
                >
                  <Icons.X size={16} />
                </button>
              </div>

              {/* Quick Actions for Challenges */}
              {notification.type === 'challenge' && notification.actionData?.challengeId && !notification.actionTaken && (
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => handleChallengeAction(notification.id, notification.actionData.challengeId, 'Aceptado')}
                    className="flex-1 py-3 rounded-xl bg-primary-fixed text-black font-headline font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-transform"
                  >
                    Aceptar Desafío
                  </button>
                  <button 
                    onClick={() => handleChallengeAction(notification.id, notification.actionData.challengeId, 'Rechazado')}
                    className="flex-1 py-3 rounded-xl bg-white/5 text-white font-headline font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-transform"
                  >
                    Rechazar
                  </button>
                </div>
              )}

              {notification.actionTaken && (
                <div className="mt-2 py-2 px-4 rounded-xl bg-white/5 border border-white/5 text-center">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                    {notification.actionTaken === 'Aceptado' ? '✓ Desafío Aceptado' : '✕ Desafío Rechazado'}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
            <Icons.BellOff size={48} className="mx-auto text-on-surface-variant/20 mb-4" />
            <p className="text-on-surface-variant font-medium">No hay notificaciones en esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
}
