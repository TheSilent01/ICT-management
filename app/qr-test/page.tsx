"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QRCodeGenerator } from "@/components/qr-code-generator"
import { ArrowLeft, TestTube } from "lucide-react"
import Link from "next/link"

export default function QRTestPage() {
  const [qrValue, setQrValue] = useState("http://localhost:3000")
  const [qrSize, setQrSize] = useState(200)
  const [qrLevel, setQrLevel] = useState<"L" | "M" | "Q" | "H">("M")

  const testUrls = [
    "http://localhost:3000",
    "http://localhost:3000/results?id=12345",
    "http://localhost:3000/dashboard",
    "mailto:yassine.elaidous@ensam.ac.ma?subject=Defect%20Report",
    "tel:+212600000000",
    "BEGIN:VCARD\nVERSION:3.0\nFN:Yassine El Aidous\nORG:@lear Internship\nTEL:+212600000000\nEMAIL:yassine.elaidous@ensam.ac.ma\nEND:VCARD",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center">
              <TestTube className="h-8 w-8 mr-3 text-blue-600" />
              QR Code Testing Lab
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Test QR code generation, sharing, and scanning functionality
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle>QR Code Generator</CardTitle>
                <CardDescription>Customize and test QR code generation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="qr-value">Content to Encode</Label>
                  <Input
                    id="qr-value"
                    value={qrValue}
                    onChange={(e) => setQrValue(e.target.value)}
                    placeholder="Enter URL, text, or data..."
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="qr-size">Size (px)</Label>
                    <Select value={qrSize.toString()} onValueChange={(value) => setQrSize(Number.parseInt(value))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="150">150px</SelectItem>
                        <SelectItem value="200">200px</SelectItem>
                        <SelectItem value="250">250px</SelectItem>
                        <SelectItem value="300">300px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="qr-level">Error Correction</Label>
                    <Select value={qrLevel} onValueChange={(value: "L" | "M" | "Q" | "H") => setQrLevel(value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Low (7%)</SelectItem>
                        <SelectItem value="M">Medium (15%)</SelectItem>
                        <SelectItem value="Q">Quartile (25%)</SelectItem>
                        <SelectItem value="H">High (30%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Quick Test URLs</Label>
                  <div className="mt-2 space-y-2">
                    {testUrls.map((url, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setQrValue(url)}
                        className="w-full text-left justify-start text-xs"
                      >
                        {url.length > 50 ? `${url.substring(0, 50)}...` : url}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Display */}
            <Card>
              <CardHeader>
                <CardTitle>Generated QR Code</CardTitle>
                <CardDescription>Scan with your phone to test functionality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <QRCodeGenerator
                    value={qrValue}
                    size={qrSize}
                    level={qrLevel}
                    title="Test QR Code"
                    showActions={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Results */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Testing Instructions</CardTitle>
              <CardDescription>How to test the QR code functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-green-600 dark:text-green-400">✅ Features to Test</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>
                        <strong>QR Generation:</strong> Change content and see QR code update in real-time
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>
                        <strong>Copy URL:</strong> Click "Copy URL" button and paste elsewhere
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>
                        <strong>Download:</strong> Click "Download" to save QR code as PNG
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>
                        <strong>Share:</strong> Use native sharing (mobile) or fallback to copy
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>
                        <strong>Mobile Scan:</strong> Use phone camera or QR scanner app
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-blue-600 dark:text-blue-400">📱 Mobile Testing</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Open phone camera and point at QR code</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Tap notification to open URL</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Test different content types (URL, email, phone)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Try sharing QR code from mobile browser</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Test download functionality on mobile</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Pro Tips</h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Higher error correction levels work better with damaged or small QR codes</li>
                  <li>• Test QR codes at different sizes to ensure scannability</li>
                  <li>• WiFi and vCard QR codes have special formats - use the test buttons</li>
                  <li>• Some QR scanners work better with higher contrast</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
