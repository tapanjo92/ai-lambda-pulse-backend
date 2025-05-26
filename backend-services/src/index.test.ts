import { handler } from './index';

test('handler returns 200 and OK body', async () => {
  const resp = await handler({ foo: 'bar' });
  expect(resp.statusCode).toBe(200);
  expect(JSON.parse(resp.body).message).toBe('OK');
});
