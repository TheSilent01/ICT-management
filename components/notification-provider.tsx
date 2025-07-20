"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { NotificationToastContainer } from "./notification-toast"
import type { NotificationMessage } from "@/lib/websocket-server"

interface NotificationContextType {
  showToast: (notification: NotificationMessage) => void
  hideToast: (id: string) => void
  clearAllToasts: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<NotificationMessage[]>([])

  const showToast = useCallback((notification: NotificationMessage) => {
    setToasts((prev) => {
      // Avoid duplicates
      if (prev.some((t) => t.id === notification.id)) {
        return prev
      }
      return [notification, ...prev].slice(0, 5) // Keep max 5 toasts
    })
  }, [])

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  const handleToastAction = useCallback((notification: NotificationMessage) => {
    if (notification.defectId) {
      window.open(`/ict-dashboard/defect/${notification.defectId}`, "_blank")
    }
  }, [])

  return (
    <NotificationContext.Provider value={{ showToast, hideToast, clearAllToasts }}>
      {children}
      <NotificationToastContainer notifications={toasts} onDismiss={hideToast} onAction={handleToastAction} />
    </NotificationContext.Provider>
  )
}

export function useNotificationToasts() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotificationToasts must be used within a NotificationProvider")
  }
  return context
}

// Legacy export for compatibility
export const useToast = useNotificationToasts
