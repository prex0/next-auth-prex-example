"use client"
import React from "react"
import { UILabel1, UILabel2 } from "@prex0/uikit"
import "@prex0/uikit/styles.css"

export default function Page() {
  return (
    <div className="container mx-auto pt-10">
      <UILabel1>Email Sent Successfully</UILabel1>
      <UILabel2>We've sent you an email. Please check your inbox.</UILabel2>
    </div>
  )
}