"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Clock,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  Filter,
  Calendar,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface WorkflowItem {
  id: string
  title: string
  description: string
  defectId: string
  component: string
  partNumber: string
  severity: "high" | "medium" | "low"
  status: "pending" | "in-progress" | "completed" | "on-hold"
  assignedTo: string
  assignedBy: string
  department: string
  createdAt: string
  updatedAt: string
  dueDate: string
  estimatedHours: number
  actualHours?: number
  priority: "urgent" | "high" | "medium" | "low"
  tags: string[]
  comments: Array<{
    id: string
    author: string
    content: string
    timestamp: string
    type: "comment" | "status_change" | "assignment"
  }>
  resolutionSteps: Array<{
    step: number
    description: string
    completed: boolean
    completedBy?: string
    completedAt?: string
  }>
}

const workflowItems: WorkflowItem[] = [
  {
    id: "WF-001",
    title: "Cold Solder Joint on R47 Resistor",
    description:
      "ICT detected insufficient solder connection on resistor R47 (100kΩ) causing intermittent open circuit",
    defectId: "DEF-2024-001",
    component: "Resistor R47",
    partNumber: "RES-100K-0603-1%",
    severity: "high",
    status: "in-progress",
    assignedTo: "Yassir Benali",
    assignedBy: "Ayoub El Karkouri",
    department: "Process",
    createdAt: "2024-01-15T08:30:00Z",
    updatedAt: "2024-01-15T10:15:00Z",
    dueDate: "2024-01-16T17:00:00Z",
    estimatedHours: 2,
    actualHours: 1.5,
    priority: "high",
    tags: ["cold-solder", "resistor", "rework"],
    comments: [
      {
        id: "c1",
        author: "Ayoub El Karkouri",
        content: "ICT station 3 flagged this as high priority. Please investigate and rework immediately.",
        timestamp: "2024-01-15T08:35:00Z",
        type: "assignment",
      },
      {
        id: "c2",
        author: "Yassir Benali",
        content:
          "Confirmed cold solder joint under microscope. Proceeding with rework using flux and controlled temperature.",
        timestamp: "2024-01-15T09:45:00Z",
        type: "comment",
      },
      {
        id: "c3",
        author: "Nadia Alami",
        content: "Please ensure proper preheating of the board before rework to prevent thermal shock.",
        timestamp: "2024-01-15T10:00:00Z",
        type: "comment",
      },
    ],
    resolutionSteps: [
      {
        step: 1,
        description: "Visual inspection under microscope",
        completed: true,
        completedBy: "Yassir Benali",
        completedAt: "2024-01-15T09:30:00Z",
      },
      {
        step: 2,
        description: "Apply flux to joint area",
        completed: true,
        completedBy: "Yassir Benali",
        completedAt: "2024-01-15T09:45:00Z",
      },
      { step: 3, description: "Rework solder joint with controlled temperature", completed: false },
      { step: 4, description: "Clean flux residue", completed: false },
      { step: 5, description: "Re-test with ICT", completed: false },
    ],
  },
  {
    id: "WF-002",
    title: "Capacitor C23 Value Out of Tolerance",
    description: "Measured capacitance 8.2µF instead of specified 10µF ±5% on ceramic capacitor C23",
    defectId: "DEF-2024-002",
    component: "Capacitor C23",
    partNumber: "CAP-10UF-0805-X7R",
    severity: "medium",
    status: "pending",
    assignedTo: "Khalid El Fassi",
    assignedBy: "Ayoub El Karkouri",
    department: "Engineering",
    createdAt: "2024-01-15T09:15:00Z",
    updatedAt: "2024-01-15T09:15:00Z",
    dueDate: "2024-01-17T12:00:00Z",
    estimatedHours: 3,
    priority: "medium",
    tags: ["capacitor", "tolerance", "replacement"],
    comments: [
      {
        id: "c4",
        author: "Ayoub El Karkouri",
        content: "Component appears to be from a suspect lot. Please verify part number and replace if necessary.",
        timestamp: "2024-01-15T09:20:00Z",
        type: "assignment",
      },
    ],
    resolutionSteps: [
      { step: 1, description: "Verify component marking and lot number", completed: false },
      { step: 2, description: "Check incoming inspection records", completed: false },
      { step: 3, description: "Replace component if confirmed defective", completed: false },
      { step: 4, description: "Update component traceability records", completed: false },
      { step: 5, description: "Re-test electrical parameters", completed: false },
    ],
  },
  {
    id: "WF-003",
    title: "Microcontroller U5 Programming Failure",
    description: "STM32F407 microcontroller failed programming verification - possible communication issue",
    defectId: "DEF-2024-003",
    component: "Microcontroller U5",
    partNumber: "STM32F407VGT6",
    severity: "high",
    status: "completed",
    assignedTo: "Hamza Benali",
    assignedBy: "Nadia Alami",
    department: "Engineering",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-15T11:30:00Z",
    dueDate: "2024-01-15T16:00:00Z",
    estimatedHours: 4,
    actualHours: 3.5,
    priority: "urgent",
    tags: ["microcontroller", "programming", "communication"],
    comments: [
      {
        id: "c5",
        author: "Nadia Alami",
        content: "Critical component failure affecting production line. Please prioritize this issue.",
        timestamp: "2024-01-14T14:25:00Z",
        type: "assignment",
      },
      {
        id: "c6",
        author: "Hamza Benali",
        content: "Found loose connection on SWD programming pins. Reflowed connections and verified continuity.",
        timestamp: "2024-01-15T10:15:00Z",
        type: "comment",
      },
      {
        id: "c7",
        author: "Hamza Benali",
        content: "Programming successful after rework. All functional tests passed.",
        timestamp: "2024-01-15T11:30:00Z",
        type: "status_change",
      },
    ],
    resolutionSteps: [
      {
        step: 1,
        description: "Check SWD programming connections",
        completed: true,
        completedBy: "Hamza Benali",
        completedAt: "2024-01-15T09:00:00Z",
      },
      {
        step: 2,
        description: "Verify power supply voltages",
        completed: true,
        completedBy: "Hamza Benali",
        completedAt: "2024-01-15T09:30:00Z",
      },
      {
        step: 3,
        description: "Reflow programming interface connections",
        completed: true,
        completedBy: "Hamza Benali",
        completedAt: "2024-01-15T10:15:00Z",
      },
      {
        step: 4,
        description: "Re-attempt programming",
        completed: true,
        completedBy: "Hamza Benali",
        completedAt: "2024-01-15T10:45:00Z",
      },
      {
        step: 5,
        description: "Perform functional verification",
        completed: true,
        completedBy: "Hamza Benali",
        completedAt: "2024-01-15T11:30:00Z",
      },
    ],
  },
  {
    id: "WF-004",
    title: "Inductor L12 Short Circuit",
    description: "Power inductor L12 showing 0.1Ω resistance instead of expected 2.2µH inductance",
    defectId: "DEF-2024-004",
    component: "Inductor L12",
    partNumber: "IND-2.2UH-1210-20%",
    severity: "high",
    status: "on-hold",
    assignedTo: "Mehdi Lahlou",
    assignedBy: "Salma Berrada",
    department: "Maintenance",
    createdAt: "2024-01-15T11:45:00Z",
    updatedAt: "2024-01-15T12:00:00Z",
    dueDate: "2024-01-16T14:00:00Z",
    estimatedHours: 2.5,
    priority: "high",
    tags: ["inductor", "short-circuit", "power"],
    comments: [
      {
        id: "c8",
        author: "Salma Berrada",
        content: "Component appears to have internal short. Waiting for replacement parts from supplier.",
        timestamp: "2024-01-15T11:50:00Z",
        type: "assignment",
      },
      {
        id: "c9",
        author: "Mehdi Lahlou",
        content:
          "Confirmed internal short circuit. Component needs replacement. ETA for new parts is tomorrow morning.",
        timestamp: "2024-01-15T12:00:00Z",
        type: "comment",
      },
    ],
    resolutionSteps: [
      {
        step: 1,
        description: "Measure inductance and resistance",
        completed: true,
        completedBy: "Mehdi Lahlou",
        completedAt: "2024-01-15T11:55:00Z",
      },
      {
        step: 2,
        description: "Order replacement component",
        completed: true,
        completedBy: "Salma Berrada",
        completedAt: "2024-01-15T12:00:00Z",
      },
      { step: 3, description: "Remove defective component", completed: false },
      { step: 4, description: "Install replacement component", completed: false },
      { step: 5, description: "Verify power supply operation", completed: false },
    ],
  },
  {
    id: "WF-005",
    title: "MOSFET Q8 Gate Drive Issue",
    description: "Power MOSFET Q8 not switching properly - suspected gate drive circuit malfunction",
    defectId: "DEF-2024-005",
    component: "MOSFET Q8",
    partNumber: "IRF540N-TO220",
    severity: "medium",
    status: "pending",
    assignedTo: "Zineb Ouali",
    assignedBy: "Rachid Tazi",
    department: "Maintenance",
    createdAt: "2024-01-15T13:30:00Z",
    updatedAt: "2024-01-15T13:30:00Z",
    dueDate: "2024-01-18T10:00:00Z",
    estimatedHours: 3.5,
    priority: "medium",
    tags: ["mosfet", "gate-drive", "switching"],
    comments: [
      {
        id: "c10",
        author: "Rachid Tazi",
        content:
          "Oscilloscope shows irregular gate drive waveform. Please investigate gate driver circuit and associated components.",
        timestamp: "2024-01-15T13:35:00Z",
        type: "assignment",
      },
    ],
    resolutionSteps: [
      { step: 1, description: "Measure gate drive voltage levels", completed: false },
      { step: 2, description: "Check gate driver IC functionality", completed: false },
      { step: 3, description: "Verify gate resistor values", completed: false },
      { step: 4, description: "Test MOSFET switching characteristics", completed: false },
      { step: 5, description: "Replace faulty components if identified", completed: false },
    ],
  },
  {
    id: "WF-006",
    title: "Diode D15 Forward Voltage Drop High",
    description: "Schottky diode D15 showing 0.8V forward drop instead of typical 0.3V specification",
    defectId: "DEF-2024-006",
    component: "Diode D15",
    partNumber: "BAT54S-SOT23",
    severity: "low",
    status: "in-progress",
    assignedTo: "Yassine El Aidous",
    assignedBy: "Yassir Benali",
    department: "Process",
    createdAt: "2024-01-15T14:15:00Z",
    updatedAt: "2024-01-15T15:00:00Z",
    dueDate: "2024-01-19T16:00:00Z",
    estimatedHours: 1.5,
    actualHours: 0.5,
    priority: "low",
    tags: ["diode", "forward-voltage", "schottky"],
    comments: [
      {
        id: "c11",
        author: "Yassir Benali",
        content:
          "Good learning opportunity for our intern. Please measure the diode characteristics and determine if replacement is needed.",
        timestamp: "2024-01-15T14:20:00Z",
        type: "assignment",
      },
      {
        id: "c12",
        author: "Yassine El Aidous",
        content:
          "Measured forward voltage at different currents. Appears to be silicon diode instead of Schottky. Checking part markings.",
        timestamp: "2024-01-15T15:00:00Z",
        type: "comment",
      },
    ],
    resolutionSteps: [
      {
        step: 1,
        description: "Measure forward voltage characteristics",
        completed: true,
        completedBy: "Yassine El Aidous",
        completedAt: "2024-01-15T14:45:00Z",
      },
      { step: 2, description: "Verify component part number and markings", completed: false },
      { step: 3, description: "Check component placement records", completed: false },
      { step: 4, description: "Replace with correct Schottky diode if needed", completed: false },
      { step: 5, description: "Update component traceability", completed: false },
    ],
  },
]

