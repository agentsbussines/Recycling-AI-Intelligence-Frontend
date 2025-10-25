"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { ChatInterface } from "./chat-interface"
import { StatsPanel } from "./stats-panel"
import { FileUploadSection } from "./file-upload-section"
import { VisualizationsPanel } from "./visualizations-panel"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

interface DashboardProps {
  onLogout: () => void
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeAgent, setActiveAgent] = useState<"inventory" | "marketing" | "finance">("inventory")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    onLogout()
  }

  const fetchStats = async () => {
    setIsLoadingStats(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const response = await fetch(`${apiUrl}/stats`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        activeAgent={activeAgent}
        onAgentChange={setActiveAgent}
        stats={stats}
        onRefreshStats={fetchStats}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Recycling Business AI Intelligence</h1>
              <p className="text-sm text-muted-foreground">Powered by Advanced AI Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="gap-2 bg-transparent"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
            <div className="lg:col-span-3 flex flex-col gap-6">
              <FileUploadSection agent={activeAgent} onUploadSuccess={fetchStats} />
              <ChatInterface agent={activeAgent} />
            </div>

            <div className="flex flex-col gap-6">
              <StatsPanel stats={stats} agent={activeAgent} isLoading={isLoadingStats} />
              <VisualizationsPanel stats={stats} agent={activeAgent} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
