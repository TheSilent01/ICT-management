"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ArrowLeft,
  Building2,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  Shield,
  Award,
  Clock,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

interface TeamMember {
  id: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  joinDate: string
  status: "active" | "inactive" | "on-leave"
  avatar?: string
  permissions: string[]
  lastActive: string
  completedTasks: number
  activeDefects: number
}

const teamMembers: TeamMember[] = [
  // Process Department
  {
    id: "1",
    name: "Ayoub El Karkouri",
    email: "ayoub.elkarkouri@lear.ma",
    phone: "+212 6 12 34 56 78",
    role: "CAR Leader",
    department: "Process",
    joinDate: "2022-01-15",
    status: "active",
    permissions: ["manage_defects", "assign_tasks", "view_analytics"],
    lastActive: "2024-01-15 09:30",
    completedTasks: 145,
    activeDefects: 8,
  },
  {
    id: "2",
    name: "Yassine El Aidous",
    email: "yassine.elaidous@ensam.ac.ma",
    phone: "+212 6 23 45 67 89",
    role: "Intern",
    department: "Process",
    joinDate: "2023-09-01",
    status: "active",
    permissions: ["view_defects", "update_status"],
    lastActive: "2024-01-15 10:15",
    completedTasks: 32,
    activeDefects: 3,
  },
  {
    id: "3",
    name: "Yassir Benali",
    email: "yassir.benali@lear.ma",
    phone: "+212 6 34 56 78 90",
    role: "Test Engineer",
    department: "Process",
    joinDate: "2021-06-10",
    status: "active",
    permissions: ["manage_defects", "run_tests", "view_analytics"],
    lastActive: "2024-01-15 08:45",
    completedTasks: 198,
    activeDefects: 12,
  },

  // Quality Control Department
  {
    id: "4",
    name: "Fatima Zahra El Idrissi",
    email: "fatima.elidrissi@lear.ma",
    phone: "+212 6 45 67 89 01",
    role: "Quality Inspector",
    department: "Quality Control",
    joinDate: "2020-03-20",
    status: "active",
    permissions: ["inspect_quality", "approve_fixes", "view_analytics"],
    lastActive: "2024-01-15 11:20",
    completedTasks: 267,
    activeDefects: 5,
  },
  {
    id: "5",
    name: "Omar Chakir",
    email: "omar.chakir@lear.ma",
    phone: "+212 6 56 78 90 12",
    role: "Quality Inspector",
    department: "Quality Control",
    joinDate: "2021-11-08",
    status: "active",
    permissions: ["inspect_quality", "approve_fixes"],
    lastActive: "2024-01-15 09:00",
    completedTasks: 156,
    activeDefects: 7,
  },

  // Production Department
  {
    id: "6",
    name: "Nadia Alami",
    email: "nadia.alami@lear.ma",
    phone: "+212 6 67 89 01 23",
    role: "Production Manager",
    department: "Production",
    joinDate: "2019-05-15",
    status: "active",
    permissions: ["manage_production", "assign_tasks", "view_analytics", "manage_users"],
    lastActive: "2024-01-15 07:30",
    completedTasks: 324,
    activeDefects: 15,
  },
  {
    id: "7",
    name: "Khalid El Fassi",
    email: "khalid.elfassi@lear.ma",
    phone: "+212 6 78 90 12 34",
    role: "Process Analyst",
    department: "Production",
    joinDate: "2022-08-12",
    status: "active",
    permissions: ["analyze_processes", "view_analytics"],
    lastActive: "2024-01-15 10:45",
    completedTasks: 89,
    activeDefects: 4,
  },

  // Engineering Department
  {
    id: "8",
    name: "Hamza Benali",
    email: "hamza.benali@lear.ma",
    phone: "+212 6 89 01 23 45",
    role: "Test Engineer",
    department: "Engineering",
    joinDate: "2020-12-01",
    status: "active",
    permissions: ["design_tests", "manage_defects", "view_analytics"],
    lastActive: "2024-01-15 09:15",
    completedTasks: 234,
    activeDefects: 9,
  },
  {
    id: "9",
    name: "Salma Berrada",
    email: "salma.berrada@lear.ma",
    phone: "+212 6 90 12 34 56",
    role: "R&D Specialist",
    department: "Engineering",
    joinDate: "2021-04-18",
    status: "active",
    permissions: ["research", "develop_solutions", "view_analytics"],
    lastActive: "2024-01-15 08:20",
    completedTasks: 167,
    activeDefects: 6,
  },

  // Maintenance Department
  {
    id: "10",
    name: "Mehdi Lahlou",
    email: "mehdi.lahlou@lear.ma",
    phone: "+212 6 01 23 45 67",
    role: "Maintenance Technician",
    department: "Maintenance",
    joinDate: "2022-02-28",
    status: "active",
    permissions: ["maintain_equipment", "repair_defects"],
    lastActive: "2024-01-15 11:00",
    completedTasks: 178,
    activeDefects: 11,
  },
  {
    id: "11",
    name: "Zineb Ouali",
    email: "zineb.ouali@lear.ma",
    phone: "+212 6 12 34 56 78",
    role: "Maintenance Technician",
    department: "Maintenance",
    joinDate: "2023-01-10",
    status: "active",
    permissions: ["maintain_equipment", "repair_defects"],
    lastActive: "2024-01-15 10:30",
    completedTasks: 98,
    activeDefects: 6,
  },

  // Research & Development Department
  {
    id: "12",
    name: "Rachid Tazi",
    email: "rachid.tazi@lear.ma",
    phone: "+212 6 23 45 67 89",
    role: "R&D Specialist",
    department: "Research & Development",
    joinDate: "2020-07-22",
    status: "active",
    permissions: ["research", "develop_solutions", "view_analytics"],
    lastActive: "2024-01-15 09:45",
    completedTasks: 201,
    activeDefects: 3,
  },
  {
    id: "13",
    name: "Aicha Bennani",
    email: "aicha.bennani@lear.ma",
    phone: "+212 6 34 56 78 90",
    role: "Process Analyst",
    department: "Research & Development",
    joinDate: "2021-09-05",
    status: "on-leave",
    permissions: ["analyze_processes", "view_analytics"],
    lastActive: "2024-01-10 16:00",
    completedTasks: 143,
    activeDefects: 2,
  },
  {
    id: "14",
    name: "ZAROUGUI Marwa",
    email: "marwa.zarougui@lear.ma",
    phone: "+212 6 11 22 33 44",
    role: "Intern",
    department: "Process",
    joinDate: "2024-06-01",
    status: "active",
    permissions: ["view_defects", "update_status"],
    lastActive: "2025-07-20 09:00",
    completedTasks: 0,
    activeDefects: 0,
  },
  {
    id: "15",
    name: "TBOUALLALT Aya",
    email: "aya.tbouallalt@lear.ma",
    phone: "+212 6 22 33 44 55",
    role: "Intern",
    department: "Quality Control",
    joinDate: "2024-06-01",
    status: "active",
    permissions: ["view_defects", "update_status"],
    lastActive: "2025-07-20 09:00",
    completedTasks: 0,
    activeDefects: 0,
  },
  {
    id: "16",
    name: "BOUKILI Aya",
    email: "aya.boukili@lear.ma",
    phone: "+212 6 33 44 55 66",
    role: "Intern",
    department: "Quality Control",
    joinDate: "2024-06-01",
    status: "active",
    permissions: ["view_defects", "update_status"],
    lastActive: "2025-07-20 09:00",
    completedTasks: 0,
    activeDefects: 0,
  },
  {
    id: "17",
    name: "Naoui Mohamed Abdellah",
    email: "mohamedabdellah.naoui@lear.ma",
    phone: "+212 6 44 55 66 77",
    role: "Intern",
    department: "Engineering",
    joinDate: "2024-06-01",
    status: "active",
    permissions: ["view_defects", "update_status"],
    lastActive: "2025-07-20 09:00",
    completedTasks: 0,
    activeDefects: 0,
  },
]

