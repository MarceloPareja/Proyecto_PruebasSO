import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'], 
    http_req_duration: ['p(95)<500'], 
  },
};

let token = ''; 

export function setup() {
  const loginRes = http.post('http://localhost:3000/legalsystem/account/login', JSON.stringify({
    email: 'testuser@gmail.com',
    password: 'test1234'
  }), { headers: { 'Content-Type': 'application/json' } });
  check(loginRes, { 'login success': (r) => r.status === 200 });
  token = loginRes.json('token');
  return { token };
}

export default function (data) {
  const params = { headers: { Authorization: `Bearer ${data.token}` } };
  const res = http.get('http://localhost:3000/legalsystem/accounts', params);
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}