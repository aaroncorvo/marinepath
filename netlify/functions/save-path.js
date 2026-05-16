// POST /.netlify/functions/save-path
// Body: { id, name, state, history, projection_at_60, player_name, player_email }
// Stores the path under "<userEmail>/<id>" in the "characters" Blobs store.

import { getUserEmail, getCharactersStore, ok, unauthorized, badRequest, serverError } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') return badRequest('POST only');
  const email = getUserEmail(event, context);
  if (!email) return unauthorized();

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return badRequest('Invalid JSON'); }

  const id = body.id || ('p_' + Date.now());
  const path = {
    id,
    name: body.name || 'Untitled',
    saved_at: new Date().toISOString(),
    player_name: body.player_name || '',
    player_email: email,
    state: body.state || {},
    history: body.history || [],
    projection_at_60: body.projection_at_60 || null
  };

  const store = await getCharactersStore();
  if (!store) {
    return serverError('Cloud storage unavailable. Path saved locally only.');
  }

  try {
    await store.setJSON(`${email}/${id}`, path);
    return ok({ ok: true, id, saved_at: path.saved_at });
  } catch (e) {
    console.error('save-path error:', e);
    return serverError('Failed to save: ' + e.message);
  }
};
