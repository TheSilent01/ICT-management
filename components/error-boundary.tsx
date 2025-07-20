"use client"
import React, { Component, ErrorInfo, ReactNode } from "react"

interface Props {
  children: ReactNode
  /**
   * Optional custom fallback UI. If omitted, a default message is rendered.
   */
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

/**
 * ErrorBoundary wraps part of the React tree and shows a fallback UI
 * when its children throw an error. This prevents the entire app from crashing
 * and provides a graceful recovery path.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // TODO: Connect to an external error tracking service such as Sentry here.
    // eslint-disable-next-line no-console
    console.error("Uncaught error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center h-full py-10 text-center">
            <h2 className="mb-4 text-2xl font-semibold">Something went wrong</h2>
            <button
              className="px-4 py-2 text-white bg-primary rounded"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
