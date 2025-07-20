"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import DefectList from '@/components/defect-list'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [fileFormat, setFileFormat] = useState<string>("auto")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ]
      const validExtensions = [".csv", ".xls", ".xlsx"]

      const isValidType =
        validTypes.includes(selectedFile.type) ||
        validExtensions.some((ext) => selectedFile.name.toLowerCase().endsWith(ext))

      if (!isValidType) {
        setError("Please select a valid CSV, XLS, or XLSX file")
        return
      }

      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB")
        return
      }

      setFile(selectedFile)
      setError(null)

      // Auto-detect format
      if (selectedFile.name.toLowerCase().endsWith(".csv")) {
        setFileFormat("csv")
      } else if (selectedFile.name.toLowerCase().endsWith(".xlsx")) {
        setFileFormat("xlsx")
      } else if (selectedFile.name.toLowerCase().endsWith(".xls")) {
        setFileFormat("xls")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("format", fileFormat)

      const response = await fetch("/api/upload-file", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload file")
      }

      const result = await response.json()

      // Store results and redirect
      sessionStorage.setItem("defectResults", JSON.stringify(result.problems))

      // Also store in localStorage for dashboard
      const existingData = localStorage.getItem("allDefectResults")
      const allData = existingData ? JSON.parse(existingData) : []
      const updatedData = [...allData, ...result.problems]
      localStorage.setItem("allDefectResults", JSON.stringify(updatedData))

      router.push("/results")
    } catch (err) {
      setError("Failed to process file. Please check the format and try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const downloadSampleCSV = () => {
    const link = document.createElement("a");
    link.href = "/sample-defect-data.csv";
    link.download = "sample-defect-data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <Upload className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-2xl">Upload Defect File</CardTitle>
                  <CardDescription>
                    Upload CSV, XLS, or XLSX files to analyze defects and get component-specific recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="file-format">File Format</Label>
                      <Select value={fileFormat} onValueChange={setFileFormat}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto-detect</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="xlsx">XLSX (Excel 2007+)</SelectItem>
                          <SelectItem value="xls">XLS (Excel 97-2003)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="csv-file">Select File</Label>
                      <Input
                        id="csv-file"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileChange}
                        className="mt-2"
                      />
                      {file && (
                        <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <FileText className="h-4 w-4 mr-2" />
                          {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </div>
                      )}
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={!file || isUploading}>
                      {isUploading ? "Processing..." : "Upload and Analyze"}
                    </Button>
                  </form>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Need a sample file?</h3>
                      <Button variant="outline" onClick={downloadSampleCSV}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Sample CSV
                      </Button>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="font-semibold mb-2">Required Columns:</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <p>
                          <strong>Timestamp:</strong> Date and time of defect (YYYY-MM-DD HH:MM:SS)
                        </p>
                        <p>
                          <strong>Operator:</strong> Name of person who found the defect
                        </p>
                        <p>
                          <strong>Defect Type:</strong> Type of defect (Cold Solder, Loose Connection, etc.)
                        </p>
                        <p>
                          <strong>Component:</strong> Affected component (Resistor, Capacitor, IC, etc.)
                        </p>
                        <p>
                          <strong>Pin:</strong> Specific pin affected (Pin 1, Pin 2, etc.)
                        </p>
                        <p>
                          <strong>Comment:</strong> Additional details about the defect
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                      <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Supported File Types:</h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <strong className="text-blue-700 dark:text-blue-300">CSV</strong>
                          <p className="text-blue-600 dark:text-blue-400">Comma-separated values</p>
                        </div>
                        <div>
                          <strong className="text-blue-700 dark:text-blue-300">XLSX</strong>
                          <p className="text-blue-600 dark:text-blue-400">Excel 2007 and newer</p>
                        </div>
                        <div>
                          <strong className="text-blue-700 dark:text-blue-300">XLS</strong>
                          <p className="text-blue-600 dark:text-blue-400">Excel 97-2003</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Defects</h2>
        <DefectList />
      </div>
    </div>
  )
}
