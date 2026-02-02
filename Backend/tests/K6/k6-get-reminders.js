import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<400'],
  },
};

export default function () {
  const res = http.get('http://localhost:3000/legalsystem/reminders');
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}