import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const mockDefects = Array.from({ length: 20 }, (_, i) => ({
    id: `ICT-${String(i + 1).padStart(3, "0")}`,
    timestamp: new Date(2025, 6, Math.floor(Math.random() * 31) + 1).toISOString(), // Random July 2025 dates
    operator: ["Intern Fatima", "Intern Ahmed", "Intern Amina", "Intern Youssef"][Math.floor(Math.random() * 4)],
    joinDate: new Date(2025, 6, Math.floor(Math.random() * 31) + 1).toISOString(), // Random July 2025 join dates
    defectType: ["Cold Solder", "Missing Component"][i % 2],
    status: ["open", "resolved"][i % 2],
    role: "intern"
  }))

  return NextResponse.json({ data: mockDefects })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["defectType", "component", "partNumber", "testStation", "boardSerial"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // In a real application, this would save to a database
    const newDefect = {
      id: `ICT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      operator: body.operator || "System",
      ...body,
    }

    return NextResponse.json({
      success: true,
      data: newDefect,
      message: "Defect created successfully",
    })
  } catch (error) {
    console.error("Error creating defect:", error)
    return NextResponse.json({ success: false, error: "Failed to create defect" }, { status: 500 })
  }
}
