"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SkipBackIcon as Backspace, Space } from "lucide-react"

interface VirtualKeyboardProps {
  onInput: (value: string) => void
  currentValue: string
}

export function VirtualKeyboard({ onInput, currentValue }: VirtualKeyboardProps) {
  const [isShift, setIsShift] = useState(false)
  const [isCapsLock, setCapsLock] = useState(false)

  const qwertyRows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  ]

  const shiftMap: Record<string, string> = {
    "1": "!",
    "2": "@",
    "3": "#",
    "4": "$",
    "5": "%",
    "6": "^",
    "7": "&",
    "8": "*",
    "9": "(",
    "0": ")",
    "-": "_",
    "=": "+",
    "[": "{",
    "]": "}",
    ";": ":",
    "'": '"',
    ",": "<",
    ".": ">",
    "/": "?",
  }

  const handleKeyPress = (key: string) => {
    let finalKey = key

    if (isShift || isCapsLock) {
      if (shiftMap[key]) {
        finalKey = shiftMap[key]
      } else if (key.match(/[a-z]/)) {
        finalKey = key.toUpperCase()
      }
    }

    const newValue = currentValue + finalKey
    onInput(newValue)

    // Reset shift after key press (but not caps lock)
    if (isShift && !isCapsLock) {
      setIsShift(false)
    }
  }

  const handleBackspace = () => {
    const newValue = currentValue.slice(0, -1)
    onInput(newValue)
  }

  const handleSpace = () => {
    const newValue = currentValue + " "
    onInput(newValue)
  }

  const handleClear = () => {
    onInput("")
  }

  const handleShift = () => {
    setIsShift(!isShift)
  }

  const handleCapsLock = () => {
    setCapsLock(!isCapsLock)
    setIsShift(false)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Touch-Screen Keyboard</span>
          <div className="flex items-center space-x-2">
            {isCapsLock && <Badge variant="secondary">CAPS</Badge>}
            {isShift && <Badge variant="secondary">SHIFT</Badge>}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Display current input */}
        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded border min-h-[40px] font-mono">
          {currentValue || "Type here..."}
        </div>

        {/* Keyboard rows */}
        <div className="space-y-2">
          {qwertyRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center space-x-1">
              {row.map((key) => (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  className="min-w-[40px] h-10 bg-transparent"
                  onClick={() => handleKeyPress(key)}
                >
                  {isShift || isCapsLock ? shiftMap[key] || (key.match(/[a-z]/) ? key.toUpperCase() : key) : key}
                </Button>
              ))}
            </div>
          ))}

          {/* Special keys row */}
          <div className="flex justify-center space-x-1 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="min-w-[60px] h-10 bg-transparent"
              onClick={handleCapsLock}
              data-active={isCapsLock}
            >
              Caps
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="min-w-[60px] h-10 bg-transparent"
              onClick={handleShift}
              data-active={isShift}
            >
              Shift
            </Button>
            <Button variant="outline" size="sm" className="min-w-[200px] h-10 bg-transparent" onClick={handleSpace}>
              <Space className="h-4 w-4 mr-2" />
              Space
            </Button>
            <Button variant="outline" size="sm" className="min-w-[60px] h-10 bg-transparent" onClick={handleBackspace}>
              <Backspace className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="min-w-[60px] h-10 bg-transparent" onClick={handleClear}>
              Clear
            </Button>
          </div>

          {/* Quick input buttons for common ICT terms */}
          <div className="flex justify-center space-x-1 mt-4">
            <Button variant="ghost" size="sm" onClick={() => onInput("resistor")}>
              resistor
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onInput("capacitor")}>
              capacitor
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onInput("solder")}>
              solder
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onInput("voltage")}>
              voltage
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onInput("circuit")}>
              circuit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onInput("defect")}>
              defect
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
