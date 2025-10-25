"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { MessageFormatter } from "./message-formatter"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatInterfaceProps {
  agent: "inventory" | "marketing" | "finance"
}

const suggestions = {
  inventory: ["Show me inventory summary", "What metals do I have in stock?", "What's my total inventory value?"],
  marketing: [
    "Show me my marketing ROI",
    "Which campaigns are performing best?",
    "Summarize recent Facebook Ads performance",
  ],
  finance: ["Show cash flow summary", "List recent invoices", "What price lists do we have?"],
}

export function ChatInterface({ agent }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    // Add user message
    const userMessage: Message = { role: "user", content: message }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, agent }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        const error = await response.json()
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Error: ${error.detail || "Failed to get response"}`,
          },
        ])
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Connection error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-full bg-card border-border">
      {/* Messages Container */}
      <div
        className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-900"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="mb-4 text-4xl">💬</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Start a conversation</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Ask me anything about your {agent} data. Try one of the suggestions below.
            </p>
            <div className="grid grid-cols-1 gap-2 w-full">
              {suggestions[agent].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(suggestion)}
                  className="p-3 text-left text-sm rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex gap-3 animate-in fade-in slide-in-from-bottom-2",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                    AI
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-xs lg:max-w-2xl px-4 py-3 rounded-lg",
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none",
                  )}
                >
                  {message.role === "assistant" ? (
                    <MessageFormatter content={message.content} isAssistant={true} />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
                <div className="bg-muted text-foreground px-4 py-3 rounded-lg rounded-bl-none">
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-card">
        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(input)
              }
            }}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
          />
          <Button
            onClick={() => handleSendMessage(input)}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
