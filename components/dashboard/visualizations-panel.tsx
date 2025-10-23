"use client"

import { Card } from "@/components/ui/card"

interface VisualizationsPanelProps {
  stats: any
  agent: "inventory" | "marketing" | "finance"
}

export function VisualizationsPanel({ stats, agent }: VisualizationsPanelProps) {
  if (!stats) return null

  const renderInventoryChart = () => {
    const breakdown = stats.inventory?.metal_breakdown || {}
    const maxValue = Math.max(...Object.values(breakdown).map((v: any) => v.quantity || 0), 1)

    return (
      <div className="space-y-3">
        {Object.entries(breakdown).map(([metal, data]: [string, any]) => {
          const quantity = data.quantity || 0
          const percentage = (quantity / maxValue) * 100
          return (
            <div key={metal}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-foreground">{metal}</span>
                <span className="text-xs text-muted-foreground">{quantity}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderMarketingChart = () => {
    const campaigns = stats.marketing?.campaigns?.slice(0, 5) || []
    const maxSpend = Math.max(...campaigns.map((c: any) => c.spend || 0), 1)

    return (
      <div className="space-y-3">
        {campaigns.map((campaign: any, idx: number) => {
          const percentage = (campaign.spend / maxSpend) * 100
          return (
            <div key={idx}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-foreground truncate">{campaign.name}</span>
                <span className="text-xs text-muted-foreground">${campaign.spend}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderFinanceChart = () => {
    const data = [
      { label: "Bank Statements", value: stats.finance?.bank_statements || 0 },
      { label: "Invoices", value: stats.finance?.invoices || 0 },
      { label: "Price Lists", value: stats.finance?.price_lists || 0 },
    ]
    const maxValue = Math.max(...data.map((d) => d.value), 1)

    return (
      <div className="space-y-3">
        {data.map((item, idx) => {
          const percentage = (item.value / maxValue) * 100
          return (
            <div key={idx}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-foreground">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.value}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 h-full rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Visualizations</h3>

      {agent === "inventory" && renderInventoryChart()}
      {agent === "marketing" && renderMarketingChart()}
      {agent === "finance" && renderFinanceChart()}
    </Card>
  )
}
