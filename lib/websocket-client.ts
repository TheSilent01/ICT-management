"use client"

import type { NotificationMessage } from "./websocket-server"

export interface WebSocketClientOptions {
  url: string
  userId: string
  userRole: string
  token?: string
  onNotification?: (notification: NotificationMessage) => void
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Event) => void
}

export class WebSocketClient {
  private options: WebSocketClientOptions
  private isConnected = false
  private mockConnected = true // Mock connection for preview
  private subscribers: ((notification: NotificationMessage) => void)[] = []

  constructor(options: WebSocketClientOptions) {
    this.options = options
    this.connect()
  }

  private connect() {
    // Simulate connection in preview environment
    setTimeout(() => {
      this.isConnected = true
      this.mockConnected = true
      console.log("Mock WebSocket connected")
      this.options.onConnect?.()

      // Subscribe to default notifications
      this.subscribe(["defect_updates", "assignments", "status_changes"])
    }, 1000)
  }

  private handleMessage(notification: NotificationMessage) {
    this.options.onNotification?.(notification)
  }

  public send(message: any) {
    if (this.mockConnected) {
      console.log("Mock WebSocket message sent:", message)

      // Handle authentication
      if (message.type === "authenticate") {
        setTimeout(() => {
          console.log("Mock WebSocket authenticated")
        }, 100)
      }
    } else {
      console.warn("Mock WebSocket not connected, message not sent:", message)
    }
  }

  public subscribe(subscriptions: string[]) {
    console.log("Mock WebSocket subscribed to:", subscriptions)
  }

  public unsubscribe(subscriptions: string[]) {
    console.log("Mock WebSocket unsubscribed from:", subscriptions)
  }

  public markAsRead(notificationId: string) {
    console.log("Mock WebSocket marked as read:", notificationId)
  }

  public disconnect() {
    this.isConnected = false
    this.mockConnected = false
    console.log("Mock WebSocket disconnected")
  }

  public isConnectedToServer(): boolean {
    return this.mockConnected
  }

  // Method to simulate receiving notifications
  public simulateNotification(notification: NotificationMessage) {
    this.handleMessage(notification)
  }
}