const departments = ["All", "Process", "Engineering", "Maintenance", "Production"]
const statuses = ["All", "pending", "in-progress", "completed", "on-hold"]
const priorities = ["All", "urgent", "high", "medium", "low"]

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "in-progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "on-hold":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
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

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "high":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  }
}

const getDepartmentColor = (department: string) => {
  const colors = {
    Process: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Engineering: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    Maintenance: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    Production: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  }
  return colors[department as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />
    case "in-progress":
      return <PlayCircle className="h-4 w-4" />
    case "completed":
      return <CheckCircle className="h-4 w-4" />
    case "on-hold":
      return <PauseCircle className="h-4 w-4" />
    default:
      return <AlertCircle className="h-4 w-4" />
  }
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export default function WorkflowPage() {
  const [selectedItem, setSelectedItem] = useState<WorkflowItem | null>(null)
  const [departmentFilter, setDepartmentFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [priorityFilter, setPriorityFilter] = useState("All")
  const [newComment, setNewComment] = useState("")
  const { toast } = useToast()

  const filteredItems = workflowItems.filter((item) => {
    const matchesDepartment = departmentFilter === "All" || item.department === departmentFilter
    const matchesStatus = statusFilter === "All" || item.status === statusFilter
    const matchesPriority = priorityFilter === "All" || item.priority === priorityFilter

    return matchesDepartment && matchesStatus && matchesPriority
  })

  const handleStatusChange = (itemId: string, newStatus: string) => {
    // In a real app, this would update the backend
    toast({
      title: "Status Updated",
      description: `Workflow item ${itemId} status changed to ${newStatus}`,
    })
  }

  const handleAddComment = (itemId: string) => {
    if (!newComment.trim()) return

    // In a real app, this would update the backend
    toast({
      title: "Comment Added",
      description: "Your comment has been added to the workflow item",
    })
    setNewComment("")
  }

  // Calculate statistics
  const totalItems = workflowItems.length
  const completedItems = workflowItems.filter((item) => item.status === "completed").length
  const inProgressItems = workflowItems.filter((item) => item.status === "in-progress").length
  const pendingItems = workflowItems.filter((item) => item.status === "pending").length
  const onHoldItems = workflowItems.filter((item) => item.status === "on-hold").length

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">Workflow Management</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track and manage defect resolution workflows across departments
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">Active workflow items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedItems}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((completedItems / totalItems) * 100)}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <PlayCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressItems}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingItems}</div>
              <p className="text-xs text-muted-foreground">Awaiting assignment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Hold</CardTitle>
              <PauseCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{onHoldItems}</div>
              <p className="text-xs text-muted-foreground">Blocked items</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Badge variant="outline" className="ml-auto">
                {filteredItems.length} of {totalItems} items
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Team Structure Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Moroccan ICT Team Structure</CardTitle>
            <CardDescription>Current team assignments and department distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-600">Process Department</h4>
                <div className="space-y-1 text-sm">
                  <div>• Ayoub El Karkouri (CAR Leader)</div>
                  <div>• Yassir Benali (Test Engineer)</div>
                  <div>• Yassine El Aidous (Intern)</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-600">Engineering</h4>
                <div className="space-y-1 text-sm">
                  <div>• Hamza Benali (Test Engineer)</div>
                  <div>• Khalid El Fassi (Process Analyst)</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-orange-600">Maintenance</h4>
                <div className="space-y-1 text-sm">
                  <div>• Mehdi Lahlou (Technician)</div>
                  <div>• Zineb Ouali (Technician)</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-600">Production</h4>
                <div className="space-y-1 text-sm">
                  <div>• Nadia Alami (Manager)</div>
                  <div>• Salma Berrada (R&D Specialist)</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Workflow Items List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Workflow Items</h2>
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedItem?.id === item.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        {getStatusIcon(item.status)}
                        <span>{item.title}</span>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {item.component} • {item.partNumber}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                      <Badge className={getPriorityColor(item.priority)} variant="outline">
                        {item.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.description}</p>

                  <div className="flex flex-wrap gap-2">
                    <Badge className={getSeverityColor(item.severity)}>{item.severity}</Badge>
                    <Badge className={getDepartmentColor(item.department)}>{item.department}</Badge>
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6 bg-blue-500 text-white">
                        <AvatarFallback className="text-xs">{getInitials(item.assignedTo)}</AvatarFallback>
                      </Avatar>
                      <span>{item.assignedTo}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(item.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.comments.length} comments</span>
                    <span>
                      {item.resolutionSteps.filter((s) => s.completed).length}/{item.resolutionSteps.length} steps
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Workflow Item Details */}
          <div className="sticky top-4">
            {selectedItem ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        {getStatusIcon(selectedItem.status)}
                        <span>{selectedItem.title}</span>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {selectedItem.id} • {selectedItem.defectId}
                      </CardDescription>
                    </div>
                    <Select
                      value={selectedItem.status}
                      onValueChange={(value) => handleStatusChange(selectedItem.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Description */}
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedItem.description}</p>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Assigned to:</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Avatar className="h-6 w-6 bg-blue-500 text-white">
                          <AvatarFallback className="text-xs">{getInitials(selectedItem.assignedTo)}</AvatarFallback>
                        </Avatar>
                        <span>{selectedItem.assignedTo}</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Department:</span>
                      <div className="mt-1">
                        <Badge className={getDepartmentColor(selectedItem.department)}>{selectedItem.department}</Badge>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Due Date:</span>
                      <p className="mt-1">{new Date(selectedItem.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium">Priority:</span>
                      <div className="mt-1">
                        <Badge className={getPriorityColor(selectedItem.priority)}>{selectedItem.priority}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Resolution Steps */}
                  <div>
                    <h4 className="font-semibold mb-3">Resolution Steps</h4>
                    <div className="space-y-2">
                      {selectedItem.resolutionSteps.map((step) => (
                        <div key={step.step} className="flex items-start space-x-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                              step.completed
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {step.completed ? "✓" : step.step}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm ${step.completed ? "line-through text-gray-500" : ""}`}>
                              {step.description}
                            </p>
                            {step.completed && step.completedBy && (
                              <p className="text-xs text-gray-500 mt-1">
                                Completed by {step.completedBy} on {new Date(step.completedAt!).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Comments */}
                  <div>
                    <h4 className="font-semibold mb-3">Comments & Updates</h4>
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {selectedItem.comments.map((comment) => (
                        <div key={comment.id} className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                            <AvatarFallback className="text-xs">{getInitials(comment.author)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm">{comment.author}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.timestamp).toLocaleString()}
                              </span>
                              {comment.type !== "comment" && (
                                <Badge variant="outline" className="text-xs">
                                  {comment.type.replace("_", " ")}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Comment */}
                    <div className="mt-4 space-y-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <Button
                        onClick={() => handleAddComment(selectedItem.id)}
                        disabled={!newComment.trim()}
                        className="w-full"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Add Comment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <User className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select a Workflow Item</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a workflow item from the list to view details, comments, and resolution steps
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
