"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, QrCode, Share2, Download, AlertTriangle, CheckCircle, Info } from "lucide-react"
import Link from "next/link"
import { QRCodeGenerator } from "@/components/qr-code-generator"

interface ICTDefect {
  id: string
  timestamp: string
  operator: string
  defectType: string
  component: string
  partNumber: string
  pin: string
  testStation: string
  boardSerial: string
  comment: string
  suggestion: string
  pinExplanation: string
  severity: "high" | "medium" | "low"
  status: "open" | "in-progress" | "resolved"
  testResult: "pass" | "fail" | "warning"
}

export default function DefectDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [defect, setDefect] = useState<ICTDefect | null>(null)
  const [loading, setLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)

  const defectId = params.id as string
  const partNumber = searchParams.get("part")
  const boardSerial = searchParams.get("board")
  const testStation = searchParams.get("station")

  useEffect(() => {
    // In a real app, this would fetch from an API
    loadDefectData()
  }, [defectId])

  const loadDefectData = () => {
    // Simulate API call - in real app, fetch from backend
    const sampleDefects: ICTDefect[] = [
      {
        id: "ICT-001",
        timestamp: "2024-01-15 10:30:00",
        operator: "ZAROUGUI Marwa",
        defectType: "Cold Solder",
        component: "Resistor",
        partNumber: "R1234-100K-0603",
        pin: "Pin 1",
        testStation: "ICT-Station-A",
        boardSerial: "PCB-2024-001",
        comment: "Visible gap in solder joint, high resistance reading detected during ICT test",
        suggestion: "Rework solder joint, verify resistance value with multimeter, ensure proper reflow temperature",
        pinExplanation: "Input side - check for cold solder joint, ensure proper connection and continuity",
        severity: "high",
        status: "open",
        testResult: "fail",
      },
      {
        id: "ICT-002",
        timestamp: "2024-01-15 11:15:00",
        operator: "AYA TBOUALLALT",
        defectType: "Component Missing",
        component: "Capacitor",
        partNumber: "C5678-10uF-0805",
        pin: "Pin 2",
        testStation: "ICT-Station-B",
        boardSerial: "PCB-2024-002",
        comment: "Capacitor not populated, open circuit detected during capacitance measurement",
        suggestion: "Install missing capacitor, verify polarity and value, check placement accuracy",
        pinExplanation: "Negative lead - check polarity, ensure proper grounding and connection",
        severity: "high",
        status: "in-progress",
        testResult: "fail",
      },
      // Add more sample data as needed
    ]

    const foundDefect = sampleDefects.find((d) => d.id === defectId)
    setDefect(foundDefect || null)
    setLoading(false)
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-6 w-6 text-red-500" />
      case "medium":
        return <Info className="h-6 w-6 text-yellow-500" />
      case "low":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      default:
        return <Info className="h-6 w-6 text-gray-500" />
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

  const shareDefect = async () => {
    const currentUrl = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ICT Defect ${defectId}`,
          text: `Defect found in ${partNumber} - ${defect?.defectType}`,
          url: currentUrl,
        })
      } catch (err) {
        // Fallback to copy
        navigator.clipboard.writeText(currentUrl)
      }
    } else {
      navigator.clipboard.writeText(currentUrl)
    }
  }

  const downloadReport = () => {
    if (!defect) return

    const report = `ICT DEFECT REPORT
==================

Defect ID: ${defect.id}
Timestamp: ${defect.timestamp}
Operator: ${defect.operator}

COMPONENT INFORMATION
--------------------
Part Number: ${defect.partNumber}
Component Type: ${defect.component}
Affected Pin: ${defect.pin}
Board Serial: ${defect.boardSerial}
Test Station: ${defect.testStation}

DEFECT DETAILS
--------------
Defect Type: ${defect.defectType}
Severity: ${defect.severity.toUpperCase()}
Status: ${defect.status.toUpperCase()}
Test Result: ${defect.testResult.toUpperCase()}

DESCRIPTION
-----------
${defect.comment}

PIN ANALYSIS
------------
${defect.pinExplanation}

RECOMMENDED ACTION
------------------
${defect.suggestion}

Generated: ${new Date().toLocaleString()}
Direct Link: ${window.location.href}`

    const blob = new Blob([report], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ICT-Defect-${defectId}-Report.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium dark:text-white">Loading defect details...</p>
        </div>
      </div>
    )
  }

  if (!defect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link
              href="/ict-dashboard"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to ICT Dashboard
            </Link>
          </div>
          <Alert variant="destructive">
            <AlertDescription>Defect {defectId} not found. Please check the ID and try again.</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              href="/ict-dashboard"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to ICT Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 flex items-center space-x-3">
              {getSeverityIcon(defect.severity)}
              <span>ICT Defect {defect.id}</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Detailed analysis for {defect.partNumber} on board {defect.boardSerial}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setShowQR(!showQR)}>
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </Button>
            <Button variant="outline" onClick={shareDefect}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={downloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>

        {/* QR Code Section */}
        {showQR && (
          <Card className="mb-6 bg-blue-50 dark:bg-blue-900/20">
            <CardHeader>
              <CardTitle>Direct Access QR Code</CardTitle>
              <CardDescription>Share this QR code for instant access to this defect report</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <QRCodeGenerator
                value={window.location.href}
                size={250}
                title={`${defect.partNumber} - ${defect.defectType}`}
                showActions={true}
              />
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Status</p>
                    <Badge
                      className={
                        defect.status === "open"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : defect.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }
                      size="lg"
                    >
                      {defect.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Severity</p>
                    <Badge className={getSeverityColor(defect.severity)} size="lg">
                      {defect.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Test Result</p>
                    <Badge
                      className={
                        defect.testResult === "fail"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : defect.testResult === "warning"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }
                      size="lg"
                    >
                      {defect.testResult.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Issue Description */}
            <Card>
              <CardHeader>
                <CardTitle>Issue Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{defect.comment}</p>
              </CardContent>
            </Card>

            {/* Pin Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Pin Analysis - {defect.pin}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{defect.pinExplanation}</p>
              </CardContent>
            </Card>

            {/* Recommended Action */}
            <Card className="bg-green-50 dark:bg-green-900/20">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-200">Recommended Action</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 dark:text-green-300 leading-relaxed font-medium text-lg">
                  {defect.suggestion}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Component Information */}
            <Card>
              <CardHeader>
                <CardTitle>Component Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Part Number</label>
                  <p className="font-mono text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {defect.partNumber}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Component</label>
                  <p className="font-medium">{defect.component}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Pin</label>
                  <p>
                    <Badge variant="secondary">{defect.pin}</Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Defect Type</label>
                  <p>
                    <Badge variant="outline">{defect.defectType}</Badge>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Test Information */}
            <Card>
              <CardHeader>
                <CardTitle>Test Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Board Serial</label>
                  <p className="font-mono font-medium">{defect.boardSerial}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Test Station</label>
                  <p className="font-mono font-medium">{defect.testStation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Timestamp</label>
                  <p className="font-mono text-sm">{new Date(defect.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Operator</label>
                  <p className="font-medium">{defect.operator}</p>
                </div>
              </CardContent>
            </Card>

            {/* URL Parameters Info */}
            {(partNumber || boardSerial || testStation) && (
              <Card className="bg-blue-50 dark:bg-blue-900/20">
                <CardHeader>
                  <CardTitle className="text-sm">QR Code Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {partNumber && (
                    <p>
                      <strong>Part:</strong> {partNumber}
                    </p>
                  )}
                  {boardSerial && (
                    <p>
                      <strong>Board:</strong> {boardSerial}
                    </p>
                  )}
                  {testStation && (
                    <p>
                      <strong>Station:</strong> {testStation}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
