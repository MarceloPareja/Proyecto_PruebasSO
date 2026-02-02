import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '20s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  },
};

let token = '';

export function setup() {
  const loginRes = http.post('http://localhost:3000/legalsystem/account/login', JSON.stringify({
    email: 'testuser@gmail.com',
    password: 'test1234'
  }), { headers: { 'Content-Type': 'application/json' } });
  token = loginRes.json('token');
  return { token };
}

export default function (data) {
  const payload = JSON.stringify({
    accountId: 1,
    title: `Test Process ${__VU}`,
    processType: 'Civil',
    // ... otros campos
  });
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.token}`,
    },
  };
  const res = http.post('http://localhost:3000/legalsystem/process', payload, params);
  check(res, { 'status 201': (r) => r.status === 201 });
  sleep(1);
}