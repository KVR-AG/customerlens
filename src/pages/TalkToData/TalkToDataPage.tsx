import { useState, useRef, useEffect } from 'react'
import { TopBar } from '@/components/shell/TopBar'
import { cn } from '@/lib/utils'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

type Period = 'YTD' | 'MTD' | 'WTD'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  chart?: { type: 'bar' | 'line'; data: any[]; dataKey: string; xKey: string; label: string }
  timestamp: Date
}

const CANNED: Record<string, Omit<Message, 'id' | 'role' | 'timestamp'>> = {
  default: {
    text: "I can answer questions about customer loyalty, sales, campaigns, and CX data. Try asking things like:\n• What is the active rate for Gold members YTD?\n• Show CA Revenue by brand this month\n• Which store has the lowest conversion rate in Dubai?\n• How are Points Liability trending vs last year?",
  },
  active_rate: {
    text: "The Active Rate for Gold members YTD is **68.2%**, up +4.1pp vs LY LFL. This is significantly above the overall active rate of 42.1%.\n\nGold members who shopped in the last 90 days: 64,790 out of 95,000.",
    chart: {
      type: 'bar',
      data: [
        { tier: 'Black', value: 84.2 },
        { tier: 'Gold', value: 68.2 },
        { tier: 'Silver', value: 38.4 },
        { tier: 'All', value: 42.1 },
      ],
      dataKey: 'value',
      xKey: 'tier',
      label: 'Active Rate by Tier (%)',
    },
  },
  ca_revenue: {
    text: "CA Revenue by brand YTD (AED Millions):\n\n• R&B Fashion: AED 52.4M (+14.2%)\n• LC Waikiki: AED 28.6M (+10.8%)\n• The Children's Place: AED 18.4M (+9.2%)\n• Skechers: AED 16.2M (+8.4%)\n• ALDO: AED 12.8M (+6.1%)\n• Adidas: AED 10.4M (+18.6%)\n\nTotal CA Revenue: AED 138.8M (+12.4% vs LY LFL)",
    chart: {
      type: 'bar',
      data: [
        { brand: 'R&B Fashion', value: 52.4 },
        { brand: 'LC Waikiki', value: 28.6 },
        { brand: "The Children's Place", value: 18.4 },
        { brand: 'Skechers', value: 16.2 },
        { brand: 'ALDO', value: 12.8 },
        { brand: 'Adidas', value: 10.4 },
      ],
      dataKey: 'value',
      xKey: 'brand',
      label: 'CA Revenue by Brand (AED M)',
    },
  },
  conversion: {
    text: "The store with the lowest CA Conversion in Dubai YTD is **Dubai Festival City - ALDO** at 18.4%, down -4.2pp vs LY.\n\nTop 3 lowest conversion stores in Dubai:\n1. Dubai Festival City - ALDO: 18.4%\n2. Dubai Marina Mall - LC Waikiki: 22.1%\n3. Mirdif City Centre - 6thStreet.com: 23.8%\n\nNote: Footfall at Dubai Festival City is up 6% — this suggests an assortment gap rather than a traffic issue.",
  },
  liability: {
    text: "Points Liability (AED) is trending upward. Current YTD liability is AED 2.84M, up +5.3% vs last year.\n\nAt the current issuance rate, the liability ceiling of AED 3.0M may be breached within approximately 18 days.",
    chart: {
      type: 'line',
      data: [
        { month: 'May', value: 2.42 },
        { month: 'Jun', value: 2.48 },
        { month: 'Jul', value: 2.52 },
        { month: 'Aug', value: 2.58 },
        { month: 'Sep', value: 2.61 },
        { month: 'Oct', value: 2.65 },
        { month: 'Nov', value: 2.71 },
        { month: 'Dec', value: 2.78 },
        { month: 'Jan', value: 2.81 },
        { month: 'Feb', value: 2.79 },
        { month: 'Mar', value: 2.82 },
        { month: 'Apr', value: 2.84 },
      ],
      dataKey: 'value',
      xKey: 'month',
      label: 'Points Liability (AED M)',
    },
  },
}

function classifyQuery(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('active rate') || t.includes('active')) return 'active_rate'
  if (t.includes('ca revenue') || t.includes('revenue by brand')) return 'ca_revenue'
  if (t.includes('conversion') && t.includes('dubai')) return 'conversion'
  if (t.includes('liability') || t.includes('points liability')) return 'liability'
  return 'default'
}

export function TalkToDataPage() {
  const [period, setPeriod] = useState<Period>('YTD')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      text: "Hi! I'm your Customer Lens data assistant. Ask me anything about your loyalty, retail, or CX data.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const sendMessage = async () => {
    if (!input.trim() || thinking) return
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: input.trim(),
      timestamp: new Date(),
    }
    setMessages(m => [...m, userMsg])
    setInput('')
    setThinking(true)

    await new Promise(r => setTimeout(r, 800 + Math.random() * 400))

    const key = classifyQuery(userMsg.text)
    const canned = CANNED[key]
    const botMsg: Message = {
      id: `b-${Date.now()}`,
      role: 'assistant',
      ...canned,
      timestamp: new Date(),
    }
    setMessages(m => [...m, botMsg])
    setThinking(false)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Talk to your Data" period={period} onPeriodChange={setPeriod} />

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn(
              'max-w-[70%] rounded-2xl px-4 py-3',
              msg.role === 'user'
                ? 'bg-primary text-white rounded-br-md'
                : 'bg-surface border border-outline rounded-bl-md'
            )}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[10px] font-bold badge-ai px-2 py-0.5 rounded-full">✦ AI</span>
                  <span className="text-[10px] text-outline-strong">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
              <div className="text-[13px] leading-relaxed whitespace-pre-line">
                {msg.text}
              </div>
              {msg.chart && (
                <div className="mt-3">
                  <div className="text-[11px] font-semibold text-outline-strong mb-2">{msg.chart.label}</div>
                  <ResponsiveContainer width="100%" height={160}>
                    {msg.chart.type === 'bar' ? (
                      <BarChart data={msg.chart.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
                        <XAxis dataKey={msg.chart.xKey} tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                        <Bar dataKey={msg.chart.dataKey} fill="#0058bc" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    ) : (
                      <LineChart data={msg.chart.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
                        <XAxis dataKey={msg.chart.xKey} tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                        <Line type="monotone" dataKey={msg.chart.dataKey} stroke="#0058bc" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex justify-start">
            <div className="bg-surface border border-outline rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-outline bg-surface px-6 py-4">
        <div className="max-w-3xl mx-auto space-y-3">
          {/* Quick suggestions */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2">
              {[
                'Active rate for Gold members YTD?',
                'CA Revenue by brand this month',
                'Points Liability trend vs LY',
              ].map(q => (
                <button
                  type="button"
                  key={q}
                  onClick={() => setInput(q)}
                  className="focus-ring text-[11px] bg-surface border border-outline rounded-full px-3 py-1.5 text-secondary hover:bg-surface-low hover:text-on-surface transition-colors whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about your data... (e.g. 'What is the active rate for Gold members?')"
            className="focus-ring flex-1 h-11 border border-outline rounded-xl px-4 text-[13px] text-on-surface focus:border-primary"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={!input.trim() || thinking}
            aria-label="Send message"
            className="focus-ring h-11 w-11 bg-primary rounded-xl flex items-center justify-center text-white hover:bg-primary-hover disabled:opacity-40 transition-colors"
          >
            ↑
          </button>
          </div>
        </div>
      </div>
    </div>
  )
}
