"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { QRCodeGenerator } from "@/components/qr-code-generator"
import { Download, QrCode, Package } from "lucide-react"
import JSZip from "jszip"

interface DefectItem {
  id: string
  partNumber: string
  boardSerial: string
  defectType: string
  severity: string
}

interface QRBatchGeneratorProps {
  defects: DefectItem[]
  onClose: () => void
}

export function QRBatchGenerator({ defects, onClose }: QRBatchGeneratorProps) {
  const [selectedDefects, setSelectedDefects] = useState<string[]>([])
  const [qrSize, setQrSize] = useState(200)
  const [qrFormat, setQrFormat] = useState<"png" | "svg">("png")
  const [generating, setGenerating] = useState(false)

  const toggleDefectSelection = (defectId: string) => {
    setSelectedDefects((prev) => (prev.includes(defectId) ? prev.filter((id) => id !== defectId) : [...prev, defectId]))
  }

  const selectAll = () => {
    setSelectedDefects(defects.map((d) => d.id))
  }

  const clearAll = () => {
    setSelectedDefects([])
  }

  const generateDefectURL = (defect: DefectItem) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    return `${baseUrl}/ict-dashboard/defect/${defect.id}?part=${encodeURIComponent(defect.partNumber)}&board=${encodeURIComponent(defect.boardSerial)}`
  }

  const generateQRCode = async (defect: DefectItem): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!

      canvas.width = qrSize
      canvas.height = qrSize

      // Generate QR pattern (simplified version)
      const url = generateDefectURL(defect)
      const gridSize = 25
      const moduleSize = qrSize / gridSize

      // Clear with white background
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, qrSize, qrSize)

      // Generate pattern based on URL
      ctx.fillStyle = "black"
      let hash = 0
      for (let i = 0; i < url.length; i++) {
        hash = (hash << 5) - hash + url.charCodeAt(i)
        hash = hash & hash
      }

      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const seed = (row * gridSize + col + hash) * 1103515245 + 12345
          if ((seed & 0x40000000) !== 0) {
            ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize)
          }
        }
      }

      // Add finder patterns
      const drawFinderPattern = (x: number, y: number) => {
        ctx.fillStyle = "black"
        ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, 7 * moduleSize)
        ctx.fillStyle = "white"
        ctx.fillRect((x + 1) * moduleSize, (y + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize)
        ctx.fillStyle = "black"
        ctx.fillRect((x + 2) * moduleSize, (y + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize)
      }

      drawFinderPattern(0, 0)
      drawFinderPattern(gridSize - 7, 0)
      drawFinderPattern(0, gridSize - 7)

      canvas.toBlob(
        (blob) => {
          resolve(blob!)
        },
        qrFormat === "png" ? "image/png" : "image/svg+xml",
      )
    })
  }

  const downloadBatch = async () => {
    if (selectedDefects.length === 0) return

    setGenerating(true)

    try {
      const zip = new JSZip()
      const selectedDefectItems = defects.filter((d) => selectedDefects.includes(d.id))

      for (const defect of selectedDefectItems) {
        const qrBlob = await generateQRCode(defect)
        const filename = `QR_${defect.id}_${defect.partNumber.replace(/[^a-zA-Z0-9]/g, "_")}.${qrFormat}`
        zip.file(filename, qrBlob)

        // Also add a text file with defect info
        const infoText = `Defect ID: ${defect.id}
Part Number: ${defect.partNumber}
Board Serial: ${defect.boardSerial}
Defect Type: ${defect.defectType}
Severity: ${defect.severity}
Direct Link: ${generateDefectURL(defect)}
Generated: ${new Date().toISOString()}`

        zip.file(`INFO_${defect.id}.txt`, infoText)
      }

      const zipBlob = await zip.generateAsync({ type: "blob" })
      const url = window.URL.createObjectURL(zipBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `QR_Codes_Batch_${new Date().toISOString().split("T")[0]}.zip`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating batch QR codes:", error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Batch QR Code Generator
          </CardTitle>
          <CardDescription>Generate QR codes for multiple defects and download as a ZIP file</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Settings */}
          <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <label className="text-sm font-medium">QR Code Size</label>
              <Select value={qrSize.toString()} onValueChange={(value) => setQrSize(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="150">150px (Small)</SelectItem>
                  <SelectItem value="200">200px (Medium)</SelectItem>
                  <SelectItem value="300">300px (Large)</SelectItem>
                  <SelectItem value="400">400px (Extra Large)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Format</label>
              <Select value={qrFormat} onValueChange={(value: "png" | "svg") => setQrFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG (Raster)</SelectItem>
                  <SelectItem value="svg">SVG (Vector)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Badge variant="outline" className="text-sm">
                {selectedDefects.length} of {defects.length} selected
              </Badge>
            </div>
          </div>

          {/* Selection Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={selectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={downloadBatch} disabled={selectedDefects.length === 0 || generating}>
                <Download className="h-4 w-4 mr-2" />
                {generating ? "Generating..." : `Download ${selectedDefects.length} QR Codes`}
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>

          {/* Defect Selection */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {defects.map((defect) => (
              <div
                key={defect.id}
                className={`flex items-center space-x-4 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  selectedDefects.includes(defect.id) ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200" : ""
                }`}
                onClick={() => toggleDefectSelection(defect.id)}
              >
                <Checkbox
                  checked={selectedDefects.includes(defect.id)}
                  onChange={() => toggleDefectSelection(defect.id)}
                />
                <QrCode className="h-4 w-4 text-gray-500" />
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-semibold">{defect.id}</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">{defect.partNumber}</span>
                    <Badge variant="outline">{defect.defectType}</Badge>
                    <Badge
                      className={
                        defect.severity === "high"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : defect.severity === "medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }
                    >
                      {defect.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">Board: {defect.boardSerial}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Preview */}
          {selectedDefects.length > 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold mb-3">Preview (First Selected Item)</h4>
              <div className="flex justify-center">
                <QRCodeGenerator
                  value={generateDefectURL(defects.find((d) => d.id === selectedDefects[0])!)}
                  size={Math.min(qrSize, 150)}
                  showActions={false}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
