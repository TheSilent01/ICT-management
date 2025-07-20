import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Workflow,
  Settings,
  Bell,
  Zap,
} from "lucide-react"

export default function HomePage() {
  const stats = [
    { label: "Total Defects", value: "1,247", change: "+12%", trend: "up" },
    { label: "Open Issues", value: "89", change: "-5%", trend: "down" },
    { label: "Resolved Today", value: "23", change: "+18%", trend: "up" },
    { label: "Critical Issues", value: "3", change: "0%", trend: "neutral" },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "defect_created",
      title: "New Critical Defect",
      description: "Cold solder joint detected on R1234-100K-0603",
      time: "2 minutes ago",
      severity: "critical",
    },
    {
      id: 2,
      type: "defect_resolved",
      title: "Defect Resolved",
      description: "Short circuit issue on C567-10uF-0805 fixed",
      time: "15 minutes ago",
      severity: "medium",
    },
    {
      id: 3,
      type: "defect_assigned",
      title: "Assignment Update",
      description: "Defect ICT-001 assigned to Fatima El Amin",
      time: "1 hour ago",
      severity: "low",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-lg">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">ICT Defect Tracking System</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Advanced quality management and real-time defect tracking for manufacturing excellence
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/upload" className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload Data</span>
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/ict-dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>View Dashboard</span>
            </Link>
          </Button>

        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <div
                className={`text-xs px-2 py-1 rounded ${
                  stat.trend === "up"
                    ? "bg-green-100 text-green-800"
                    : stat.trend === "down"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {stat.change}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Common tasks and workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
              <Link href="/upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload CSV Data
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
              <Link href="/ict-dashboard">
                <BarChart3 className="h-4 w-4 mr-2" />
                ICT Dashboard
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
              <Link href="/analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
              <Link href="/workflow">
                <Workflow className="h-4 w-4 mr-2" />
                Workflow Management
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
              <Link href="/user-management">
                <Users className="h-4 w-4 mr-2" />
                User Management
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest defect updates and system notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <div className="flex-shrink-0 mt-1">
                    {activity.type === "defect_created" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    {activity.type === "defect_resolved" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {activity.type === "defect_assigned" && <Clock className="h-4 w-4 text-blue-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.title}</p>
                      <Badge
                        variant="secondary"
                        className={
                          activity.severity === "critical"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : activity.severity === "high"
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                              : activity.severity === "medium"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }
                      >
                        {activity.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>

          </CardContent>
        </Card>
      </div>


    </div>
  )
}
