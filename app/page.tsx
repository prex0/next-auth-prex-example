"use client"
import { useCallback, useEffect, useState } from "react"
import { AuthStatus, EmbeddedWallet, LogoutWalletButton} from "@prex0/uikit/wallet"
import { Address } from "@prex0/uikit/identity"
import { PrexUIKitProvider } from "@prex0/uikit"
import { getSession } from "next-auth/react"
import { CHAIN_ID, POLICY_ID } from "@/lib/constants"
import { LoginComponent } from "@/components/login"
import "@prex0/uikit/styles.css"

export default function Page() {
  return (<PrexUIKitProvider
    chainId={CHAIN_ID}
    policyId={POLICY_ID}
  >
    <WalletPage />
  </PrexUIKitProvider>)
}

function WalletPage() {
  const [email, setEmail] = useState("")

  const getIDToken = useCallback(async () => {
    const response = await fetch("/api/token", {
      method: "GET",
    });

    const json = await response.json()

    return json.data as string
  }, [])

  useEffect(() => {
    ;(async () => {
      const session = await getSession()

      if(session) {
        setEmail(session.user?.email ?? "")
      }
    })()
  }, [])

  return (
    <div className="container mx-auto pt-10">
      <AuthStatus
        getIDTokenHandler={getIDToken}
        loginComponent={
          <LoginComponent />
        }>
        <EmbeddedWallet title="Embedded Wallet" username={email}>
          <div>
          <Address />
            <LogoutWalletButton buttonText="Logout" />
          </div>
        </EmbeddedWallet>
      </AuthStatus>
    </div>
  )
}
