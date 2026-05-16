// POST /.netlify/functions/delete-path
// Body: { id }
// Deletes "<userEmail>/<id>" from the characters store.

import { getUserEmail, getCharactersStore, ok, unauthorized, badRequest, serverError } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'DELETE') return badRequest('POST or DELETE only');
  const email = getUserEmail(event, context);
  if (!email) return unauthorized();

  let id;
  if (event.httpMethod === 'POST') {
    try { id = (JSON.parse(event.body || '{}')).id; }
    catch { return badRequest('Invalid JSON'); }
  } else {
    id = event.queryStringParameters?.id;
  }
  if (!id) return badRequest('Missing id');

  const store = await getCharactersStore();
  if (!store) return serverError('Cloud storage unavailable');

  try {
    await store.delete(`${email}/${id}`);
    return ok({ ok: true, id });
  } catch (e) {
    console.error('delete-path error:', e);
    return serverError('Failed to delete: ' + e.message);
  }
};
