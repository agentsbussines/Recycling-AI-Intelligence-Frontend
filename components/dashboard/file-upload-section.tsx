"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface FileUploadSectionProps {
  agent: "inventory" | "marketing" | "finance"
  onUploadSuccess: () => void
}

const fileTypes = {
  inventory: ["pdf"],
  marketing: ["csv", "xlsx", "xls"],
  finance: ["jpg", "jpeg", "png"],
}

const descriptions = {
  inventory: "Upload PDFs and chat about inventory data",
  marketing: "Upload Facebook Ads data and get marketing insights",
  finance: "Upload financial documents and analyze your finances",
}

export function FileUploadSection({ agent, onUploadSuccess }: FileUploadSectionProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setStatus("idle")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsLoading(true)
    setStatus("idle")

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const endpoint = `${apiUrl}/${agent}/upload`
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setStatus("success")
        setMessage(data.message || "File uploaded successfully!")
        setFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        onUploadSuccess()
      } else {
        const error = await response.json()
        setStatus("error")
        setMessage(error.detail || "Upload failed")
      }
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Connection error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-card border-border p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Upload File</h3>
          <p className="text-sm text-muted-foreground">{descriptions[agent]}</p>
        </div>

        <div
          className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept={fileTypes[agent].map((ext) => `.${ext}`).join(",")}
            className="hidden"
          />
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">{file ? file.name : "Click to upload or drag and drop"}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {fileTypes[agent].map((ext) => ext.toUpperCase()).join(", ")} files only
          </p>
        </div>

        {status === "success" && (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <p className="text-sm text-green-600">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-600">{message}</p>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Upload & Process"
          )}
        </Button>
      </div>
    </Card>
  )
}
