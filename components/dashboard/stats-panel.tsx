"use client"

import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface StatsPanelProps {
  stats: any
  agent: "inventory" | "marketing" | "finance"
  isLoading: boolean
}

export function StatsPanel({ stats, agent, isLoading }: StatsPanelProps) {
  if (isLoading) {
    return (
      <Card className="bg-card border-border p-6 flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Statistics</h3>
      <div className="space-y-3">
        {agent === "inventory" && stats?.inventory && (
          <>
            <StatCard label="Total Value" value={`$${(stats.inventory.total_value || 0).toLocaleString()}`} />
            <StatCard label="Total Records" value={stats.inventory.total_records || 0} />
            <StatCard label="Unique Metals" value={Object.keys(stats.inventory.metal_breakdown || {}).length} />
          </>
        )}
        {agent === "marketing" && stats?.marketing && (
          <>
            <StatCard label="Ad Spend" value={`$${(stats.marketing.total_spend || 0).toLocaleString()}`} />
            <StatCard label="Impressions" value={(stats.marketing.total_impressions || 0).toLocaleString()} />
            <StatCard label="Campaigns" value={stats.marketing.total_campaigns || 0} />
          </>
        )}
        {agent === "finance" && stats?.finance && (
          <>
            <StatCard label="Bank Statements" value={stats.finance.bank_statements || 0} />
            <StatCard label="Invoices" value={stats.finance.invoices || 0} />
            <StatCard label="Price Lists" value={stats.finance.price_lists || 0} />
          </>
        )}
      </div>
    </Card>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 bg-muted rounded-lg border border-border">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-xl font-bold text-foreground">{value}</p>
    </div>
  )
}
