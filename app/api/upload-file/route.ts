import { type NextRequest, NextResponse } from "next/server"

// Component and pin explanations database
const PIN_EXPLANATIONS: Record<string, Record<string, string>> = {
  Resistor: {
    "Pin 1": "Input side - check for cold solder joint, ensure proper connection",
    "Pin 2": "Output side - verify continuity and resistance value",
    Default: "Check solder joints and component orientation",
  },
  Capacitor: {
    "Pin 1": "Positive lead - inspect for damage, verify polarity marking",
    "Pin 2": "Negative lead - check polarity, ensure proper grounding",
    Default: "Verify polarity and check for bulging or leakage",
  },
  IC: {
    "Pin 1": "Usually VCC or input - check power supply connection",
    "Pin 2": "Data/signal pin - verify signal integrity",
    "Pin 3": "Ground or output - ensure proper grounding",
    "Pin 4": "Control pin - check logic levels",
    Default: "Verify pin configuration and check for bent pins",
  },
  Transistor: {
    "Pin 1": "Base - check biasing circuit and signal input",
    "Pin 2": "Collector - verify load connection and voltage levels",
    "Pin 3": "Emitter - check grounding and current path",
    Default: "Verify transistor type and pin configuration",
  },
  Diode: {
    "Pin 1": "Anode - check forward bias conditions",
    "Pin 2": "Cathode - verify reverse bias protection",
    Default: "Check polarity and forward voltage drop",
  },
  Inductor: {
    "Pin 1": "Input terminal - check for continuity",
    "Pin 2": "Output terminal - verify inductance value",
    Default: "Check for open circuit or short circuit",
  },
}

const SUGGESTIONS: Record<string, string> = {
  Resistor: "Check solder joints, verify resistance value with multimeter, ensure proper wattage rating",
  Capacitor: "Verify polarity, check for bulging or leakage, test capacitance value",
  IC: "Check pin connections, verify power supply, test with known good IC",
  Transistor: "Verify pin configuration, check biasing, test with curve tracer",
  Diode: "Check polarity, test forward/reverse bias, verify voltage drop",
  Inductor: "Test continuity, check for physical damage, verify inductance value",
  Other: "Perform visual inspection, check connections, verify component specifications",
}

const DEFECT_SEVERITY: Record<string, "high" | "medium" | "low"> = {
  "Cold Solder": "high",
  "Open Circuit": "high",
  "Short Circuit": "high",
  "Component Failure": "high",
  "Loose Connection": "medium",
  Oxidation: "medium",
  Misalignment: "medium",
  Scratches: "low",
  Discoloration: "low",
  "Minor Damage": "low",
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const format = formData.get("format") as string

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    let text: string

    // Handle different file formats
    if (format === "csv" || file.name.toLowerCase().endsWith(".csv")) {
      text = await file.text()
    } else if (
      format === "xlsx" ||
      format === "xls" ||
      file.name.toLowerCase().endsWith(".xlsx") ||
      file.name.toLowerCase().endsWith(".xls")
    ) {
      // For Excel files, we'll simulate parsing by converting to CSV format
      // In a real implementation, you'd use a library like 'xlsx' to parse Excel files
      text = await file.text()
      // This is a simplified approach - in production, use proper Excel parsing
    } else {
      return NextResponse.json({ error: "Unsupported file format" }, { status: 400 })
    }

    const lines = text.split("\n").filter((line) => line.trim())

    if (lines.length === 0) {
      return NextResponse.json({ error: "Empty file" }, { status: 400 })
    }

    const problems = []

    // Determine header mapping dynamically (case-insensitive)
    const rawHeader = lines[0]
    const headerColumns = rawHeader.split(/,|;|\t/).map((h) => h.trim().toLowerCase())

    const columnIndex: Record<string, number> = {
      timestamp: headerColumns.findIndex((h) => ["timestamp", "time", "date", "datetime"].includes(h)),
      operator: headerColumns.findIndex((h) => ["operator", "user", "technician"].includes(h)),
      defectType: headerColumns.findIndex((h) => ["defect type", "defect", "issue"].includes(h)),
      component: headerColumns.findIndex((h) => ["component", "part", "device"].includes(h)),
      pin: headerColumns.findIndex((h) => ["pin", "pin number"].includes(h)),
      comment: headerColumns.findIndex((h) => ["comment", "remarks", "notes", "note"].includes(h)),
    }

    // Fallback if header row isn't actually headers
    const headerLooksValid = Object.values(columnIndex).some((idx) => idx !== -1)
    const startIndex = headerLooksValid ? 1 : 0

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      // Parse CSV line (simple parsing - in production, use a proper CSV parser)
      const columns = line.split(/,|;|\t/).map((col) => col.trim().replace(/^\"|\"$/g, ""))

      if (columns.length === 0) continue

      const getCol = (key: keyof typeof columnIndex, fallback = "") => {
        const idx = columnIndex[key]
        if (idx !== -1 && idx < columns.length) return columns[idx]
        return fallback
      }

      const timestamp = getCol("timestamp", new Date().toISOString())
      const operator = getCol("operator", "Unknown")
      const defectType = getCol("defectType", "Unknown")
      const component = getCol("component", "Unknown")
      const pin = getCol("pin", "N/A")
      const comment = getCol("comment", "")

      // Get suggestions and explanations
      const suggestion = SUGGESTIONS[component] || SUGGESTIONS["Other"]
      const pinExplanation =
        PIN_EXPLANATIONS[component]?.[pin] ||
        PIN_EXPLANATIONS[component]?.["Default"] ||
        "No specific information available for this pin"

      const severity = DEFECT_SEVERITY[defectType] || "medium"

      problems.push({
        timestamp,
        operator,
        defectType,
        component,
        pin,
        comment,
        suggestion,
        pinExplanation,
        severity,
      })
    }

    return NextResponse.json({
      success: true,
      problems,
      totalCount: problems.length,
      fileFormat: format,
    })
  } catch (error) {
    console.error("Error processing file:", error)
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 })
  }
}
