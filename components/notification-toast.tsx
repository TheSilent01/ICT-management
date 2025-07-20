"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, AlertTriangle, CheckCircle, Info, Clock } from "lucide-react"
import type { NotificationMessage } from "@/lib/websocket-server"

interface NotificationToastProps {
  notification: NotificationMessage
  onDismiss: (id: string) => void
  onAction?: (notification: NotificationMessage) => void
  autoHide?: boolean
  duration?: number
}

export function NotificationToast({
  notification,
  onDismiss,
  onAction,
  autoHide = true,
  duration = 5000,
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onDismiss(notification.id), 300)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [autoHide, duration, notification.id, onDismiss])

  const getIcon = () => {
    switch (notification.type) {
      case "defect_created":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "defect_resolved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "defect_assigned":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "status_changed":
        return <Info className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  const getSeverityColor = () => {
    switch (notification.severity) {
      case "critical":
        return "border-l-red-500 bg-red-50 dark:bg-red-900/20"
      case "high":
        return "border-l-orange-500 bg-orange-50 dark:bg-orange-900/20"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
      case "low":
        return "border-l-green-500 bg-green-50 dark:bg-green-900/20"
      default:
        return "border-l-gray-500 bg-gray-50 dark:bg-gray-900/20"
    }
  }

  const handleAction = () => {
    if (onAction) {
      onAction(notification)
    }
    setIsVisible(false)
    setTimeout(() => onDismiss(notification.id), 300)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => onDismiss(notification.id), 300)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <Card className={`border-l-4 ${getSeverityColor()} shadow-lg`}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {notification.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          notification.severity === "critical"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : notification.severity === "high"
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                              : notification.severity === "medium"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {notification.severity}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDismiss}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{notification.message}</p>

                  {notification.defectId && (
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={handleAction} className="text-xs bg-transparent">
                        View Details
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface NotificationToastContainerProps {
  notifications: NotificationMessage[]
  onDismiss: (id: string) => void
  onAction?: (notification: NotificationMessage) => void
  maxToasts?: number
}

export function NotificationToastContainer({
  notifications,
  onDismiss,
  onAction,
  maxToasts = 5,
}: NotificationToastContainerProps) {
  const visibleNotifications = notifications.slice(0, maxToasts)

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {visibleNotifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onDismiss={onDismiss}
            onAction={onAction}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
