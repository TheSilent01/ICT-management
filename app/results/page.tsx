"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Search, Download, AlertTriangle, CheckCircle, Info, QrCode } from "lucide-react"
import Link from "next/link"
import { QRCodeGenerator } from "@/components/qr-code-generator"

interface DefectProblem {
  timestamp: string
  operator: string
  defectType: string
  component: string
  pin: string
  comment: string
  suggestion: string
  pinExplanation: string
  severity: "high" | "medium" | "low"
}

export default function ResultsPage() {
  const [problems, setProblems] = useState<DefectProblem[]>([])
  const [filteredProblems, setFilteredProblems] = useState<DefectProblem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    const storedResults = sessionStorage.getItem("defectResults")
    if (storedResults) {
      const parsedResults = JSON.parse(storedResults)
      setProblems(parsedResults)
      setFilteredProblems(parsedResults)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = problems.filter((problem) =>
        Object.values(problem).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredProblems(filtered)
    } else {
      setFilteredProblems(problems)
    }
  }, [searchTerm, problems])

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Info className="h-4 w-4 text-yellow-500" />
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const exportToCSV = () => {
    const headers = [
      "Timestamp",
      "Operator",
      "Defect Type",
      "Component",
      "Pin",
      "Pin Explanation",
      "Comment",
      "Suggestion",
      "Severity",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredProblems.map((problem) =>
        [
          problem.timestamp,
          problem.operator,
          problem.defectType,
          problem.component,
          problem.pin,
          `"${problem.pinExplanation}"`,
          `"${problem.comment}"`,
          `"${problem.suggestion}"`,
          problem.severity,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `defect-analysis-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : ""

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="dark:text-white">Loading results...</p>
        </div>
      </div>
    )
  }

  if (problems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link
              href="/upload"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Upload
            </Link>
          </div>
          <Alert>
            <AlertDescription>No results found. Please upload a file first.</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/upload"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Upload
          </Link>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setShowQR(!showQR)} variant="outline">
              <QrCode className="h-4 w-4 mr-2" />
              Share Results
            </Button>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          </div>
        </div>

        {/* QR Code Modal */}
        {showQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Share Analysis Results</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">Scan this QR code to access these results</p>
              </CardHeader>
              <CardContent className="text-center">
                <QRCodeGenerator value={currentUrl} size={200} />
                <p className="text-xs text-gray-500 mt-2 mb-4">Results found: {problems.length} defects</p>
                <Button onClick={() => setShowQR(false)} className="w-full" variant="outline">
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Defect Analysis Results</CardTitle>
            <div className="flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400">
                Found {problems.length} defect{problems.length !== 1 ? "s" : ""} to analyze
              </p>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search defects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>Defect Type</TableHead>
                    <TableHead>Component</TableHead>
                    <TableHead>Pin</TableHead>
                    <TableHead>Pin Explanation</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Suggested Action</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProblems.map((problem, index) => (
                    <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell className="font-mono text-sm">
                        {new Date(problem.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{problem.operator}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{problem.defectType}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{problem.component}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{problem.pin}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm text-gray-600 dark:text-gray-400" title={problem.pinExplanation}>
                          {problem.pinExplanation}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm text-gray-600 dark:text-gray-400" title={problem.comment}>
                          {problem.comment.length > 50 ? `${problem.comment.substring(0, 50)}...` : problem.comment}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm font-medium" title={problem.suggestion}>
                          {problem.suggestion.length > 60
                            ? `${problem.suggestion.substring(0, 60)}...`
                            : problem.suggestion}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getSeverityIcon(problem.severity)}
                          <Badge className={getSeverityColor(problem.severity)}>{problem.severity.toUpperCase()}</Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {filteredProblems.length === 0 && searchTerm && (
          <Alert className="mt-4">
            <AlertDescription>No defects found matching "{searchTerm}". Try a different search term.</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