const departments = [
  "All",
  "Process",
  "Quality Control",
  "Production",
  "Engineering",
  "Maintenance",
  "Research & Development",
]
const roles = [
  "All",
  "CAR Leader",
  "Test Engineer",
  "Intern",
  "Quality Inspector",
  "Production Manager",
  "Process Analyst",
  "Maintenance Technician",
  "R&D Specialist",
]

const getDepartmentColor = (department: string) => {
  const colors = {
    Process: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "Quality Control": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Production: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    Engineering: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    Maintenance: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    "Research & Development": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  }
  return colors[department as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
}

const getRoleColor = (role: string) => {
  const colors = {
    "CAR Leader": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    "Test Engineer": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Intern: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    "Quality Inspector": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "Production Manager": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    "Process Analyst": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    "Maintenance Technician": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    "R&D Specialist": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  }
  return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "inactive":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "on-leave":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  }
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("All")
  const [roleFilter, setRoleFilter] = useState("All")

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "All" || member.department === departmentFilter
    const matchesRole = roleFilter === "All" || member.role === roleFilter

    return matchesSearch && matchesDepartment && matchesRole
  })

  // Calculate statistics
  const totalMembers = teamMembers.length
  const activeMembers = teamMembers.filter((m) => m.status === "active").length
  const totalDepartments = departments.length - 1 // Exclude "All"
  const totalRoles = roles.length - 1 // Exclude "All"
  const totalCompletedTasks = teamMembers.reduce((sum, m) => sum + m.completedTasks, 0)
  const totalActiveDefects = teamMembers.reduce((sum, m) => sum + m.activeDefects, 0)

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">Team Management</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage team members, roles, and departments across the organization
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMembers}</div>
              <p className="text-xs text-muted-foreground">Across all departments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeMembers}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((activeMembers / totalMembers) * 100)}% active rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building2 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDepartments}</div>
              <p className="text-xs text-muted-foreground">Active departments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Roles</CardTitle>
              <Briefcase className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRoles}</div>
              <p className="text-xs text-muted-foreground">Different roles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <Award className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCompletedTasks}</div>
              <p className="text-xs text-muted-foreground">Total completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Defects</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalActiveDefects}</div>
              <p className="text-xs text-muted-foreground">Currently assigned</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>

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

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Badge variant="outline" className="ml-auto">
                {filteredMembers.length} of {totalMembers} members
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Team Structure Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Process Department Team Structure</CardTitle>
            <CardDescription>Current team composition and hierarchy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Avatar className="h-12 w-12 bg-red-500 text-white">
                  <AvatarFallback>AE</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">Ayoub El Karkouri</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">CAR Leader - Process Department</div>
                  <Badge className="mt-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Team Lead</Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 ml-8">
                <div className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Avatar className="h-10 w-10 bg-blue-500 text-white">
                    <AvatarFallback>YB</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Yassir Benali</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Test Engineer</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Avatar className="h-10 w-10 bg-yellow-500 text-white">
                    <AvatarFallback>YE</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Yassine El Aidous</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Intern</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <Mail className="h-3 w-3" />
                      <span className="text-xs">{member.email}</span>
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className={getDepartmentColor(member.department)}>{member.department}</Badge>
                  <Badge className={getRoleColor(member.role)}>{member.role}</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-3 w-3 text-gray-500" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3 text-gray-500" />
                    <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span>Last active: {member.lastActive}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">{member.completedTasks}</div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-orange-600">{member.activeDefects}</div>
                    <div className="text-xs text-gray-500">Active</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Shield className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {member.permissions.length} permissions
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No team members found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
