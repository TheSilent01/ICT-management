"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, AlertTriangle, CheckCircle, Clock, Info, User, Users } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  severity: "low" | "medium" | "high" | "critical"
  type: "defect_created" | "defect_updated" | "system_alert" | "maintenance"
  timestamp: Date
  read: boolean
  defectId?: string
}

interface User {
  id: string
  name: string
  role: "intern" | "car_leader" | "engineer" | "manager"
}

// Demo user - Yassine El Aidous
const demoUser: User = {
  id: "yassine-001",
  name: "Yassine El Aidous",
  role: "intern"
}

// Sample notifications with different severities
const sampleNotifications: Notification[] = [
  {
    id: "notif-001",
    title: "Critical Defect Detected",
    message: "High-priority defect found in Component X-2024. Immediate attention required.",
    severity: "critical",
    type: "defect_created",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    defectId: "def-001"
  },
  {
    id: "notif-002",
    title: "High Priority Issue",
    message: "Defect in production line requires urgent review and resolution.",
    severity: "high",
    type: "defect_created",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    defectId: "def-002"
  },
  {
    id: "notif-003",
    title: "Medium Priority Update",
    message: "Component testing completed with minor issues identified.",
    severity: "medium",
    type: "defect_updated",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    read: true,
    defectId: "def-003"
  },
  {
    id: "notif-004",
    title: "Low Priority Notice",
    message: "Routine maintenance scheduled for next week.",
    severity: "low",
    type: "maintenance",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    read: false
  },
  {
    id: "notif-005",
    title: "System Information",
    message: "Weekly defect report is now available for review.",
    severity: "low",
    type: "system_alert",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true
  }
]

export default function NotificationsPage() {
  const [currentUser, setCurrentUser] = useState<User>(demoUser)
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])

  // Filter notifications based on user role
  useEffect(() => {
    let filtered = notifications

    if (currentUser.role === "car_leader") {
      // Car leaders only see high and critical severity notifications
      filtered = notifications.filter(n => n.severity === "high" || n.severity === "critical")
    }
    // Interns see all notifications (no filtering)

    setFilteredNotifications(filtered)
  }, [notifications, currentUser.role])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive"
      case "high": return "destructive"
      case "medium": return "default"
      case "low": return "secondary"
      default: return "secondary"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <AlertTriangle className="h-4 w-4" />
      case "high": return <AlertTriangle className="h-4 w-4" />
      case "medium": return <Clock className="h-4 w-4" />
      case "low": return <Info className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unreadCount = filteredNotifications.filter(n => !n.read).length

  const switchUserRole = (role: "intern" | "car_leader") => {
    setCurrentUser(prev => ({ ...prev, role }))
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bell className="h-8 w-8" />
              Notification System Demo
            </h1>
            <p className="text-muted-foreground">
              Role-based notification filtering for {currentUser.name}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {currentUser.role === "intern" ? "Intern" : "Car Leader"}
            </Badge>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount} unread</Badge>
            )}
          </div>
        </div>

        {/* Role Switcher Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Demo: Switch User Role
            </CardTitle>
            <CardDescription>
              Switch between roles to see how notification filtering works
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button 
                variant={currentUser.role === "intern" ? "default" : "outline"}
                onClick={() => switchUserRole("intern")}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Intern (See All)
              </Button>
              <Button 
                variant={currentUser.role === "car_leader" ? "default" : "outline"}
                onClick={() => switchUserRole("car_leader")}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Car Leader (High/Critical Only)
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p><strong>Intern Role:</strong> Sees all notifications regardless of severity</p>
              <p><strong>Car Leader Role:</strong> Only sees high and critical severity notifications</p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Actions */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Notifications ({filteredNotifications.length})
          </h2>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No notifications for this role</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`cursor-pointer transition-colors ${
                  !notification.read ? "border-primary/50 bg-primary/5" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {getSeverityIcon(notification.severity)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{notification.title}</h3>
                          <Badge variant={getSeverityColor(notification.severity) as any}>
                            {notification.severity.toUpperCase()}
                          </Badge>
                          {!notification.read && (
                            <Badge variant="secondary">New</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{notification.message}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatTimestamp(notification.timestamp)}</span>
                          <span>•</span>
                          <span className="capitalize">{notification.type.replace('_', ' ')}</span>
                          {notification.defectId && (
                            <>
                              <span>•</span>
                              <span>ID: {notification.defectId}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Current User:</strong> {currentUser.name}</p>
                <p><strong>Role:</strong> {currentUser.role}</p>
                <p><strong>User ID:</strong> {currentUser.id}</p>
              </div>
              <div>
                <p><strong>Total Notifications:</strong> {notifications.length}</p>
                <p><strong>Visible to Role:</strong> {filteredNotifications.length}</p>
                <p><strong>Unread:</strong> {unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
