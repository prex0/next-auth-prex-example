"use client"
import CustomLink from "@/components/custom-link"
import { useCallback, useEffect, useState } from "react"
import { AuthStatus, EmbeddedWallet} from "@prex0/uikit/wallet"
import { Address } from "@prex0/uikit/identity"
import { PrexUIKitProvider, usePrex} from "@prex0/uikit"
import { getCsrfToken, getSession } from "next-auth/react"
import "@prex0/uikit/styles.css"

async function generateOptions() {
  const response = await fetch("/api/options", {
    method: "POST",
  });

  const json = await response.json()

  console.log(json);

  return json as {
    auth_session_id: string
    options: any
  }
}

export default function Page() {
  return (<PrexUIKitProvider
    chainId={421614}
    policyId="8873b874-55e5-44c5-b91d-ec257dbd0173"
  >
    <WalletPage />
  </PrexUIKitProvider>)
}

function WalletPage() {
  const [data, setData] = useState()
  const [email, setEmail] = useState("")
  const { authenticate } = usePrex()

  const getIDToken = useCallback(async () => {
    const response = await fetch("/api/token", {
      method: "GET",
    });

    const json = await response.json()

    return json.data as string
  }, [])
  

  const authByPrex = useCallback(async () => {
    const csrfToken = await getCsrfToken()
    const {auth_session_id, options} = await generateOptions();
    const response = await authenticate(options)
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

    const json = await authResponse.json()

    console.log(json);

  }, [getCsrfToken, authenticate])

  useEffect(() => {
    ;(async () => {
      const session = await getSession()
      console.log(session)
      if(session) {
        setEmail(session.user?.email ?? "")
      }
      const res = await fetch("/api/protected")
      const json = await res.json()
      setData(json)
    })()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Route Handler Usage</h1>
      <p>
        This page fetches data from an API{" "}
        <CustomLink href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers">
          Route Handler
        </CustomLink>
        . The API is protected using the universal{" "}
        <CustomLink href="https://nextjs.authjs.dev#auth">
          <code>auth()</code>
        </CustomLink>{" "}
        method.
      </p>
      <div className="flex flex-col rounded-md bg-gray-100">
        <div className="rounded-t-md bg-gray-200 p-4 font-bold">
          Data from API Route
        </div>
        <pre className="whitespace-pre-wrap break-all px-4 py-6">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>

        <AuthStatus
          getIDTokenHandler={getIDToken}
          loginComponent={
            <div>
              <button onClick={getIDToken}>Get ID Token</button>
            </div>
          }>
          <EmbeddedWallet title="Embedded Wallet" username={email}>
            <Address />
          </EmbeddedWallet>
        </AuthStatus>
        <button onClick={authByPrex}>Auth by Prex</button>

    </div>
  )
}
