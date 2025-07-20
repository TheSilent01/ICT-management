import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Upload, BarChart3, Settings, Users, Workflow, Mail, Bell, User } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <Link href="/" className="text-xl font-bold text-primary">
                      Defect Tracker
                    </Link>
                    <nav className="hidden md:flex items-center space-x-4">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/" className="flex items-center space-x-2">
                          <Home className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/upload" className="flex items-center space-x-2">
                          <Upload className="h-4 w-4" />
                          <span>Upload</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/analytics" className="flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4" />
                          <span>Analytics</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/notifications" className="flex items-center space-x-2">
                          <Bell className="h-4 w-4" />
                          <span>Notifications</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/workflow" className="flex items-center space-x-2">
                          <Workflow className="h-4 w-4" />
                          <span>Workflow</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/user-management" className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>Users</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/settings" className="flex items-center space-x-2">
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/about-me" className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>About Me</span>
                        </Link>
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
