'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, TrendingUp, Zap, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface KeywordResult {
  keyword: string
  search_volume: number
  cpc: number
  competition: string
  relevance: number
}

interface KeywordData {
  keyword: string
  results: KeywordResult[]
}

interface ChartDataEntry {
  month: string
  [key: string]: string | number  // Index signature for dynamic keyword properties
}

interface RelatedKeywordsResultsProps {
  data: KeywordData
}

// Mock monthly data for the chart
const generateMockMonthlyData = (keyword: string, baseVolume: number): ChartDataEntry[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months.map(month => ({
    month,
    [keyword]: Math.floor(baseVolume * (0.8 + Math.random() * 0.4))
  }))
}

export function RelatedKeywordsResults({ data }: RelatedKeywordsResultsProps) {
  // State hooks
  const [mounted, setMounted] = useState(false)
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: keyof KeywordResult; direction: 'asc' | 'desc' } | null>(null)
  const [chartMetric, setChartMetric] = useState<'search_volume' | 'cpc'>('search_volume')
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '12m'>('12m')

  // Memoized values
  const sortedResults = useMemo(() => {
    if (!mounted) return []
    let sortableItems = [...data.results]
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [data.results, sortConfig, mounted])

  const chartData = useMemo(() => {
    if (!mounted) return []
    const baseData = generateMockMonthlyData(data.keyword, data.results[0].search_volume)
    const monthsToShow = timeRange === '1m' ? 1 : timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : 12
    return baseData.slice(-monthsToShow).map(entry => {
      const additionalData: { [key: string]: number } = selectedKeywords.reduce((acc: { [key: string]: number }, keyword) => {
        const result = data.results.find(r => r.keyword === keyword)
        if (result) {
          acc[keyword] = chartMetric === 'search_volume'
            ? Math.floor(result.search_volume * (0.8 + Math.random() * 0.4))
            : result.cpc * (0.8 + Math.random() * 0.4)
        }
        return acc
      }, {})
      return { ...entry, ...additionalData }
    })
  }, [data, selectedKeywords, timeRange, chartMetric, mounted])

  // Effects
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const requestSort = (key: keyof KeywordResult) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const exportToCsv = () => {
    const headers = ['Keyword', 'Search Volume', 'CPC', 'Competition', 'Relevance']
    const csvData = sortedResults.map(result => [
      result.keyword,
      result.search_volume,
      result.cpc,
      result.competition,
      `${result.relevance}%`
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `keyword-results-${data.keyword}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const toggleKeywordSelection = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    )
  }

  return (
    <Card className="mt-8 bg-card text-card-foreground">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">
              Results for: <span className="text-primary">"{data.keyword}"</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Found {data.results.length} related keywords
            </p>
          </div>
          <Button
            onClick={exportToCsv}
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export to CSV
          </Button>
        </div>

        <div className="relative overflow-x-auto mb-6 rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-3 px-4 font-medium">
                  <button className="flex items-center" onClick={() => requestSort('keyword')}>
                    KEYWORD <ArrowUpDown className="ml-1 h-4 w-4" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium">
                  <button className="flex items-center" onClick={() => requestSort('search_volume')}>
                    SEARCH VOLUME <ArrowUpDown className="ml-1 h-4 w-4" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium">
                  <button className="flex items-center" onClick={() => requestSort('cpc')}>
                    CPC <ArrowUpDown className="ml-1 h-4 w-4" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium">
                  <button className="flex items-center" onClick={() => requestSort('competition')}>
                    COMPETITION <ArrowUpDown className="ml-1 h-4 w-4" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium">
                  <button className="flex items-center" onClick={() => requestSort('relevance')}>
                    RELEVANCE <ArrowUpDown className="ml-1 h-4 w-4" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium">CHART</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((result, index) => (
                <tr
                  key={index}
                  className={cn(
                    "border-t border-border",
                    index % 2 === 0 ? "bg-background" : "bg-muted/30"
                  )}
                >
                  <td className="py-4 px-4">{result.keyword}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      {result.search_volume.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center text-green-600">
                      <span className="mr-1">$</span>
                      {result.cpc.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      result.competition === "LOW" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                      result.competition === "MEDIUM" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                      result.competition === "HIGH" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    )}>
                      {result.competition}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      {result.relevance.toFixed(1)}%
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleKeywordSelection(result.keyword)}
                      className={cn(
                        selectedKeywords.includes(result.keyword) && "bg-primary text-primary-foreground"
                      )}
                    >
                      {selectedKeywords.includes(result.keyword) ? 'Remove' : 'Add to Chart'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Keyword Trends</h3>
          <div className="flex gap-4">
            <Select value={chartMetric} onValueChange={(value: 'search_volume' | 'cpc') => setChartMetric(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="search_volume">Search Volume</SelectItem>
                <SelectItem value="cpc">CPC</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={(value: '1m' | '3m' | '6m' | '12m') => setTimeRange(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="12m">Last 12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="h-[400px] mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedKeywords.map((keyword, index) => (
                <Line
                  key={keyword}
                  type="monotone"
                  dataKey={keyword}
                  stroke={`hsl(${index * 30}, 70%, 50%)`}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
