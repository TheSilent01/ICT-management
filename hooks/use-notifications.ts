"use client"

import { useState, useEffect, useCallback } from "react"
import type { NotificationMessage } from "@/lib/websocket-server"

interface UseNotificationsOptions {
  userId: string
  userRole: string
}

export function useNotifications({ userId, userRole }: UseNotificationsOptions) {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  // Simulate connection for preview environment
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnected(true)
      setConnectionError(null)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const addNotification = useCallback((notification: NotificationMessage) => {
    setNotifications((prev) => {
      // Avoid duplicates
      if (prev.some((n) => n.id === notification.id)) {
        return prev
      }
      return [notification, ...prev].slice(0, 100) // Keep only last 100
    })
  }, [])

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  // Expose method to add notifications for testing
  const simulateNotification = useCallback(
    (notification: NotificationMessage) => {
      addNotification({
        ...notification,
        userId: userId,
        timestamp: new Date().toISOString(),
      })
    },
    [addNotification, userId],
  )

  return {
    notifications,
    unreadCount,
    isConnected,
    connectionError,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
    addNotification,
    simulateNotification,
  }
}
