import { useCallback, useEffect, useState } from 'react'

export interface HistoryEntry {
  id: string
  type: 'encode' | 'decode'
  input: string
  output: string
  timestamp: number
}

const HISTORY_KEY = 'b64:history'
const PRESERVE_KEY = 'b64:preserveHistory'
const MAX_ENTRIES = 200

function readPreserve(): boolean {
  try {
    return localStorage.getItem(PRESERVE_KEY) === 'true'
  } catch {
    return false
  }
}

function loadInitialHistory(): HistoryEntry[] {
  try {
    if (!readPreserve()) {
      // Not preserving: any stale history from a previous run is discarded.
      localStorage.removeItem(HISTORY_KEY)
      return []
    }
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : []
  } catch {
    return []
  }
}

/**
 * Conversion history. Lives in memory while the app runs. It is only written
 * to localStorage when "preserve history" is enabled, so otherwise it is gone
 * the next time the app starts.
 */
export function useHistory() {
  const [preserve, setPreserveState] = useState<boolean>(readPreserve)
  const [history, setHistory] = useState<HistoryEntry[]>(loadInitialHistory)

  useEffect(() => {
    try {
      if (preserve) {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
      } else {
        localStorage.removeItem(HISTORY_KEY)
      }
    } catch {
      // storage full or unavailable; history stays in memory only
    }
  }, [history, preserve])

  const setPreserve = useCallback((value: boolean) => {
    setPreserveState(value)
    try {
      localStorage.setItem(PRESERVE_KEY, String(value))
    } catch {
      // ignore
    }
  }, [])

  const addEntry = useCallback((entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    setHistory((prev) =>
      [{ ...entry, id: crypto.randomUUID(), timestamp: Date.now() }, ...prev].slice(0, MAX_ENTRIES)
    )
  }, [])

  const clearHistory = useCallback(() => setHistory([]), [])

  return { history, addEntry, clearHistory, preserve, setPreserve }
}
