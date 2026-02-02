import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 15,
  duration: '45s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<300'],
  },
};

export default function () {
  const res = http.get('http://localhost:3000/legalsystem/events');
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}