"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ExportModal, type ExportFormat } from "@/components/export-modal"
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  ArrowUpDown,
  Search,
  Download,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  RefreshCw,
  Upload,
  BarChart3,
  TrendingUp,
  Clock,
  Wrench,
  Moon,
  Sun,
  CalendarIcon,
  Keyboard,
  Filter,
  FileText,
  Settings,
  Users,
  BarChart,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
} from "lucide-react"
import Link from "next/link"
import { ICTDefectDetail } from "@/components/ict-defect-detail"
import { DefectTrendChart } from "@/components/defect-trend-chart"
import { DefectsByDepartmentChart } from "@/components/defects-by-department-chart"
import { StatusPieChart } from "@/components/status-pie-chart"
import { ParetoCauseChart } from "@/components/pareto-cause-chart"
import { DefectCalendar } from "@/components/defect-calendar"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { VirtualKeyboard } from "@/components/virtual-keyboard"
import { FileUploadDialog } from "@/components/file-upload-dialog"
import { AddDefectModal } from "@/components/add-defect-modal"
import { EditDefectModal } from "@/components/edit-defect-modal"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { ICTDefect } from "@/types/defect";
import { Button } from "@/components/ui/button"

type DateRange = { from?: Date; to?: Date }


export default function ICTDashboardPage() {
  const [defects, setDefects] = useState<ICTDefect[]>([])
  const [filteredDefects, setFilteredDefects] = useState<ICTDefect[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedDefect, setSelectedDefect] = useState<ICTDefect | null>(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [activeInput, setActiveInput] = useState<string | null>(null)
  const [isAddDefectModalOpen, setAddDefectModalOpen] = useState(false)
  const [editingDefect, setEditingDefect] = useState<ICTDefect | null>(null)
  const [sortKey, setSortKey] = useState<keyof ICTDefect | 'resolvedDate'>("timestamp")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const itemsPerPage = 10

  useEffect(() => {
    loadICTData()
  }, [])

  useEffect(() => {
    // Filter defects based on search, filters, and date range
    let filtered = defects

    if (searchTerm) {
      filtered = filtered.filter((defect) =>
        Object.values(defect).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (severityFilter !== "all") {
      filtered = filtered.filter((defect) => defect.severity === severityFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((defect) => defect.status === statusFilter)
    }

    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter((defect) => {
        const defectDate = new Date(defect.timestamp)
        return defectDate >= dateRange.from! && defectDate <= dateRange.to!
      })
    }

    // Sorting logic
    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredDefects(sorted)
    setCurrentPage(1)
  }, [defects, searchTerm, severityFilter, statusFilter, dateRange, sortKey, sortDirection])

  const loadICTData = () => {
    // Realistic ICT defect data for July 2025 with Yassine, Ayoub, and Yassir
    const sampleICTData: ICTDefect[] = [
      {
        id: "ICT-2025-001",
        timestamp: "2025-07-01 08:30:00",
        operator: "Yassine El Aidous",
        defectType: "Cold Solder Joint",
        component: "Resistor",
        partNumber: "R1234-100K-0603",
        pin: "Pin 1",
        testStation: "ICT-Station-Alpha",
        boardSerial: "YAS-PCB-2025-001",
        comment:
          "Resistance reading 105.2K, expected 100K ±5%. Visible gap in solder joint detected during visual inspection.",
        suggestion: "Rework solder joint with proper temperature profile (245°C). Verify resistance value post-repair.",
        pinExplanation: "Input terminal - Critical for signal integrity. Check for proper wetting and joint formation.",
        severity: "high",
        status: "open",
        testResult: "fail",
        rootCause: "Insufficient solder temperature during reflow",
        assignedTo: "Yassine's Team Alpha",
      },
      {
        id: "ICT-2025-002",
        timestamp: "2025-07-02 10:15:00",
        operator: "Ayoub El Karkouri",
        defectType: "Component Missing",
        component: "Capacitor",
        partNumber: "C5678-10uF-0805",
        pin: "Pin 2",
        testStation: "ICT-Station-Beta",
        boardSerial: "AYB-PCB-2025-002",
        comment: "Capacitor C15 not populated. Open circuit detected. SMT placement issue identified.",
        suggestion: "Install missing 10uF capacitor. Verify polarity marking and placement orientation.",
        pinExplanation: "Power decoupling - Essential for stable operation. Check negative terminal grounding.",
        severity: "high",
        status: "in-progress",
        testResult: "fail",
        rootCause: "SMT placement machine programming error",
        assignedTo: "Ayoub's Assembly Team",
      },
      {
        id: "ICT-2025-003",
        timestamp: "2025-07-03 14:20:00",
        operator: "Yassir Benali",
        defectType: "Voltage Out of Range",
        component: "Voltage Regulator",
        partNumber: "U9012-LM2596-ADJ",
        pin: "Pin 14",
        testStation: "ICT-Station-Gamma",
        boardSerial: "YSR-PCB-2025-003",
        comment: "Output voltage 3.15V, expected 3.3V ±3%. Feedback resistor values verified as correct.",
        suggestion: "Check input voltage stability and load conditions. Verify thermal performance.",
        pinExplanation: "VCC output - Main power rail. Critical for downstream circuit operation.",
        severity: "medium",
        status: "resolved",
        testResult: "warning",
        rootCause: "Input voltage fluctuation from power supply",
        assignedTo: "Yassir's Power Team",
        resolvedDate: "2025-07-04 09:30:00",
      },
      {
        id: "ICT-2025-004",
        timestamp: "2025-07-05 11:45:00",
        operator: "Yassine El Aidous",
        defectType: "Short Circuit",
        component: "Schottky Diode",
        partNumber: "D3456-BAT54C",
        pin: "Pin 1",
        testStation: "ICT-Station-Alpha",
        boardSerial: "YAS-PCB-2025-004",
        comment:
          "Forward and reverse voltage readings identical (0.1V). Solder bridge suspected between anode and cathode.",
        suggestion: "Remove solder bridge using desoldering braid. Replace diode if damaged.",
        pinExplanation: "Anode terminal - Check for proper forward bias characteristics and thermal stress.",
        severity: "high",
        status: "verified",
        testResult: "fail",
        rootCause: "Excessive solder paste application",
        assignedTo: "Yassine's QA Team",
        resolvedDate: "2025-07-06 16:20:00",
      },
      {
        id: "ICT-2025-005",
        timestamp: "2025-07-08 09:10:00",
        operator: "Ayoub El Karkouri",
        defectType: "Tolerance Warning",
        component: "Inductor",
        partNumber: "L7890-100uH-1210",
        pin: "Pin 2",
        testStation: "ICT-Station-Beta",
        boardSerial: "AYB-PCB-2025-005",
        comment: "Inductance reading 95.8uH, within ±20% tolerance but at lower limit. Trend monitoring required.",
        suggestion: "Continue monitoring. Consider supplier quality review if trend continues.",
        pinExplanation: "Output terminal - Part of switching regulator circuit. Verify core saturation limits.",
        severity: "low",
        status: "resolved",
        testResult: "warning",
        rootCause: "Component aging and temperature coefficient",
        assignedTo: "Ayoub's Quality Team",
        resolvedDate: "2025-07-09 13:45:00",
      },
      {
        id: "ICT-2025-006",
        timestamp: "2025-07-10 15:30:00",
        operator: "Yassir Benali",
        defectType: "Open Circuit",
        component: "Microcontroller",
        partNumber: "U1001-STM32F407",
        pin: "Pin 32",
        testStation: "ICT-Station-Gamma",
        boardSerial: "YSR-PCB-2025-006",
        comment: "GPIO pin showing high impedance. Expected low resistance to ground through internal pull-down.",
        suggestion: "Check for lifted pin or internal MCU damage. May require component replacement.",
        pinExplanation: "GPIO with internal pull-down - Critical for system initialization sequence.",
        severity: "high",
        status: "open",
        testResult: "fail",
        rootCause: "Thermal stress during reflow causing pin lift",
        assignedTo: "Yassir's Debug Team",
      },
      {
        id: "ICT-2025-007",
        timestamp: "2025-07-12 12:15:00",
        operator: "Yassine El Aidous",
        defectType: "Impedance Mismatch",
        component: "Crystal Oscillator",
        partNumber: "Y1-16MHz-HC49",
        pin: "Pin 1",
        testStation: "ICT-Station-Alpha",
        boardSerial: "YAS-PCB-2025-007",
        comment: "Crystal impedance 18Ω, expected 15Ω ±10%. Load capacitance values verified as correct.",
        suggestion: "Replace crystal oscillator. Verify PCB trace impedance and loading capacitors.",
        pinExplanation: "Oscillator input - Critical for system clock generation. Check for proper grounding.",
        severity: "medium",
        status: "in-progress",
        testResult: "warning",
        rootCause: "Crystal manufacturing tolerance variation",
        assignedTo: "Yassine's Timing Team",
      },
      {
        id: "ICT-2025-008",
        timestamp: "2025-07-15 16:45:00",
        operator: "Ayoub El Karkouri",
        defectType: "ESD Damage",
        component: "Op-Amp",
        partNumber: "U2003-LM358",
        pin: "Pin 3",
        testStation: "ICT-Station-Beta",
        boardSerial: "AYB-PCB-2025-008",
        comment: "Input offset voltage 15mV, specification maximum 7mV. ESD damage suspected on input stage.",
        suggestion: "Replace op-amp. Review ESD handling procedures in assembly area.",
        pinExplanation: "Non-inverting input - Sensitive to ESD. Check input protection circuitry.",
        severity: "medium",
        status: "resolved",
        testResult: "fail",
        rootCause: "Inadequate ESD protection during handling",
        assignedTo: "Ayoub's Analog Team",
        resolvedDate: "2025-07-16 10:20:00",
      },
    ]

    setDefects(sampleICTData)
    setLoading(false)
    toast({
      title: "Data Loaded Successfully",
      description: `${sampleICTData.length} ICT defects loaded for July 2025`,
    })
  }

  const handleKeyboardInput = (value: string) => {
    if (activeInput === "search") {
      setSearchTerm(value)
    }
  }

  const handleInputFocus = (inputName: string) => {
    setActiveInput(inputName)
    if (showKeyboard) {
      // Keep keyboard open and switch context
    }
  }

  const handleFileUpload = (file: File) => {
    // Simulate file processing
    toast({
      title: "File Upload Started",
      description: `Processing ${file.name}...`,
    })

    setTimeout(() => {
      toast({
        title: "File Processed Successfully",
        description: "ICT log data has been imported and analyzed.",
      })
      setShowUploadDialog(false)
    }, 2000)
  }

  const handleEditDefect = (defect: ICTDefect) => {
    setEditingDefect(defect)
  }

  const handleUpdateDefect = (updatedDefect: ICTDefect) => {
    setDefects(defects.map(d => d.id === updatedDefect.id ? updatedDefect : d))
    setEditingDefect(null)
    toast({
      title: "Defect Updated",
      description: `Defect ${updatedDefect.id} has been successfully updated.`,
    })
  }

  const handleDeleteDefect = (defectId: string) => {
    setDefects(defects.filter((d) => d.id !== defectId))
    toast({
      title: "Defect Deleted",
      description: `Defect ${defectId} has been removed from the system.`,
      variant: "destructive",
    })
  }

  const handleAddDefect = (defect: Omit<ICTDefect, 'id' | 'timestamp'>) => {
    const newDefect: ICTDefect = {
      id: `ICT-2025-${String(defects.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString(),
      ...defect,
    }
    setDefects([newDefect, ...defects])
    setAddDefectModalOpen(false)
    toast({
      title: "Defect Added",
      description: `New defect ${newDefect.id} has been successfully added.`,
    })
  }

  const handleSort = (key: keyof ICTDefect) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "All modifications have been saved successfully.",
    })
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Info className="h-4 w-4 text-yellow-500" />
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "resolved":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "verified":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  // Build rows for export – convert undefined/null to empty strings and escape commas/newlines
  const buildRows = () =>
    filteredDefects.map(d => [
      d.id,
      new Date(d.timestamp).toLocaleString(),
      d.operator,
      d.defectType,
      d.component,
      d.partNumber,
      d.pin,
      d.testStation,
      d.boardSerial,
      d.status,
      d.severity,
      d.rootCause,
      d.assignedTo,
      d.comment ?? '',
      d.suggestion ?? '',
    ]) as (string | number)[][]

  const exportHeaders = [
    "ID","Timestamp","Operator","Defect Type","Component","Part Number","Pin","Test Station","Board Serial","Status","Severity","Root Cause","Assigned To","Comment","Suggestion",
  ]

  const handleExport = (format: ExportFormat) => {
    const rows = buildRows();

    if (format === 'csv') {
      const csv = [exportHeaders, ...rows]
        .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
        .join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'defects.csv';
      link.click();
      URL.revokeObjectURL(link.href);
    } else if (format === 'xlsx') {
      const ws = XLSX.utils.aoa_to_sheet([exportHeaders, ...rows]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Defects');
      XLSX.writeFile(wb, 'defects.xlsx');
    } else if (format === 'pdf') {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
      doc.setFontSize(14);
      doc.text('ICT Defect Report', 40, 40);
      autoTable(doc, {
        head: [exportHeaders],
        body: rows,
        startY: 60,
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [41, 128, 185] },
      });
      doc.save('defects.pdf');
    }

    setShowExportModal(false);
    toast({
      title: 'Export Successful',
      description: `Defect data has been exported to ${format.toUpperCase()}.`,
    });
  };

  const exportDefectData = () => {
    setShowExportModal(true);
  };

  // Calculate metrics
  const totalProblems = defects.length
  const resolvedProblems = defects.filter((d) => d.status === "resolved" || d.status === "verified").length
  const resolutionRate = totalProblems > 0 ? Math.round((resolvedProblems / totalProblems) * 100) : 0
  const openProblems = defects.filter((d) => d.status === "open").length
  // Process department data for the chart
  const departmentData = defects.reduce((acc, defect) => {
    // Extract department from assignedTo field or use 'Unknown' as fallback
    const departmentMatch = defect.assignedTo?.match(/([A-Za-z]+)'s/);
    const department = departmentMatch ? departmentMatch[1] : 'Unknown';
    
    if (!acc[department]) {
      acc[department] = { department, count: 0 };
    }
    acc[department].count++;
    return acc;
  }, {} as Record<string, { department: string; count: number }>);

  // Convert to array and calculate percentages
  const departmentChartData = Object.values(departmentData)
    .map(d => ({
      ...d,
      percentage: defects.length > 0 ? (d.count / defects.length) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending

  const topComponent = defects.length > 0 ? Object.entries(defects.reduce((acc, defect) => {
    acc[defect.component] = (acc[defect.component] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)).sort(([, a], [, b]) => b - a)[0] : null;

  // Calculate MTTR based on resolved defects
  const resolvedDefectsWithTime = defects.filter((d) => d.resolvedDate && d.status === "resolved")
  const avgResolutionTime =
    resolvedDefectsWithTime.length > 0
      ? resolvedDefectsWithTime.reduce((acc, defect) => {
          const created = new Date(defect.timestamp).getTime()
          const resolved = new Date(defect.resolvedDate!).getTime()
          return acc + (resolved - created)
        }, 0) /
        resolvedDefectsWithTime.length /
        (1000 * 60 * 60) // Convert to hours
      : 0
  const mttr = `${avgResolutionTime.toFixed(1)} hours`

  // Pagination
  const totalPages = Math.ceil(filteredDefects.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedDefects = filteredDefects.slice(startIndex, startIndex + itemsPerPage)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium dark:text-white">Loading Yassine's ICT Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <AddDefectModal 
        isOpen={isAddDefectModalOpen} 
        onClose={() => setAddDefectModalOpen(false)} 
        onAddDefect={handleAddDefect} 
      />
      <EditDefectModal
        defect={editingDefect}
        isOpen={!!editingDefect}
        onClose={() => setEditingDefect(null)}
        onUpdateDefect={handleUpdateDefect}
      />
      <ExportModal 
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <Link
                  href="/"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
                <Button variant="outline" size="sm" onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">ICT Defect Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Professional In-Circuit Test Analysis & Defect Management System
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Created by <span className="font-semibold text-blue-600">Yassine El Aidous</span> &{" "}
                <span className="font-semibold text-blue-600">Ayoub El Karkouri</span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => setShowUploadDialog(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload ICT Log
              </Button>
              <Button onClick={exportDefectData} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
                            <Button onClick={() => setAddDefectModalOpen(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Defect
              </Button>
              <Button onClick={handleSaveChanges}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-6 flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow">
            <Button variant="default" size="sm">
              <BarChart className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowUploadDialog(true)}>
              <FileText className="h-4 w-4 mr-2" />
              Upload Log File
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/analytics">
                <Wrench className="h-4 w-4 mr-2" />
                Component Analysis
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <BarChart3 className="h-4 w-4 mr-2" />
                Statistics
              </Link>
            </Button>
            <Button variant="ghost" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Team Management
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>

          {/* Summary Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Problems</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{totalProblems}</div>
                <p className="text-xs text-muted-foreground">Reported defects</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Problems Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{resolvedProblems}</div>
                <p className="text-xs text-muted-foreground">Fixed & verified</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{resolutionRate}%</div>
                <Progress value={resolutionRate} className="h-2 mt-2 bg-gray-200" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">MTTR</CardTitle>
                <Clock className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{mttr}</div>
                <p className="text-xs text-muted-foreground">Mean time to repair</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Affected</CardTitle>
                <Wrench className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-orange-600">{topComponent?.[0] || "N/A"}</div>
                <p className="text-xs text-muted-foreground">{topComponent?.[1] || 0} defects</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-yellow-500 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
                <Info className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{openProblems}</div>
                <p className="text-xs text-muted-foreground">Awaiting resolution</p>
              </CardContent>
            </Card>
          </div>

          {/* Calendar and Charts Section */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Yassine's Calendar System
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setShowCalendar(!showCalendar)}>
                    {showCalendar ? "Hide" : "Show"}
                  </Button>
                </CardTitle>
                <CardDescription>July 2025 Defect Scheduling & Filtering</CardDescription>
              </CardHeader>
              <CardContent>
                {showCalendar && <DefectCalendar defects={defects} />}
                <div className="mt-4">
                  <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Defect Trend Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DefectTrendChart defects={defects} />
              </CardContent>
            </Card>
          </div>

          {/* Additional Charts */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Defects by Department
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DefectsByDepartmentChart data={departmentChartData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <StatusPieChart defects={defects} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Root Cause Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ParetoCauseChart defects={defects} />
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Filters with Virtual Keyboard */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Advanced Filter & Search System
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowKeyboard(!showKeyboard)}
                  className="flex items-center space-x-2"
                >
                  <Keyboard className="h-4 w-4" />
                  <span>Virtual Keyboard</span>
                </Button>
              </CardTitle>
              <CardDescription>Yassine's Enhanced Search with Touch-Screen Support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search defects, part numbers, board serials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => handleInputFocus("search")}
                    className="w-80"
                  />
                </div>

                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSeverityFilter("all")
                    setStatusFilter("all")
                    setDateRange(undefined)
                    toast({
                      title: "Filters Cleared",
                      description: "All filters have been reset to default values.",
                    })
                  }}
                >
                  Clear Filters
                </Button>

                <Badge variant="outline" className="ml-auto">
                  {filteredDefects.length} of {defects.length} records
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Virtual Keyboard */}
          {showKeyboard && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Yassine's Virtual Keyboard</span>
                  <Button variant="ghost" size="sm" onClick={() => setShowKeyboard(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VirtualKeyboard onInput={handleKeyboardInput} currentValue={searchTerm} />
              </CardContent>
            </Card>
          )}

          {/* Defects Table */}
          <Card>
            <CardHeader>
              <CardTitle>ICT Defect Analysis Table</CardTitle>
              <CardDescription>Detailed view of all reported problems and their resolution status</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead onClick={() => handleSort('id')} className="cursor-pointer">ID {sortKey === 'id' && (sortDirection === 'asc' ? '▲' : '▼')}</TableHead>
                      <TableHead onClick={() => handleSort('timestamp')} className="cursor-pointer">Date {sortKey === 'timestamp' && (sortDirection === 'asc' ? '▲' : '▼')}</TableHead>
                      <TableHead onClick={() => handleSort('operator')} className="cursor-pointer">Operator {sortKey === 'operator' && (sortDirection === 'asc' ? '▲' : '▼')}</TableHead>
                      <TableHead onClick={() => handleSort('component')} className="cursor-pointer">Component {sortKey === 'component' && (sortDirection === 'asc' ? '▲' : '▼')}</TableHead>
                      <TableHead onClick={() => handleSort('partNumber')} className="cursor-pointer">Part Number {sortKey === 'partNumber' && (sortDirection === 'asc' ? '▲' : '▼')}</TableHead>
                      <TableHead onClick={() => handleSort('status')} className="cursor-pointer">Status {sortKey === 'status' && (sortDirection === 'asc' ? '▲' : '▼')}</TableHead>
                      <TableHead onClick={() => handleSort('severity')} className="cursor-pointer">Severity {sortKey === 'severity' && (sortDirection === 'asc' ? '▲' : '▼')}</TableHead>
                      <TableHead onClick={() => handleSort('rootCause')} className="cursor-pointer">Root Cause {sortKey === 'rootCause' && (sortDirection === 'asc' ? '▲' : '▼')}</TableHead>
                      <TableHead onClick={() => handleSort('assignedTo')} className="cursor-pointer">Assigned To {sortKey === 'assignedTo' && (sortDirection === 'asc' ? '▲' : '▼')}</TableHead>
                      <TableHead onClick={() => handleSort('resolvedDate')} className="cursor-pointer">Resolved Date {sortKey === 'resolvedDate' && (sortDirection === 'asc' ? '▲' : '▼')}</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedDefects.map((defect) => (
                      <TableRow key={defect.id}>
                        <TableCell className="font-mono font-semibold">{defect.id}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {new Date(defect.timestamp).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium text-blue-600 dark:text-blue-400">
                          {defect.operator}
                        </TableCell>
                        <TableCell className="font-medium">{defect.component}</TableCell>
                        <TableCell className="font-mono font-medium text-blue-600 dark:text-blue-400">
                          {defect.partNumber}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(defect.status)}>{defect.status.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getSeverityIcon(defect.severity)}
                            <Badge className={getSeverityColor(defect.severity)}>{defect.severity.toUpperCase()}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{defect.rootCause}</TableCell>
                        <TableCell className="text-sm font-medium text-green-600 dark:text-green-400">
                          {defect.assignedTo}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {defect.resolvedDate ? new Date(defect.resolvedDate).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedDefect(defect)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditDefect(defect)}
                              title="Edit Defect"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteDefect(defect.id)}
                              title="Delete Defect"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDefects.length)} of{" "}
                    {filteredDefects.length} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {filteredDefects.length === 0 && (
            <Alert className="mt-4">
              <AlertDescription>
                No defects found matching your search criteria. Try adjusting your filters or date range.
              </AlertDescription>
            </Alert>
          )}

          {/* Modals and Dialogs */}
          {selectedDefect && <ICTDefectDetail defect={selectedDefect} onClose={() => setSelectedDefect(null)} />}
          {showUploadDialog && (
            <FileUploadDialog onUpload={handleFileUpload} onClose={() => setShowUploadDialog(false)} />
          )}
        </div>
      </div>
    </div>
  )
}


