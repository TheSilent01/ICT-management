export interface NotificationMessage {
  id: string
  type: string
  title: string
  message: string
  severity: "low" | "medium" | "high" | "critical"
  timestamp: string
  userId?: string
  defectId?: string
  read: boolean
  metadata?: Record<string, any>
}

export interface DefectData {
  id: string
  partNumber: string
  boardSerial: string
  severity: string
  component: string
  defectType: string
  testStation: string
}

// Mock WebSocket server for preview environment
export class NotificationServer {
  private subscribers: Map<string, any> = new Map()
  private notifications: NotificationMessage[] = []

  subscribe(userId: string, callback: (notification: NotificationMessage) => void) {
    this.subscribers.set(userId, callback)
  }

  unsubscribe(userId: string) {
    this.subscribers.delete(userId)
  }

  broadcastDefectUpdate(defectData: DefectData, type: string) {
    const notification: NotificationMessage = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title: this.getNotificationTitle(type, defectData),
      message: this.getNotificationMessage(type, defectData),
      severity: defectData.severity as any,
      timestamp: new Date().toISOString(),
      defectId: defectData.id,
      read: false,
      metadata: { defectData },
    }

    this.notifications.push(notification)

    // Broadcast to all subscribers
    this.subscribers.forEach((callback) => {
      callback(notification)
    })
  }

  private getNotificationTitle(type: string, defectData: DefectData): string {
    switch (type) {
      case "defect_created":
        return `New ${defectData.severity} Defect Detected`
      case "defect_resolved":
        return "Defect Successfully Resolved"
      case "defect_assigned":
        return "New Defect Assignment"
      case "status_changed":
        return "Defect Status Updated"
      default:
        return "Defect Update"
    }
  }

  private getNotificationMessage(type: string, defectData: DefectData): string {
    switch (type) {
      case "defect_created":
        return `${defectData.defectType} detected on ${defectData.component} (${defectData.partNumber})`
      case "defect_resolved":
        return `Defect ${defectData.id} has been resolved and verified`
      case "defect_assigned":
        return `You have been assigned to investigate defect ${defectData.id}`
      case "status_changed":
        return `Defect ${defectData.id} status has been updated`
      default:
        return `Defect ${defectData.id} has been updated`
    }
  }

  getNotifications(userId?: string): NotificationMessage[] {
    return this.notifications.filter((n) => !userId || n.userId === userId)
  }
}

export const notificationServer = new NotificationServer()
