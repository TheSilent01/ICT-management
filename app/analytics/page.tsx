"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { ParetChart } from "@/components/paret-chart"
import { TrendChart } from "@/components/trend-chart"
import { ComponentReliabilityChart } from "@/components/component-reliability-chart"
import { DefectsByDepartmentChart } from "@/components/defects-by-department-chart"
import { DefectSeverityChart } from "@/components/defect-severity-chart"
import { DefectHeatmapChart } from "@/components/defect-heatmap-chart"
import { ControlChart } from "@/components/control-chart"
import {
  ArrowLeft,
  Download,
  Calendar,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Target,
  Clock,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { subDays, format, isWithinInterval, parseISO } from "date-fns"
import type { DateRange } from "react-day-picker"

interface DefectRecord {
  id: string
  timestamp: string
  operator: string
  defectType: string
  component: string
  partNumber: string
  pin: string
  testStation: string
  boardSerial: string
  comment: string
  suggestion: string
  pinExplanation: string
  severity: "high" | "medium" | "low"
  status: "open" | "in-progress" | "resolved" | "verified"
  testResult: "pass" | "fail" | "warning"
  rootCause: string
  assignedTo: string
  resolvedDate?: string
  department: string
  vendor: string
  resolutionTimeHours?: number
}

interface AnalyticsData {
  totalDefects: number
  resolvedDefects: number
  mtbf: number
  mttr: number
  defectsByCategory: Array<{ category: string; count: number; percentage: number }>
  defectsByComponent: Array<{ component: string; partNumber: string; count: number; vendor: string }>
  defectsByDepartment: Array<{ department: string; count: number; percentage: number }>
  trendData: Array<{ date: string; defects: number; resolved: number; cumulative: number }>
  monthlyTrend: Array<{ month: string; defects: number; resolved: number; efficiency: number }>
  topRootCauses: Array<{ cause: string; count: number; percentage: number; cumulativePercentage: number }>
  vendorReliability: Array<{ vendor: string; totalParts: number; defectRate: number }>
  resolutionTimes: Array<{ category: string; avgHours: number; minHours: number; maxHours: number }>
  severityDistribution: Array<{ severity: string; count: number; percentage: number }>
  componentFailureRates: Array<{ component: string; failureRate: number; totalTested: number; failed: number }>
  heatmapData: Array<{ day: string; hour: number; defects: number }>
  controlChartData: Array<{ sample: number; value: number; ucl: number; lcl: number; centerLine: number }>
}

// Generate comprehensive sample data
const generateSampleDefects = (count: number, dateRange: DateRange): DefectRecord[] => {
  const defects: DefectRecord[] = []
  const operators = ["Ahmed Benali", "Fatima Zahra", "Youssef Alami", "Aicha Bennani", "Omar Tazi"]
  const defectTypes = [
    "Cold Solder",
    "Component Missing",
    "Short Circuit",
    "Value Out of Range",
    "Open Circuit",
    "Programming Failure",
  ]
  const components = ["Resistor", "Capacitor", "IC", "Diode", "Inductor", "MOSFET"]
  const departments = ["Process", "Engineering", "Production", "Maintenance"]
  const vendors = ["Yageo", "Murata", "STMicroelectronics", "Vishay", "TDK", "Infineon"]
  const rootCauses = [
    "Operator Error",
    "Component Failure",
    "Process Issue",
    "Design Flaw",
    "Environmental",
    "Equipment Malfunction",
  ]

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(
      dateRange.from!.getTime() + Math.random() * (dateRange.to!.getTime() - dateRange.from!.getTime()),
    ).toISOString()

    const severity = Math.random() < 0.3 ? "high" : Math.random() < 0.6 ? "medium" : "low"
    const isResolved = Math.random() < 0.75
    const resolutionTimeHours = isResolved ? Math.random() * 48 + 0.5 : undefined

    defects.push({
      id: `DEF-${String(i + 1).padStart(4, "0")}`,
      timestamp,
      operator: operators[Math.floor(Math.random() * operators.length)],
      defectType: defectTypes[Math.floor(Math.random() * defectTypes.length)],
      component: components[Math.floor(Math.random() * components.length)],
      partNumber: `P${Math.floor(Math.random() * 9999)
        .toString()
        .padStart(4, "0")}`,
      pin: `PIN${Math.floor(Math.random() * 64) + 1}`,
      testStation: `ICT-${Math.floor(Math.random() * 8) + 1}`,
      boardSerial: `PCB${Math.floor(Math.random() * 99999)
        .toString()
        .padStart(5, "0")}`,
      comment: "Automated defect detection",
      suggestion: "Review component placement",
      pinExplanation: "Pin connection analysis required",
      severity,
      status: isResolved
        ? Math.random() < 0.8
          ? "resolved"
          : "verified"
        : Math.random() < 0.5
          ? "in-progress"
          : "open",
      testResult: severity === "high" ? "fail" : Math.random() < 0.7 ? "warning" : "pass",
      rootCause: rootCauses[Math.floor(Math.random() * rootCauses.length)],
      assignedTo: operators[Math.floor(Math.random() * operators.length)],
      resolvedDate: isResolved
        ? new Date(new Date(timestamp).getTime() + resolutionTimeHours! * 60 * 60 * 1000).toISOString()
        : undefined,
      department: departments[Math.floor(Math.random() * departments.length)],
      vendor: vendors[Math.floor(Math.random() * vendors.length)],
      resolutionTimeHours,
    })
  }

  return defects.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [timeFilter, setTimeFilter] = useState("30days")
  const [loading, setLoading] = useState(true)
  const [rawDefects, setRawDefects] = useState<DefectRecord[]>([])

  // Generate sample data on component mount
  useEffect(() => {
    const initialRange = { from: subDays(new Date(), 90), to: new Date() }
    const sampleDefects = generateSampleDefects(500, initialRange)
    setRawDefects(sampleDefects)
    setLoading(false)
  }, [])

  // Filter defects based on selected date range
  const filteredDefects = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return rawDefects

    return rawDefects.filter((defect) => {
      const defectDate = parseISO(defect.timestamp)
      return isWithinInterval(defectDate, { start: dateRange.from!, end: dateRange.to! })
    })
  }, [rawDefects, dateRange])

  // Calculate analytics data from filtered defects
  const analyticsData = useMemo((): AnalyticsData => {
    if (filteredDefects.length === 0) {
      return {
        totalDefects: 0,
        resolvedDefects: 0,
        mtbf: 0,
        mttr: 0,
        defectsByCategory: [],
        defectsByComponent: [],
        defectsByDepartment: [],
        trendData: [],
        monthlyTrend: [],
        topRootCauses: [],
        vendorReliability: [],
        resolutionTimes: [],
        severityDistribution: [],
        componentFailureRates: [],
        heatmapData: [],
        controlChartData: [],
      }
    }

    const totalDefects = filteredDefects.length
    const resolvedDefects = filteredDefects.filter((d) => d.status === "resolved" || d.status === "verified").length

    // Calculate MTBF and MTTR
    const resolutionTimes = filteredDefects.filter((d) => d.resolutionTimeHours).map((d) => d.resolutionTimeHours!)
    const mttr = resolutionTimes.length > 0 ? resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length : 0
    const mtbf = totalDefects > 0 ? (24 * 30) / totalDefects : 0 // Assuming 30-day period

    // Defects by category
    const categoryCount = filteredDefects.reduce(
      (acc, defect) => {
        acc[defect.defectType] = (acc[defect.defectType] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const defectsByCategory = Object.entries(categoryCount)
      .map(([category, count]) => ({
        category,
        count,
        percentage: (count / totalDefects) * 100,
      }))
      .sort((a, b) => b.count - a.count)

    // Defects by component
    const componentCount = filteredDefects.reduce(
      (acc, defect) => {
        const key = `${defect.component}-${defect.partNumber}`
        if (!acc[key]) {
          acc[key] = { component: defect.component, partNumber: defect.partNumber, count: 0, vendor: defect.vendor }
        }
        acc[key].count++
        return acc
      },
      {} as Record<string, { component: string; partNumber: string; count: number; vendor: string }>,
    )

    const defectsByComponent = Object.values(componentCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Defects by department
    const departmentCount = filteredDefects.reduce(
      (acc, defect) => {
        acc[defect.department] = (acc[defect.department] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const defectsByDepartment = Object.entries(departmentCount)
      .map(([department, count]) => ({
        department,
        count,
        percentage: (count / totalDefects) * 100,
      }))
      .sort((a, b) => b.count - a.count)

    // Daily trend data
    const dailyCount = filteredDefects.reduce(
      (acc, defect) => {
        const date = format(parseISO(defect.timestamp), "yyyy-MM-dd")
        if (!acc[date]) {
          acc[date] = { defects: 0, resolved: 0 }
        }
        acc[date].defects++
        if (defect.status === "resolved" || defect.status === "verified") {
          acc[date].resolved++
        }
        return acc
      },
      {} as Record<string, { defects: number; resolved: number }>,
    )

    let cumulative = 0
    const trendData = Object.entries(dailyCount)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => {
        cumulative += data.defects
        return {
          date,
          defects: data.defects,
          resolved: data.resolved,
          cumulative,
        }
      })

    // Root cause analysis with Pareto
    const rootCauseCount = filteredDefects.reduce(
      (acc, defect) => {
        acc[defect.rootCause] = (acc[defect.rootCause] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const sortedRootCauses = Object.entries(rootCauseCount).sort(([, a], [, b]) => b - a)

    let cumulativeCount = 0
    const topRootCauses = sortedRootCauses.map(([cause, count]) => {
      cumulativeCount += count
      return {
        cause,
        count,
        percentage: (count / totalDefects) * 100,
        cumulativePercentage: (cumulativeCount / totalDefects) * 100,
      }
    })

    // Severity distribution
    const severityCount = filteredDefects.reduce(
      (acc, defect) => {
        acc[defect.severity] = (acc[defect.severity] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const severityDistribution = Object.entries(severityCount).map(([severity, count]) => ({
      severity: severity.charAt(0).toUpperCase() + severity.slice(1),
      count,
      percentage: (count / totalDefects) * 100,
    }))

    // Generate heatmap data
    const heatmapData = Array.from({ length: 7 }, (_, day) =>
      Array.from({ length: 24 }, (_, hour) => ({
        day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day],
        hour,
        defects: Math.floor(Math.random() * 10),
      })),
    ).flat()

    // Generate control chart data
    const controlChartData = Array.from({ length: 30 }, (_, i) => {
      const value = 5 + Math.random() * 10
      return {
        sample: i + 1,
        value,
        ucl: 15,
        lcl: 2,
        centerLine: 8.5,
      }
    })

    return {
      totalDefects,
      resolvedDefects,
      mtbf: Math.round(mtbf * 10) / 10,
      mttr: Math.round(mttr * 10) / 10,
      defectsByCategory,
      defectsByComponent,
      defectsByDepartment,
      trendData,
      monthlyTrend: [],
      topRootCauses,
      vendorReliability: [],
      resolutionTimes: [],
      severityDistribution,
      componentFailureRates: [],
      heatmapData,
      controlChartData,
    }
  }, [filteredDefects])

  const handleTimeFilterChange = (value: string) => {
    setTimeFilter(value)
    const now = new Date()

    switch (value) {
      case "7days":
        setDateRange({ from: subDays(now, 7), to: now })
        break
      case "30days":
        setDateRange({ from: subDays(now, 30), to: now })
        break
      case "90days":
        setDateRange({ from: subDays(now, 90), to: now })
        break
      case "1year":
        setDateRange({ from: subDays(now, 365), to: now })
        break
    }
  }

  const exportAnalytics = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      dateRange: {
        from: dateRange?.from?.toISOString(),
        to: dateRange?.to?.toISOString(),
      },
      summary: {
        totalDefects: analyticsData.totalDefects,
        resolvedDefects: analyticsData.resolvedDefects,
        resolutionRate: Math.round((analyticsData.resolvedDefects / analyticsData.totalDefects) * 100),
        mtbf: analyticsData.mtbf,
        mttr: analyticsData.mttr,
      },
      defectsByCategory: analyticsData.defectsByCategory,
      defectsByDepartment: analyticsData.defectsByDepartment,
      topRootCauses: analyticsData.topRootCauses,
      trendData: analyticsData.trendData,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ict-analytics-report-${format(new Date(), "yyyy-MM-dd")}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium dark:text-white">Loading Advanced Analytics...</p>
        </div>
      </div>
    )
  }

  const resolutionRate =
    analyticsData.totalDefects > 0 ? Math.round((analyticsData.resolvedDefects / analyticsData.totalDefects) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">Advanced Analytics & Insights</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Real-time defect analysis with accurate time-filtered data and comprehensive root cause analysis
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={exportAnalytics} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Date Range Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Time Range Selection
            </CardTitle>
            <CardDescription>All charts and metrics will update based on your selected time range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <Select value={timeFilter} onValueChange={handleTimeFilterChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>

              {timeFilter === "custom" && <DatePickerWithRange date={dateRange} setDate={setDateRange} />}

              <Badge variant="outline" className="ml-auto">
                {dateRange?.from && dateRange?.to
                  ? `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd, yyyy")}`
                  : "Select date range"}
              </Badge>

              <Badge variant="secondary">{analyticsData.totalDefects} defects in range</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Defects</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalDefects}</div>
              <p className="text-xs text-muted-foreground">In selected period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolutionRate}%</div>
              <p className="text-xs text-muted-foreground">{analyticsData.resolvedDefects} resolved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">MTBF (Hours)</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.mtbf}</div>
              <p className="text-xs text-muted-foreground">Mean Time Between Failures</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">MTTR (Hours)</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.mttr}</div>
              <p className="text-xs text-muted-foreground">Mean Time To Repair</p>
            </CardContent>
          </Card>
        </div>

        {/* Primary Analysis Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Enhanced Daily Trend Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Daily Defect Trends
              </CardTitle>
              <CardDescription>Accurate daily defect occurrence with cumulative tracking</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.trendData.length > 0 ? (
                <TrendChart data={analyticsData.trendData} />
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  No trend data available for selected period
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Root Cause Pareto Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Root Cause Analysis (Pareto)
              </CardTitle>
              <CardDescription>80/20 analysis showing cumulative impact of root causes</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.topRootCauses.length > 0 ? (
                <ParetChart data={analyticsData.topRootCauses} />
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  No root cause data available for selected period
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* New Graph Implementations */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Defect Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Defect Occurrence Heatmap</CardTitle>
              <CardDescription>Time-based pattern analysis showing when defects occur most frequently</CardDescription>
            </CardHeader>
            <CardContent>
              <DefectHeatmapChart data={analyticsData.heatmapData} />
            </CardContent>
          </Card>

          {/* Statistical Process Control Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Statistical Process Control</CardTitle>
              <CardDescription>Control limits and process stability monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <ControlChart data={analyticsData.controlChartData} />
            </CardContent>
          </Card>
        </div>

        {/* Secondary Analysis Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Department Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Defects by Department</CardTitle>
              <CardDescription>Distribution of defects across departments</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.defectsByDepartment.length > 0 ? (
                <DefectsByDepartmentChart data={analyticsData.defectsByDepartment} />
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  No department data available for selected period
                </div>
              )}
            </CardContent>
          </Card>

          {/* Severity Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Defect Severity Distribution</CardTitle>
              <CardDescription>Breakdown of defects by severity level</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.severityDistribution.length > 0 ? (
                <DefectSeverityChart data={analyticsData.severityDistribution} />
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  No severity data available for selected period
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Component Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Component-Level Reliability Analysis</CardTitle>
            <CardDescription>Detailed failure analysis by specific components and part numbers</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.defectsByComponent.length > 0 ? (
              <ComponentReliabilityChart data={analyticsData.defectsByComponent} />
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No component data available for selected period
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
