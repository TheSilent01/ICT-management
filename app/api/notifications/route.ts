import { type NextRequest, NextResponse } from "next/server"
import type { NotificationMessage } from "@/lib/websocket-server"

// Mock notification storage - in a real app, use a database
let notifications: NotificationMessage[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const limit = Number.parseInt(searchParams.get("limit") || "50")
  const offset = Number.parseInt(searchParams.get("offset") || "0")

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  // Filter notifications for the user
  const userNotifications = notifications.filter((n) => n.userId === userId).slice(offset, offset + limit)

  return NextResponse.json({
    notifications: userNotifications,
    total: notifications.filter((n) => n.userId === userId).length,
    hasMore: offset + limit < notifications.filter((n) => n.userId === userId).length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, title, message, severity, userId, defectId, metadata } = body

    if (!type || !title || !message || !severity || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: type, title, message, severity, userId" },
        { status: 400 },
      )
    }

    const notification: NotificationMessage = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      severity,
      timestamp: new Date().toISOString(),
      userId,
      defectId,
      read: false,
      metadata,
    }

    // Store notification
    notifications.push(notification)

    // Keep only last 1000 notifications to prevent memory issues
    if (notifications.length > 1000) {
      notifications = notifications.slice(-1000)
    }

    // In a real app, broadcast via WebSocket server here
    console.log("New notification created:", notification)

    return NextResponse.json({ notification }, { status: 201 })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationId, userId, read } = body

    if (!notificationId || !userId) {
      return NextResponse.json({ error: "Missing required fields: notificationId, userId" }, { status: 400 })
    }

    const notificationIndex = notifications.findIndex((n) => n.id === notificationId && n.userId === userId)

    if (notificationIndex === -1) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    notifications[notificationIndex] = {
      ...notifications[notificationIndex],
      read: read !== undefined ? read : true,
    }

    return NextResponse.json({ notification: notifications[notificationIndex] })
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const notificationId = searchParams.get("notificationId")
  const userId = searchParams.get("userId")

  if (!notificationId || !userId) {
    return NextResponse.json({ error: "Missing required parameters: notificationId, userId" }, { status: 400 })
  }

  const initialLength = notifications.length
  notifications = notifications.filter((n) => !(n.id === notificationId && n.userId === userId))

  if (notifications.length === initialLength) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 })
  }

  return NextResponse.json({ message: "Notification deleted successfully" })
}
