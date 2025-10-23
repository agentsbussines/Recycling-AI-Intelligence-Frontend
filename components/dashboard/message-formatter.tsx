"use client"

import type React from "react"

interface MessageFormatterProps {
  content: string
  isAssistant?: boolean
}

export function MessageFormatter({ content, isAssistant = false }: MessageFormatterProps) {
  // Parse content into structured blocks
  const parseContent = (text: string) => {
    const blocks: Array<{ type: string; content: string | string[][] }> = []
    const lines = text.split("\n")
    let i = 0

    while (i < lines.length) {
      const line = lines[i]

      // Check for table
      if (line.includes("|") && i + 1 < lines.length && lines[i + 1].includes("|")) {
        const tableLines = [line]
        i++
        tableLines.push(lines[i])
        i++

        while (i < lines.length && lines[i].includes("|")) {
          tableLines.push(lines[i])
          i++
        }

        blocks.push({ type: "table", content: tableLines })
        continue
      }

      // Check for code block
      if (line.trim().startsWith("```")) {
        const codeLines = []
        i++
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeLines.push(lines[i])
          i++
        }
        if (i < lines.length) i++ // skip closing ```
        blocks.push({ type: "code", content: codeLines.join("\n") })
        continue
      }

      // Check for bullet list
      if (line.trim().match(/^[-*•]\s/)) {
        const listItems = []
        while (i < lines.length && lines[i].trim().match(/^[-*•]\s/)) {
          listItems.push(lines[i].trim().substring(2))
          i++
        }
        blocks.push({ type: "list", content: listItems })
        continue
      }

      // Check for numbered list
      if (line.trim().match(/^\d+\.\s/)) {
        const listItems = []
        while (i < lines.length && lines[i].trim().match(/^\d+\.\s/)) {
          listItems.push(lines[i].trim().replace(/^\d+\.\s/, ""))
          i++
        }
        blocks.push({ type: "numbered-list", content: listItems })
        continue
      }

      // Regular paragraph
      if (line.trim()) {
        let paragraph = line
        i++
        while (
          i < lines.length &&
          !lines[i].trim().match(/^[-*•]|\d+\./) &&
          !lines[i].includes("|") &&
          !lines[i].trim().startsWith("```")
        ) {
          if (lines[i].trim()) {
            paragraph += " " + lines[i].trim()
          }
          i++
        }
        blocks.push({ type: "paragraph", content: paragraph })
        continue
      }

      i++
    }

    return blocks
  }

  const blocks = parseContent(content)

  const renderTable = (lines: string[]) => {
    const rows = lines.map((line) =>
      line
        .split("|")
        .map((cell) => cell.trim())
        .filter(Boolean),
    )

    if (rows.length < 2) return null

    const headers = rows[0]
    const dataRows = rows.slice(2) // Skip header and separator

    return (
      <div className="overflow-x-auto my-3 rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className="px-4 py-2 text-left font-semibold text-foreground">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, rowIdx) => (
              <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-4 py-2 text-foreground">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderCode = (code: string) => {
    return (
      <div className="my-3 rounded-lg bg-muted border border-border overflow-hidden">
        <div className="bg-muted-foreground/10 px-4 py-2 text-xs font-semibold text-muted-foreground">Code</div>
        <pre className="px-4 py-3 overflow-x-auto">
          <code className="text-sm text-foreground font-mono">{code}</code>
        </pre>
      </div>
    )
  }

  const renderList = (items: string[]) => {
    return (
      <ul className="my-3 space-y-2 ml-4">
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-3 text-foreground">
            <span className="text-blue-500 font-bold flex-shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }

  const renderNumberedList = (items: string[]) => {
    return (
      <ol className="my-3 space-y-2 ml-4">
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-3 text-foreground">
            <span className="text-blue-500 font-bold flex-shrink-0 min-w-fit">{idx + 1}.</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    )
  }

  const renderParagraph = (text: string) => {
    // Handle bold, italic, and inline code
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    const regex = /\*\*(.*?)\*\*|__(.*?)__|_(.*?)_|\*(.*?)\*|`(.*?)`/g
    let match

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }

      if (match[1]) {
        parts.push(
          <strong key={match.index} className="font-bold text-foreground">
            {match[1]}
          </strong>,
        )
      } else if (match[2]) {
        parts.push(
          <strong key={match.index} className="font-bold text-foreground">
            {match[2]}
          </strong>,
        )
      } else if (match[3]) {
        parts.push(
          <em key={match.index} className="italic text-foreground">
            {match[3]}
          </em>,
        )
      } else if (match[4]) {
        parts.push(
          <em key={match.index} className="italic text-foreground">
            {match[4]}
          </em>,
        )
      } else if (match[5]) {
        parts.push(
          <code key={match.index} className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground">
            {match[5]}
          </code>,
        )
      }

      lastIndex = regex.lastIndex
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return <p className="text-foreground leading-relaxed my-2">{parts}</p>
  }

  return (
    <div className="space-y-2">
      {blocks.map((block, idx) => {
        if (block.type === "table") {
          return <div key={idx}>{renderTable(block.content as string[])}</div>
        }
        if (block.type === "code") {
          return <div key={idx}>{renderCode(block.content as string)}</div>
        }
        if (block.type === "list") {
          return <div key={idx}>{renderList(block.content as string[])}</div>
        }
        if (block.type === "numbered-list") {
          return <div key={idx}>{renderNumberedList(block.content as string[])}</div>
        }
        if (block.type === "paragraph") {
          return <div key={idx}>{renderParagraph(block.content as string)}</div>
        }
        return null
      })}
    </div>
  )
}
