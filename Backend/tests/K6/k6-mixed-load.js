import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración combinada de tus archivos
export const options = {
  stages: [
    { duration: '10s', target: 15 }, // Ramp-up basado en k6-get-events
    { duration: '40s', target: 20 }, // Steady state de k6-mixed-load
    { duration: '10s', target: 0 },  // Ramp-down
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],   // Máximo 1% de fallos
    http_req_duration: ['p(95)<600'], // 95% de las peticiones < 600ms
  },
};

// Función de configuración (se ejecuta una vez)
export function setup() {
  const loginRes = http.post('http://localhost:3000/legalsystem/account/login', JSON.stringify({
    email: 'testuser@gmail.com', // Credenciales de tus archivos k6
    password: 'test1234'
  }), { headers: { 'Content-Type': 'application/json' } });

  const token = loginRes.json('token');
  check(loginRes, { 'login exitoso': (r) => r.status === 200 });
  
  return { token };
}

// Función principal (se ejecuta por cada VU)
export default function (data) {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.token}`,
    },
  };

  // Simulación de carga mixta basada en tus endpoints
  const rand = Math.random();
  
  if (rand < 0.4) {
    // 40% de probabilidad: Obtener cuentas (tu consulta original)
    const res = http.get('http://localhost:3000/legalsystem/accounts', params);
    check(res, { 'status 200 accounts': (r) => r.status === 200 });
  } else if (rand < 0.7) {
    // 30% de probabilidad: Obtener eventos (de k6-get-events.js)
    const res = http.get('http://localhost:3000/legalsystem/events', params);
    check(res, { 'status 200 events': (r) => r.status === 200 });
  } else {
    // 30% de probabilidad: Obtener recordatorios (de k6-get-reminders.js)
    const res = http.get('http://localhost:3000/legalsystem/reminders', params);
    check(res, { 'status 200 reminders': (r) => r.status === 200 });
  }

  sleep(1);
}