import api from './axios';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando sembrado de datos en la API remota...');

    // 1. Crear un usuario de prueba (y hacer login)
    const mockUser = {
      name: 'Diego Silva',
      email: `diego${Date.now()}@test.com`,
      password: 'password123',
      role: 'Jugador',
    };

    console.log('1. Creando usuario...');
    await api.post('/auth/register', mockUser);
    
    const loginRes = await api.post('/auth/login', {
      email: mockUser.email,
      password: mockUser.password,
    });
    
    const token = loginRes.data.token;
    localStorage.setItem('pitch_token', token);
    localStorage.setItem('pitch_user', JSON.stringify(loginRes.data.user));

    // 2. Crear Perfil Técnico (usamos el PUT a /users/profile que creamos)
    console.log('2. Configuracion de ficha tecnica...');
    await api.put('/users/profile', {
      name: mockUser.name,
      position: 'Mediocampista',
      level: 'Pro',
      foot: 'Diestro',
      height: '1.78m',
      weight: '75kg',
      age: '24',
      stats: {
        pace: 85,
        shooting: 78,
        passing: 92,
        dribbling: 88,
        defending: 65,
        physical: 74
      }
    });

    // 3. Crear Ligas
    console.log('3. Creando Ligas...');
    await api.post('/leagues', {
      name: 'Clausura 2026',
      region: 'Metropolitana',
      status: 'Activa',
      startDate: '2026-06-15',
      prize: '1.000.000',
      fee: '150.000',
      description: 'Torneo principal de invierno.',
      teamsCount: 24,
      maxTeams: 32
    });

    await api.post('/leagues', {
      name: 'Copa de Verano',
      region: 'Valparaíso',
      status: 'Inscripciones',
      startDate: '2026-12-01',
      prize: '500.000',
      fee: '80.000',
      description: 'Torneo relámpago en la costa.',
      teamsCount: 12,
      maxTeams: 16
    });

    // 4. Crear Equipo
    console.log('4. Creando Equipo...');
    await api.post('/teams', {
      name: 'Galácticos FC',
      region: 'Metropolitana',
      playersCount: 15,
      image: 'https://picsum.photos/seed/team1/400/300',
      status: 'En Liga'
    });

    // 5. Crear Reservas (Individual y Dividida)
    console.log('5. Creando Reservas...');
    await api.post('/reservations', {
      court: 'Club Padel Biobío',
      date: 'Hoy, 20:00',
      price: '25000',
      status: 'Confirmada',
      image: 'https://picsum.photos/seed/padel1/400/300',
      type: 'Individual',
      splitInfo: null
    });

    await api.post('/reservations', {
      court: 'Estadio Español',
      date: 'Mañana, 19:00',
      price: '18000',
      status: 'Pendiente',
      image: 'https://picsum.photos/seed/tennis1/400/300',
      type: 'Dividido',
      splitInfo: {
        totalParticipants: 4,
        paidParticipants: 1,
        amountPerPerson: 4500,
        participants: [
          { name: 'Diego Silva', status: 'Pagado', isOrganizer: true },
          { name: 'Pendiente', status: 'Pendiente', isOrganizer: false },
          { name: 'Pendiente', status: 'Pendiente', isOrganizer: false },
          { name: 'Pendiente', status: 'Pendiente', isOrganizer: false }
        ]
      }
    });

    console.log('✅ Base de datos sembrada con éxito.');
    alert('Base de datos llenada con datos de prueba. ¡La aplicación se recargará para mostrar los cambios!');
    window.location.reload();
  } catch (error) {
    console.error('Error al sembrar la base de datos:', error);
    alert('Error al intentar llenar la base de datos. Si el error es Auth related, asegúrate de que el API responda.');
  }
};
