import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { Copy, RotateCcw, ArrowUpDown, Trash2 } from 'lucide-react'
import { useHistory, type HistoryEntry } from '../lib/useHistory'

const truncate = (s: string, n = 60) => (s.length > n ? s.slice(0, n) + '…' : s)

interface ConversionResult {
  success: boolean
  message: string
}

export function Base64Converter() {
  const [plainText, setPlainText] = useState('')
  const [base64Text, setBase64Text] = useState('')
  const [alert, setAlert] = useState<ConversionResult | null>(null)
  const { history, addEntry, clearHistory, preserve, setPreserve } = useHistory()

  const restoreEntry = (entry: HistoryEntry) => {
    if (entry.type === 'encode') {
      setPlainText(entry.input)
      setBase64Text(entry.output)
    } else {
      setBase64Text(entry.input)
      setPlainText(entry.output)
    }
  }

  const showAlert = (result: ConversionResult) => {
    setAlert(result)
    setTimeout(() => setAlert(null), 3000)
  }

  const encodeToBase64 = () => {
    try {
      if (!plainText.trim()) {
        showAlert({ success: false, message: 'Please enter some text to encode' })
        return
      }
      const encoded = btoa(plainText)
      setBase64Text(encoded)
      addEntry({ type: 'encode', input: plainText, output: encoded })
      showAlert({ success: true, message: 'Text encoded successfully!' })
    } catch (error) {
      showAlert({ success: false, message: 'Failed to encode text' })
    }
  }

  const decodeFromBase64 = () => {
    try {
      if (!base64Text.trim()) {
        showAlert({ success: false, message: 'Please enter base64 text to decode' })
        return
      }
      const decoded = atob(base64Text)
      setPlainText(decoded)
      addEntry({ type: 'decode', input: base64Text, output: decoded })
      showAlert({ success: true, message: 'Base64 decoded successfully!' })
    } catch (error) {
      showAlert({ success: false, message: 'Invalid base64 string' })
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showAlert({ success: true, message: `${type} copied to clipboard!` })
    } catch (error) {
      showAlert({ success: false, message: 'Failed to copy to clipboard' })
    }
  }

  const clearAll = () => {
    setPlainText('')
    setBase64Text('')
    showAlert({ success: true, message: 'All fields cleared!' })
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Base64 Encoder/Decoder</h1>
          <p className="text-muted-foreground text-lg">
            Simple and secure tool to encode and decode base64 strings
          </p>
        </div>

        {alert && (
          <Alert variant={alert.success ? "default" : "destructive"}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Plain Text
              </CardTitle>
              <CardDescription>
                Enter your text here to encode it to base64
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plaintext">Text Input</Label>
                <Textarea
                  id="plaintext"
                  placeholder="Enter text to encode..."
                  value={plainText}
                  onChange={(e) => setPlainText(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={encodeToBase64} className="flex-1">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Encode to Base64
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(plainText, 'Plain text')}
                  disabled={!plainText}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Base64
              </CardTitle>
              <CardDescription>
                Enter base64 string here to decode it to plain text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="base64">Base64 Input</Label>
                <Textarea
                  id="base64"
                  placeholder="Enter base64 to decode..."
                  value={base64Text}
                  onChange={(e) => setBase64Text(e.target.value)}
                  className="min-h-[200px] resize-none font-mono"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={decodeFromBase64} className="flex-1">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Decode from Base64
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(base64Text, 'Base64')}
                  disabled={!base64Text}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button variant="outline" onClick={clearAll}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>History</CardTitle>
                <CardDescription>
                  Conversions from this session. Click an entry to restore it.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearHistory}
                disabled={history.length === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear history
              </Button>
            </div>
            <label className="flex items-center gap-2 pt-2 text-sm">
              <input
                type="checkbox"
                checked={preserve}
                onChange={(e) => setPreserve(e.target.checked)}
              />
              Preserve history when the app starts
            </label>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">No conversions yet.</p>
            ) : (
              <ul className="max-h-64 space-y-2 overflow-y-auto">
                {history.map((entry) => (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => restoreEntry(entry)}
                      className="w-full rounded-md border p-2 text-left text-sm hover:bg-accent"
                    >
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span className="uppercase">{entry.type}</span>
                        <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="font-mono">
                        {truncate(entry.input)} → {truncate(entry.output)}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <footer className="text-center text-sm text-muted-foreground">
          <p>Built with React, TypeScript, and shadcn/ui</p>
        </footer>
      </div>
    </div>
  )
}
