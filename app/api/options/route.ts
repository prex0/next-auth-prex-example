import { NextRequest } from "next/server";
import { PrexBackendApi } from "@/lib/prex-api"

const POLICY_ID = process.env.NEXT_PUBLIC_POLICY_ID || '';

export const POST = async (req: NextRequest) => {
  const api = new PrexBackendApi(POLICY_ID);

  const options = await api.generateOptions(req.nextUrl.hostname);

  return Response.json(options)
}
