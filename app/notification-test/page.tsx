"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useNotifications } from "@/hooks/use-notifications"
import { useNotificationToasts } from "@/components/notification-provider"
import { Bell, Send, Zap, AlertTriangle, CheckCircle, Clock, Info, WifiOff, Wifi } from "lucide-react"
import type { NotificationMessage } from "@/lib/websocket-server"

export default function NotificationTestPage() {
  const [formData, setFormData] = useState({
    type: "defect_created" as const,
    title: "Test Notification",
    message: "This is a test notification message",
    severity: "medium" as const,
    defectId: "def-001",
  })

  // Mock user data
  const currentUser = {
    id: "user-123",
    role: "engineer" as const,
  }

  const { notifications, unreadCount, isConnected, connectionError, simulateNotification } = useNotifications({
    userId: currentUser.id,
    userRole: currentUser.role,
  })

  const { showToast } = useNotificationToasts()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const createTestNotification = async () => {
    try {
      const notification: NotificationMessage = {
        id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: formData.type,
        title: formData.title,
        message: formData.message,
        severity: formData.severity,
        timestamp: new Date().toISOString(),
        userId: currentUser.id,
        defectId: formData.defectId || undefined,
        read: false,
      }

      // Show as toast
      showToast(notification)

      // Add to notification center
      simulateNotification(notification)

      // Also send to API for persistence
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: currentUser.id,
        }),
      })
    } catch (error) {
      console.error("Error creating test notification:", error)
    }
  }

  const quickTests = [
    {
      name: "Critical Defect",
      data: {
        type: "defect_created" as const,
        title: "Critical PCB Failure",
        message: "Critical defect detected on PCB-001. Immediate attention required.",
        severity: "critical" as const,
        defectId: "def-critical-001",
      },
    },
    {
      name: "Defect Resolved",
      data: {
        type: "defect_resolved" as const,
        title: "Defect Resolution",
        message: "Defect DEF-001 has been successfully resolved and verified.",
        severity: "low" as const,
        defectId: "def-001",
      },
    },
    {
      name: "Assignment",
      data: {
        type: "defect_assigned" as const,
        title: "New Assignment",
        message: "You have been assigned to investigate defect DEF-002.",
        severity: "medium" as const,
        defectId: "def-002",
      },
    },
    {
      name: "Status Change",
      data: {
        type: "status_changed" as const,
        title: "Status Update",
        message: "Defect DEF-003 status changed from 'Open' to 'In Progress'.",
        severity: "low" as const,
        defectId: "def-003",
      },
    },
  ]

  const runQuickTest = (testData: any) => {
    const notification: NotificationMessage = {
      id: `quick-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...testData,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      read: false,
    }

    showToast(notification)
    simulateNotification(notification)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Notification Testing Center</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test the real-time notification system with custom messages and scenarios
          </p>
        </div>

        {/* Connection Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {isConnected ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
              <span>Connection Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge variant={isConnected ? "default" : "destructive"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {connectionError || (isConnected ? "Notification system active" : "Attempting to connect...")}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="font-medium">{notifications.length}</span> total notifications
                </div>
                <div className="text-sm">
                  <span className="font-medium">{unreadCount}</span> unread
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Custom Notification Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5" />
                <span>Create Custom Notification</span>
              </CardTitle>
              <CardDescription>Design and send a custom notification message</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="type">Notification Type</Label>
                <Select value={formData.type} onValueChange={(value: any) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="defect_created">Defect Created</SelectItem>
                    <SelectItem value="defect_updated">Defect Updated</SelectItem>
                    <SelectItem value="defect_resolved">Defect Resolved</SelectItem>
                    <SelectItem value="defect_assigned">Defect Assigned</SelectItem>
                    <SelectItem value="status_changed">Status Changed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="severity">Severity</Label>
                <Select value={formData.severity} onValueChange={(value: any) => handleInputChange("severity", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Notification title"
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Notification message content"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="defectId">Defect ID (Optional)</Label>
                <Input
                  id="defectId"
                  value={formData.defectId}
                  onChange={(e) => handleInputChange("defectId", e.target.value)}
                  placeholder="def-001"
                />
              </div>

              <Button onClick={createTestNotification} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Test Notification
              </Button>
            </CardContent>
          </Card>

          {/* Quick Test Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Quick Test Scenarios</span>
              </CardTitle>
              <CardDescription>Pre-configured notification scenarios for quick testing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickTests.map((test, index) => (
                <div key={index}>
                  <Button variant="outline" onClick={() => runQuickTest(test.data)} className="w-full justify-start">
                    <div className="flex items-center space-x-3">
                      {test.data.type === "defect_created" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      {test.data.type === "defect_resolved" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {test.data.type === "defect_assigned" && <Clock className="h-4 w-4 text-blue-500" />}
                      {test.data.type === "status_changed" && <Info className="h-4 w-4 text-yellow-500" />}
                      <div className="text-left">
                        <div className="font-medium">{test.name}</div>
                        <div className="text-sm text-gray-500">{test.data.title}</div>
                      </div>
                    </div>
                  </Button>
                  {index < quickTests.length - 1 && <Separator className="my-2" />}
                </div>
              ))}

              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  Testing Instructions
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Notifications appear as toast messages in the top-right corner</li>
                  <li>• Check the notification center (bell icon) in the header</li>
                  <li>• Critical notifications are highlighted in red</li>
                  <li>• Click notifications to view defect details</li>
                  <li>• Connection status is shown above</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Notifications */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Last {Math.min(notifications.length, 10)} notifications received</CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
                <p className="text-sm">Send a test notification to see it here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      !notification.read
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          {notification.type === "defect_created" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                          {notification.type === "defect_resolved" && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          {notification.type === "defect_assigned" && <Clock className="h-4 w-4 text-blue-500" />}
                          {notification.type === "status_changed" && <Info className="h-4 w-4 text-yellow-500" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{notification.title}</span>
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
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
