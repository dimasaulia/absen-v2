import { describe, it, expect } from 'bun:test';
import app from '../src';
import { password } from 'bun';

describe('POST /api/users', async () => {
  it('Should reject register if user request is invalid', async () => {
    const resp = await app.request('/api/users', {
      method: 'post',
      body: JSON.stringify({
        username: '',
        password: '',
        name: '',
        email: '',
      }),
    });

    const body = await resp.json();
    expect(resp.status).toBe(400);
    expect(body.errors).toBeDefined();
  });
});
