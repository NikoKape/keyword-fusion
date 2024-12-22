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
  keywordInfo: {
    search_volume: number
    cpc: number
    competition: number
    competition_level: string
  }
  relatedKeywords: string[]
  monthlyData: Array<{
    month: string
    searchVolume: number
  }>
}

interface RelatedKeywordsResultsProps {
  data: {
    status: number
    message: string
    data: KeywordResult[]
  }
}

export function RelatedKeywordsResults({ data }: RelatedKeywordsResultsProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'search_volume',
    direction: 'desc'
  })
  const [chartMetric, setChartMetric] = useState<'search_volume' | 'cpc'>('search_volume')
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '12m'>('12m')

  useEffect(() => {
    setMounted(true)
  }, [])

  const sortedResults = useMemo(() => {
    if (!data?.data) return []
    
    return [...data.data].sort((a, b) => {
      const aValue = typeof a.keywordInfo[sortConfig.key as keyof typeof a.keywordInfo] === 'number'
        ? (a.keywordInfo[sortConfig.key as keyof typeof a.keywordInfo] as number)
        : 0
      const bValue = typeof b.keywordInfo[sortConfig.key as keyof typeof b.keywordInfo] === 'number'
        ? (b.keywordInfo[sortConfig.key as keyof typeof b.keywordInfo] as number)
        : 0
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
    })
  }, [data, sortConfig])

  const chartData = useMemo(() => {
    if (!selectedKeywords.length || !data?.data) return []

    const selectedItems = data.data.filter(item => 
      selectedKeywords.includes(item.keyword)
    )

    const allMonths = new Set<string>()
    selectedItems.forEach(item => {
      if (Array.isArray(item.monthlyData)) {
        item.monthlyData.forEach(data => {
          if (typeof data.month === 'string') {
            allMonths.add(data.month)
          }
        })
      }
    })

    return Array.from(allMonths).sort().map(month => {
      const entry: { [key: string]: string | number } = { month }
      selectedItems.forEach(item => {
        if (Array.isArray(item.monthlyData)) {
          const monthData = item.monthlyData.find(d => d.month === month)
          const searchVolume = monthData?.searchVolume
          if (typeof searchVolume === 'number') {
            entry[item.keyword] = searchVolume
          } else {
            entry[item.keyword] = 0
          }
        }
      })
      return entry
    })
  }, [selectedKeywords, data])

  const requestSort = (key: string) => {
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
      result.keywordInfo.search_volume,
      result.keywordInfo.cpc,
      result.keywordInfo.competition_level,
      `${result.keywordInfo.competition}%`
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `keyword-results-${data.data[0].keyword}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const toggleKeywordSelection = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(prev => prev.filter(k => k !== keyword))
    } else {
      setSelectedKeywords(prev => [...prev, keyword])
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <Card className="mt-8 bg-card text-card-foreground">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">
              Results for: <span className="text-primary">"{data.data[0].keyword}"</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Found {data.data.length} related keywords
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
                      {result.keywordInfo.search_volume.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center text-green-600">
                      <span className="mr-1">$</span>
                      {result.keywordInfo.cpc.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      result.keywordInfo.competition_level === "HIGH" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                      result.keywordInfo.competition_level === "MEDIUM" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                      result.keywordInfo.competition_level === "LOW" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    )}>
                      {result.keywordInfo.competition_level.toLowerCase()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleKeywordSelection(result.keyword)}
                      className={cn(
                        selectedKeywords.includes(result.keyword) && "bg-primary text-primary-foreground hover:bg-primary/90"
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

        {selectedKeywords.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Search Volume Trends</h3>
              <div className="flex gap-4">
                <Select
                  value={timeRange}
                  onValueChange={(value: '1m' | '3m' | '6m' | '12m') => setTimeRange(value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Time Range" />
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

            <div className="h-[400px] mt-4">
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
                      stroke={`hsl(${index * 360 / selectedKeywords.length}, 70%, 50%)`}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
