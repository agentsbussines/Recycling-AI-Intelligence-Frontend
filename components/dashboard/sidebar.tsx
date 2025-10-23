"use client"
import { Button } from "@/components/ui/button"
import { RotateCcw, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface SidebarProps {
  activeAgent: string
  onAgentChange: (agent: "inventory" | "marketing" | "finance") => void
  stats: any
  onRefreshStats: () => void
  isOpen: boolean
  onClose: () => void
}

const agents = [
  { id: "inventory", icon: "📦", name: "Inventory Management", color: "from-green-500 to-emerald-600" },
  { id: "marketing", icon: "📊", name: "Market Analytics", color: "from-blue-500 to-cyan-600" },
  { id: "finance", icon: "💰", name: "Financial Reports", color: "from-amber-500 to-orange-600" },
]

export function Sidebar({ activeAgent, onAgentChange, stats, onRefreshStats, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 lg:hidden z-40 transition-opacity duration-300" onClick={onClose} />
      )}

      {/* Sidebar with animated drawer */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 border-r border-green-200 dark:border-slate-700 flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0 shadow-lg" : "-translate-x-full",
        )}
      >
        {/* Close Button (Mobile) */}
        <div className="lg:hidden p-4 border-b border-green-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-green-700 dark:text-slate-300" />
          </button>
        </div>

        <div className="p-4 border-b border-green-200 dark:border-slate-700 flex items-center gap-3">
          <div className="relative w-10 h-10">
            <Image src="/brand_image.jpg" alt="Recicladora Industrial" fill className="object-contain" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-green-900 dark:text-slate-100">Recicladora</h3>
            <p className="text-xs text-green-600 dark:text-slate-400">Industrial</p>
          </div>
        </div>

        {/* Agent Selection */}
        <div className="p-4 border-b border-green-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-green-900 dark:text-slate-100 mb-3">Select Module</h2>
          <div className="space-y-2">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => {
                  onAgentChange(agent.id as "inventory" | "marketing" | "finance")
                  onClose()
                }}
                className={cn(
                  "w-full px-4 py-3 rounded-lg text-left font-medium transition-all duration-200",
                  activeAgent === agent.id
                    ? `bg-gradient-to-r ${agent.color} text-white shadow-lg`
                    : "bg-white dark:bg-slate-800 text-green-900 dark:text-slate-100 hover:bg-green-100 dark:hover:bg-slate-700 border border-green-200 dark:border-slate-600",
                )}
              >
                <span className="mr-2">{agent.icon}</span>
                {agent.name}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-b border-green-200 dark:border-slate-700 space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefreshStats}
            className="w-full justify-start gap-2 bg-white dark:bg-slate-800 border-green-200 dark:border-slate-600 text-green-900 dark:text-slate-100 hover:bg-green-50 dark:hover:bg-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
            Refresh Stats
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 bg-white dark:bg-slate-800 border-green-200 dark:border-slate-600 text-green-900 dark:text-slate-100 hover:bg-green-50 dark:hover:bg-slate-700"
          >
            <Trash2 className="w-4 h-4" />
            Clear Chat
          </Button>
        </div>

        {/* Stats */}
        <div className="flex-1 overflow-auto p-4">
          <h3 className="text-sm font-semibold text-green-900 dark:text-slate-100 mb-4">Quick Stats</h3>
          {stats ? (
            <div className="space-y-4">
              {activeAgent === "inventory" && (
                <div className="space-y-3">
                  <StatItem label="Total Value" value={`$${(stats.inventory?.total_value || 0).toLocaleString()}`} />
                  <StatItem label="Total Records" value={stats.inventory?.total_records || 0} />
                  <StatItem label="Unique Metals" value={Object.keys(stats.inventory?.metal_breakdown || {}).length} />
                </div>
              )}
              {activeAgent === "marketing" && (
                <div className="space-y-3">
                  <StatItem label="Ad Spend" value={`$${(stats.marketing?.total_spend || 0).toLocaleString()}`} />
                  <StatItem label="Impressions" value={(stats.marketing?.total_impressions || 0).toLocaleString()} />
                  <StatItem label="Campaigns" value={stats.marketing?.total_campaigns || 0} />
                </div>
              )}
              {activeAgent === "finance" && (
                <div className="space-y-3">
                  <StatItem label="Bank Statements" value={stats.finance?.bank_statements || 0} />
                  <StatItem label="Invoices" value={stats.finance?.invoices || 0} />
                  <StatItem label="Price Lists" value={stats.finance?.price_lists || 0} />
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-green-600 dark:text-slate-400">Loading stats...</p>
          )}
        </div>
      </aside>
    </>
  )
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-green-200 dark:border-slate-600">
      <p className="text-xs text-green-600 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-lg font-semibold text-green-900 dark:text-slate-100">{value}</p>
    </div>
  )
}
