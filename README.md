## Overview

This project serves as a sample application demonstrating the integration of Prex and NextAuth.js for authentication purposes.


[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fprex0%2Fnext-auth-prex-example&env=EMAIL_FROM,AUTH_RESEND_KEY,PRIV_KEY,NEXT_PUBLIC_POLICY_ID,NEXT_PUBLIC_CHAIN_ID&project-name=next-auth-prex-example&repository-name=next-auth-prex-example&redirect-url=https%3A%2F%2Fwww.prex0.com)


## Environment Variables

The following environment variables are required for the project to run correctly. Add these to your `.env.local` file.

- AUTH_SECRET: Secret key for NextAuth
- EMAIL_FROM: Email address for sending emails
- AUTH_RESEND_KEY: Resend API key
- PRIV_KEY: private key to create IDToken for accessing Prex API
- NEXT_PUBLIC_POLICY_ID: Policy ID for Prex API
- NEXT_PUBLIC_CHAIN_ID: Chain ID for Prex API
