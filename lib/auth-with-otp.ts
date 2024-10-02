export async function authWithOtp(email: string, csrfToken: string) {
  await fetch("/api/auth/signin/resend", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      email,
      csrfToken,
      callbackUrl: "/",
      json: 'true',
    }),
  });
}