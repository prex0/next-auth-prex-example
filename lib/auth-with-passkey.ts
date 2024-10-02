export async function authWithPasskey(auth_session_id: string, response: any, csrfToken: string) {
  const authResponse = await fetch("/api/auth/callback/credentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      password: JSON.stringify({
        auth_session_id,
        response,
        user_handle: response.response.userHandle
      }),
      csrfToken,
      callbackUrl: "/",
      json: 'true',
    }),
  });
  
  return await authResponse.json()
}