import { NextRequest } from "next/server";

const POLICY_ID = '8873b874-55e5-44c5-b91d-ec257dbd0173';
const PREX_ENDPOINT = "https://api-v0.prex0.com/functions/v1";

export const POST = async (req: NextRequest) => {
  const api = new PrexBackendApi(PREX_ENDPOINT, POLICY_ID);

  const options = await api.generateOptions(req.nextUrl.hostname);

  return Response.json(options)
}

export class PrexBackendApi {
  private readonly endpoint: string;
  private readonly policyId: string;

  constructor(endpoint: string, policyId: string) {
    this.endpoint = endpoint;
    this.policyId = policyId;
  }

  // Prex APIを呼び出して、認証オプションを取得する
  // headerにx-ruleを付与することで、Prex APIがポリシーIDをチェックする
  // bodyパラメータ
  //   rp_id: パスキー認証するサイトのホスト名
  // レスポンス
  //   auth_session_id: 認証セッションID(prex APIのauth/verifyで使用する)
  //   options: 認証オプション(prex SDKのauthenticate methodで使用する)
  async generateOptions(rpId: string) {
    console.log("generateOptions", rpId);
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
