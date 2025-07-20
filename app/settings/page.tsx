"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Sun, FileText, Bell, Database } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"

interface Settings {
  theme: string
  defaultFileFormat: string
  autoAnalysis: boolean
  notifications: boolean
  maxFileSize: string
  retentionDays: string
  exportFormat: string
  customComponents: string
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState<Settings>({
    theme: "system",
    defaultFileFormat: "csv",
    autoAnalysis: true,
    notifications: true,
    maxFileSize: "10",
    retentionDays: "90",
    exportFormat: "csv",
    customComponents: "",
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("defectTrackerSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("defectTrackerSettings", JSON.stringify(settings))
    if (settings.theme !== "system") {
      setTheme(settings.theme)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    const defaultSettings: Settings = {
      theme: "system",
      defaultFileFormat: "csv",
      autoAnalysis: true,
      notifications: true,
      maxFileSize: "10",
      retentionDays: "90",
      exportFormat: "csv",
      customComponents: "",
    }
    setSettings(defaultSettings)
    localStorage.removeItem("defectTrackerSettings")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
            <p className="text-gray-600 dark:text-gray-300">Configure your defect tracking preferences</p>
          </div>

          <div className="grid gap-6">
            {/* Appearance Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sun className="h-5 w-5 mr-2" />
                  Appearance
                </CardTitle>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred theme</p>
                  </div>
                  <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* File Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  File Handling
                </CardTitle>
                <CardDescription>Configure file upload and processing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="defaultFormat">Default File Format</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Preferred format for uploads</p>
                  </div>
                  <Select
                    value={settings.defaultFileFormat}
                    onValueChange={(value) => setSettings({ ...settings, defaultFileFormat: value })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">XLSX</SelectItem>
                      <SelectItem value="xls">XLS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Maximum allowed file size</p>
                  </div>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => setSettings({ ...settings, maxFileSize: e.target.value })}
                    className="w-20"
                    min="1"
                    max="100"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoAnalysis">Auto Analysis</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Automatically analyze uploaded files</p>
                  </div>
                  <Switch
                    id="autoAnalysis"
                    checked={settings.autoAnalysis}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoAnalysis: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Data Management
                </CardTitle>
                <CardDescription>Configure data storage and retention policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="retentionDays">Data Retention (Days)</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">How long to keep defect records</p>
                  </div>
                  <Input
                    id="retentionDays"
                    type="number"
                    value={settings.retentionDays}
                    onChange={(e) => setSettings({ ...settings, retentionDays: e.target.value })}
                    className="w-20"
                    min="1"
                    max="365"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="exportFormat">Export Format</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Default format for data exports</p>
                  </div>
                  <Select
                    value={settings.exportFormat}
                    onValueChange={(value) => setSettings({ ...settings, exportFormat: value })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">XLSX</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </CardTitle>
                <CardDescription>Configure alert and notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Enable Notifications</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive alerts for high-severity defects</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Custom Components */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Components</CardTitle>
                <CardDescription>Add custom component types (one per line)</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter custom component names, one per line..."
                  value={settings.customComponents}
                  onChange={(e) => setSettings({ ...settings, customComponents: e.target.value })}
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6">
              <Button variant="outline" onClick={handleReset}>
                Reset to Defaults
              </Button>
              <div className="flex items-center space-x-4">
                {saved && <span className="text-green-600 dark:text-green-400 text-sm">Settings saved!</span>}
                <Button onClick={handleSave}>Save Settings</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
