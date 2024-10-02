const PREX_ENDPOINT = "https://api-v0.prex0.com/functions/v1"

export class PrexBackendApi {
  private readonly endpoint: string;
  private readonly policyId: string;

  constructor(policyId: string, endpoint = PREX_ENDPOINT) {
    this.endpoint = endpoint;
    this.policyId = policyId;
  }

  /**
   * Generate options for Prex authentication
   * @param rpId host name of the site
   * @returns 
   */
  async generateOptions(rpId: string) {
    const result = await this._post(
      "/auth/options",
      JSON.stringify({
        rp_id: rpId,
      }),
    );

    return {
      auth_session_id: result.auth_session_id,
      options: result.options,
    };
  }

  /**
   * Verify Prex authentication
   * @param params 
   * @returns 
   */
  async verify(params: string) {
    const res = await this._post("/auth/verify", params)
    
    return res as {
      verified: boolean;
      wallet: {
        id: number;
        sub: string;
      };
    };    
  }

  async _post(path: string, body: string) {
    const res = await fetch(
      `${this.endpoint}${path}`,
      {
        method: "POST",
        headers: {
          "x-rule": this.policyId,
          "Content-Type": "application/json",
        },
        body,
      },
    );

    return await res.json();
  }
}
  