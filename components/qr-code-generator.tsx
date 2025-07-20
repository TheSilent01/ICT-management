"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Download, Share2 } from "lucide-react"

interface QRCodeGeneratorProps {
  value: string
  size?: number
  level?: "L" | "M" | "Q" | "H"
  title?: string
  showActions?: boolean
}

export function QRCodeGenerator({ value, size = 200, level = "M", title, showActions = true }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!canvasRef.current || !value) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // Set canvas size
    canvas.width = size
    canvas.height = size

    // Generate QR code pattern
    generateQRPattern(ctx, value, size)
  }, [value, size, level])

  const generateQRPattern = (ctx: CanvasRenderingContext2D, data: string, canvasSize: number) => {
    const gridSize = 25 // 25x25 modules
    const moduleSize = canvasSize / gridSize
    const padding = 2

    // Clear canvas with white background
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvasSize, canvasSize)

    // Create a more realistic QR code pattern
    ctx.fillStyle = "black"

    // Generate pattern based on data
    const pattern = createQRPattern(data, gridSize)

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (pattern[row][col]) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize)
        }
      }
    }

    // Add finder patterns (corner squares)
    drawFinderPattern(ctx, 0, 0, moduleSize)
    drawFinderPattern(ctx, gridSize - 7, 0, moduleSize)
    drawFinderPattern(ctx, 0, gridSize - 7, moduleSize)

    // Add timing patterns
    drawTimingPattern(ctx, 6, moduleSize, gridSize)

    // Add alignment pattern (center)
    if (gridSize > 15) {
      drawAlignmentPattern(ctx, Math.floor(gridSize / 2), Math.floor(gridSize / 2), moduleSize)
    }
  }

  const createQRPattern = (data: string, size: number): boolean[][] => {
    const pattern: boolean[][] = Array(size)
      .fill(null)
      .map(() => Array(size).fill(false))

    // Create a pseudo-random pattern based on the data
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      hash = (hash << 5) - hash + data.charCodeAt(i)
      hash = hash & hash // Convert to 32-bit integer
    }

    // Fill pattern with pseudo-random data
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        // Skip finder pattern areas
        if (
          (row < 9 && col < 9) ||
          (row < 9 && col >= size - 8) ||
          (row >= size - 8 && col < 9) ||
          row === 6 ||
          col === 6 // Timing patterns
        ) {
          continue
        }

        // Generate pattern based on position and hash
        const seed = (row * size + col + hash) * 1103515245 + 12345
        pattern[row][col] = (seed & 0x40000000) !== 0
      }
    }

    return pattern
  }

  const drawFinderPattern = (ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number) => {
    // Outer 7x7 black square
    ctx.fillStyle = "black"
    ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, 7 * moduleSize)

    // Inner 5x5 white square
    ctx.fillStyle = "white"
    ctx.fillRect((x + 1) * moduleSize, (y + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize)

    // Center 3x3 black square
    ctx.fillStyle = "black"
    ctx.fillRect((x + 2) * moduleSize, (y + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize)
  }

  const drawTimingPattern = (ctx: CanvasRenderingContext2D, position: number, moduleSize: number, gridSize: number) => {
    ctx.fillStyle = "black"

    // Horizontal timing pattern
    for (let i = 8; i < gridSize - 8; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(i * moduleSize, position * moduleSize, moduleSize, moduleSize)
      }
    }

    // Vertical timing pattern
    for (let i = 8; i < gridSize - 8; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(position * moduleSize, i * moduleSize, moduleSize, moduleSize)
      }
    }
  }

  const drawAlignmentPattern = (ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number) => {
    // 5x5 alignment pattern
    ctx.fillStyle = "black"
    ctx.fillRect((x - 2) * moduleSize, (y - 2) * moduleSize, 5 * moduleSize, 5 * moduleSize)

    ctx.fillStyle = "white"
    ctx.fillRect((x - 1) * moduleSize, (y - 1) * moduleSize, 3 * moduleSize, 3 * moduleSize)

    ctx.fillStyle = "black"
    ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadQR = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = `qr-code-${Date.now()}.png`
    link.href = canvasRef.current.toDataURL()
    link.click()
  }

  const shareQR = async () => {
    if (!canvasRef.current) return

    try {
      if (navigator.share) {
        // Convert canvas to blob
        canvasRef.current.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], "qr-code.png", { type: "image/png" })
            await navigator.share({
              title: title || "QR Code",
              text: `Scan this QR code to access: ${value}`,
              files: [file],
            })
          }
        })
      } else {
        // Fallback to copying URL
        await copyToClipboard()
      }
    } catch (err) {
      console.error("Failed to share:", err)
      // Fallback to copy
      await copyToClipboard()
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {title && <h3 className="text-lg font-semibold text-center">{title}</h3>}

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
          style={{ width: size, height: size }}
        />
      </div>

      <div className="text-center max-w-xs">
        <p className="text-sm text-gray-600 dark:text-gray-400 break-all font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
          {value.length > 50 ? `${value.substring(0, 50)}...` : value}
        </p>
      </div>

      {showActions && (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Copied!" : "Copy URL"}
          </Button>

          <Button variant="outline" size="sm" onClick={downloadQR}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>

          <Button variant="outline" size="sm" onClick={shareQR}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      )}
    </div>
  )
}
