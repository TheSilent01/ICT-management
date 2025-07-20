"use client"
import React from "react"
import ErrorBoundary from "./error-boundary"

interface Props {
  children: React.ReactNode
}

const ClientErrorBoundary: React.FC<Props> = ({ children }) => {
  return <ErrorBoundary>{children}</ErrorBoundary>
}

export default ClientErrorBoundary
