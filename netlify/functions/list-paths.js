// GET /.netlify/functions/list-paths
// Returns all paths stored under the signed-in user's email prefix.

import { getUserEmail, getCharactersStore, ok, unauthorized, serverError } from './_auth.js';

export const handler = async (event, context) => {
  const email = getUserEmail(event, context);
  if (!email) return unauthorized();

  const store = await getCharactersStore();
  if (!store) return ok({ paths: [], note: 'Cloud storage unavailable' });

  try {
    const { blobs } = await store.list({ prefix: `${email}/` });
    if (!blobs || !blobs.length) return ok({ paths: [] });
    // Fetch each in parallel
    const paths = await Promise.all(
      blobs.map(async (b) => {
        try { return await store.get(b.key, { type: 'json' }); }
        catch { return null; }
      })
    );
    return ok({ paths: paths.filter(Boolean).sort((a,b)=>(b.saved_at||'').localeCompare(a.saved_at||'')) });
  } catch (e) {
    console.error('list-paths error:', e);
    return serverError('Failed to list: ' + e.message);
  }
};
