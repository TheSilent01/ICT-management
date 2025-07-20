"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ICTDefect } from "@/types/defect";
import { Separator } from "@/components/ui/separator"
import { X, AlertTriangle, CheckCircle, Info, Clock, User, Wrench, MapPin, Copy, Edit, Save } from "lucide-react"
import { toast } from "@/hooks/use-toast"


interface ICTDefectDetailProps {
  defect: ICTDefect
  onClose: () => void
}

export function ICTDefectDetail({ defect, onClose }: ICTDefectDetailProps) {
  const getTestResultInfo = (testResult: 'pass' | 'fail' | 'warning') => {
    switch (testResult) {
      case "pass":
        return { icon: <CheckCircle className="h-5 w-5 text-green-500" />, text: "PASS", color: "border-green-500 text-green-700" };
      case "fail":
        return { icon: <X className="h-5 w-5 text-red-500" />, text: "FAIL", color: "border-red-500 text-red-700" };
      case "warning":
        return { icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />, text: "WARNING", color: "border-yellow-500 text-yellow-700" };
      default:
        return { icon: <Info className="h-5 w-5 text-gray-500" />, text: "N/A", color: "border-gray-500 text-gray-700" };
    }
  };

  const testResultInfo = defect.testResult ? getTestResultInfo(defect.testResult) : { icon: <Info className="h-5 w-5 text-gray-500" />, text: "N/A", color: "border-gray-500 text-gray-700"  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "medium":
        return <Info className="h-5 w-5 text-yellow-500" />
      case "low":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
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

  const handleCopyDetails = async () => {
    const details = `ICT Defect Report - ${defect.id}
Timestamp: ${defect.timestamp}
Operator: ${defect.operator}
Component: ${defect.component}
Part Number: ${defect.partNumber}
Pin: ${defect.pin}
Test Station: ${defect.testStation}
Board Serial: ${defect.boardSerial}
Defect Type: ${defect.defectType}
Root Cause: ${defect.rootCause}
Severity: ${defect.severity}
Status: ${defect.status}
Assigned To: ${defect.assignedTo}
${defect.resolvedDate ? `Resolved: ${defect.resolvedDate}` : ""}

Comment: ${defect.comment}
Suggestion: ${defect.suggestion}
Pin Explanation: ${defect.pinExplanation}`

    try {
      await navigator.clipboard.writeText(details)
      toast({
        title: "Details Copied",
        description: "Defect details have been copied to clipboard.",
      })
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy details to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleEditDefect = () => {
    toast({
      title: "Edit Mode",
      description: `Opening editor for defect ${defect.id}`,
    })
  }

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: `Defect ${defect.id} has been updated successfully.`,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">{defect.id}</CardTitle>
            <CardDescription>Detailed ICT Defect Analysis - Yassine's System</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleCopyDetails}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleEditDefect}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={handleSaveChanges}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status and Severity */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {getSeverityIcon(defect.severity)}
              <Badge className={getSeverityColor(defect.severity)}>{defect.severity.toUpperCase()} SEVERITY</Badge>
            </div>
            <Badge className={getStatusColor(defect.status)}>{defect.status.toUpperCase()}</Badge>
            <Badge
              variant="outline"
              className={testResultInfo.color}
            >
              {testResultInfo.icon}
              <span className="ml-2">{testResultInfo.text}</span>
            </Badge>
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Timestamp:</span>
                  <span className="text-sm">{new Date(defect.timestamp).toLocaleString()}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Operator:</span>
                  <span className="text-sm font-semibold text-blue-600">{defect.operator}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Test Station:</span>
                  <span className="text-sm">{defect.testStation}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Wrench className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Assigned To:</span>
                  <span className="text-sm font-semibold text-green-600">{defect.assignedTo}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Component Details</h3>

              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium">Component:</span>
                  <p className="text-sm mt-1">{defect.component}</p>
                </div>

                <div>
                  <span className="text-sm font-medium">Part Number:</span>
                  <p className="text-sm mt-1 font-mono text-blue-600">{defect.partNumber}</p>
                </div>

                <div>
                  <span className="text-sm font-medium">Pin:</span>
                  <p className="text-sm mt-1">{defect.pin}</p>
                </div>

                <div>
                  <span className="text-sm font-medium">Board Serial:</span>
                  <p className="text-sm mt-1 font-mono">{defect.boardSerial}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Defect Analysis */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Defect Analysis</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium">Defect Type:</span>
                <p className="text-sm mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">{defect.defectType}</p>
              </div>

              <div>
                <span className="text-sm font-medium">Root Cause:</span>
                <p className="text-sm mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">{defect.rootCause}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Detailed Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Detailed Description</h3>

            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium">Comment:</span>
                <p className="text-sm mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-500">
                  {defect.comment}
                </p>
              </div>

              <div>
                <span className="text-sm font-medium">Suggestion:</span>
                <p className="text-sm mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-500">
                  {defect.suggestion}
                </p>
              </div>

              <div>
                <span className="text-sm font-medium">Pin Explanation:</span>
                <p className="text-sm mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-500">
                  {defect.pinExplanation}
                </p>
              </div>
            </div>
          </div>

          {/* Resolution Information */}
          {defect.resolvedDate && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-green-600">Resolution Information</h3>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Resolved on:</span>
                  <span className="text-sm">{new Date(defect.resolvedDate).toLocaleString()}</span>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCopyDetails}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Details
              </Button>
              <Button variant="outline" onClick={handleEditDefect}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Defect
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={handleSaveChanges}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
