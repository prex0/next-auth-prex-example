import React, { useCallback, useState } from "react"
import { UILabel1, UILabel2, usePrex} from "@prex0/uikit"
import { getCsrfToken } from "next-auth/react"
import {cn, pressable, color, placeholder} from "@prex0/uikit/styles"
import { generateOptions } from "../lib/generate-options"
import { authWithOtp } from "../lib/auth-with-otp"
import { authWithPasskey } from "../lib/auth-with-passkey"
import {validateEmail} from "../lib/email"
import { useRouter } from 'next/navigation';

export function LoginComponent({error}: {error?: Error}) {
  const { authenticate } = usePrex()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const isEmailValid = validateEmail(email)

  const authByResend = useCallback(async () => {
    setIsLoading(true)
    
    try {
      const csrfToken = await getCsrfToken()
      
      await authWithOtp(email, csrfToken)
  
      router.push("/success")
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [email])

  const authByPrex = useCallback(async () => {
    setIsLoading(true)
    try {
      const csrfToken = await getCsrfToken()
      const {auth_session_id, options} = await generateOptions();
      const response = await authenticate(options)
      await authWithPasskey(auth_session_id, response, csrfToken)

      location.reload()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [authenticate])

  return (
  <div className="flex justify-center items-center">
    <div className="p-5 flex flex-col space-y-4 max-w-2xl min-w-96">
      <div>
        {error && <p>Error: {error.message}</p>}
      </div>
      <UILabel1>Sign Up</UILabel1>
      <UILabel2>Please enter your email address</UILabel2>

      <input
        className={cn(
          pressable.alternate,
          isEmailValid ? color.foreground : color.error,
          placeholder.default,
          'w-full rounded-xl py-2 pr-5 pl-12 outline-none'
        )}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="text-xs flex justify-end">{isEmailValid ? null : "Invalid email"}</div>
      <button onClick={authByResend} disabled={!isEmailValid || isLoading} className={cn(pressable.primary, !isEmailValid && pressable.disabled, 'text-white', 'rounded-xl', 'p-2')}>
        {isLoading ? "Loading..." : "Sign up with Email"}
      </button>
      <button onClick={authByPrex} className={cn('underline')}>Sign in with Passkey</button>
    </div>
  </div>)
}