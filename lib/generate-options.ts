/**
 * Generate options for WebAuthn authentication
 * @returns {
 *   auth_session_id: string
 *   options: any
 * }
 */
export async function generateOptions() {
  const response = await fetch("/api/options", {
    method: "POST",
  });

  const json = await response.json()

  return json as {
    auth_session_id: string
    options: any
  }
}
