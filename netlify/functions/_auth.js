// Shared auth helper — extracts the verified Netlify Identity user email
// from the function's clientContext, or returns null if not authenticated.

export function getUserEmail(event, context) {
  // Netlify Identity injects the verified user into clientContext when a
  // valid JWT is sent with the request.
  const user = context?.clientContext?.user || null;
  if (!user) return null;
  return (user.email || '').toLowerCase().trim() || null;
}

export function unauthorized() {
  return {
    statusCode: 401,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: 'Not signed in. Enable Netlify Identity and sign in to sync paths to the cloud.' })
  };
}

export function ok(body) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body)
  };
}

export function badRequest(msg) {
  return {
    statusCode: 400,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: msg })
  };
}

export function serverError(msg) {
  return {
    statusCode: 500,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: msg })
  };
}

// Safe Blobs accessor — returns null if the runtime doesn't have Blobs
// configured (so functions degrade gracefully).
export async function getCharactersStore() {
  try {
    const { getStore } = await import('@netlify/blobs');
    return getStore('characters');
  } catch (e) {
    console.warn('Netlify Blobs not available:', e.message);
    return null;
  }
}
