import { render, screen } from "@testing-library/react"
import ErrorBoundary from "../error-boundary"
import React from "react"

describe("ErrorBoundary", () => {
  const ProblemChild: React.FC = () => {
    throw new Error("Error thrown from problem child")
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>
  }

  it("catches errors and displays fallback", () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    )

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })
})
