import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { ArrowUpDown, Activity, Download, BarChart2 } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { RawApiResponse, TransformedApiResponse } from '@/types/keywords'

interface RelatedKeywordsResultsProps {
  rawData: RawApiResponse
}

export function RelatedKeywordsResults({ rawData }: RelatedKeywordsResultsProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  }>({
    key: 'search_volume',
    direction: 'desc'
  })
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])

  // Transform raw API data to our UI format with proper null checks
  const transformedData: TransformedApiResponse = {
    status: rawData.status_code ?? 0,
    message: rawData.status_message ?? '',
    data: rawData.tasks?.[0]?.result?.[0]?.items?.map(item => ({
      keyword: item.keyword_data?.keyword ?? '',
      keywordInfo: {
        search_volume: item.keyword_data?.keyword_info?.search_volume ?? 0,
        cpc: item.keyword_data?.keyword_info?.cpc ?? 0,
        competition: item.keyword_data?.keyword_info?.competition ?? 0,
        competition_level: item.keyword_data?.keyword_info?.competition_level ?? 'unknown',
        difficulty: item.keyword_data?.keyword_properties?.keyword_difficulty ?? 0,
        intent: {
          main: item.keyword_data?.search_intent_info?.main_intent ?? '',
          foreign: item.keyword_data?.search_intent_info?.foreign_intent ?? null
        },
        low_top_of_page_bid: item.keyword_data?.keyword_info?.low_top_of_page_bid ?? 0,
        high_top_of_page_bid: item.keyword_data?.keyword_info?.high_top_of_page_bid ?? 0,
      },
      relatedKeywords: item.keyword_data?.related_keywords ?? [],
      monthlyData: (item.keyword_data?.keyword_info?.monthly_searches ?? []).map(search => ({
        month: `${search.year}-${search.month.toString().padStart(2, '0')}`,
        searchVolume: search.search_volume
      }))
    })) ?? []
  }

  if (!transformedData.data?.length) {
    return null
  }

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc'
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc'
    }
    setSortConfig({ key, direction })
  }

  const sortedResults = [...transformedData.data].sort((a, b) => {
    if (!a.keywordInfo || !b.keywordInfo) return 0
    
    const aValue = typeof a.keywordInfo[sortConfig.key as keyof typeof a.keywordInfo] === 'number'
      ? (a.keywordInfo[sortConfig.key as keyof typeof a.keywordInfo] as number)
      : 0
    const bValue = typeof b.keywordInfo[sortConfig.key as keyof typeof b.keywordInfo] === 'number'
      ? (b.keywordInfo[sortConfig.key as keyof typeof b.keywordInfo] as number)
      : 0
    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
  })

  const getChartData = () => {
    if (!selectedKeywords.length || !transformedData.data?.length) return []

    const selectedItems = transformedData.data.filter(item => 
      selectedKeywords.includes(item.keyword)
    )

    const allMonths = new Set<string>()
    selectedItems.forEach(item => {
      item.monthlyData?.forEach(data => {
        allMonths.add(data.month)
      })
    })

    return Array.from(allMonths).sort().map(month => {
      const entry: { [key: string]: number | string } = { month }
      selectedItems.forEach(item => {
        const monthData = item.monthlyData?.find(d => d.month === month)
        const searchVolume = monthData?.searchVolume
        entry[item.keyword] = typeof searchVolume === 'number' ? searchVolume : 0
      })
      return entry
    })
  }

  const toggleKeywordSelection = (keyword: string) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    )
  }

  const getCompetitionColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 80) return 'bg-red-100 text-red-800 border-red-200'
    if (difficulty >= 60) return 'bg-orange-100 text-orange-800 border-orange-200'
    if (difficulty >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (difficulty >= 20) return 'bg-blue-100 text-blue-800 border-blue-200'
    return 'bg-green-100 text-green-800 border-green-200'
  }

  const exportToCsv = () => {
    if (!transformedData.data?.length) return

    const headers = ['Keyword', 'Search Volume', 'Difficulty', 'CPC', 'CPC Range', 'Competition', 'Intent']
    const csvData = sortedResults.map(result => [
      result.keyword,
      result.keywordInfo.search_volume,
      result.keywordInfo.difficulty,
      result.keywordInfo.cpc,
      `${result.keywordInfo.low_top_of_page_bid} - ${result.keywordInfo.high_top_of_page_bid}`,
      result.keywordInfo.competition_level,
      `${result.keywordInfo.intent.main}${result.keywordInfo.intent.foreign ? ' + ' + result.keywordInfo.intent.foreign.join(', ') : ''}`
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `keyword-results-${transformedData.data[0].keyword}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const chartData = getChartData()

  return (
    <Card className="mt-8">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Results for <span className="text-primary">"{transformedData.data[0].keyword}"</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Found {transformedData.data.length} related keywords
            </p>
          </div>
          <Button onClick={exportToCsv} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {selectedKeywords.length > 0 && (
          <Card className="bg-gradient-to-br from-background via-muted/50 to-background border shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Search Volume Trends</h3>
              <Badge variant="secondary">
                {selectedKeywords.length} keyword{selectedKeywords.length > 1 ? 's' : ''} selected
              </Badge>
            </div>
            <div className="h-[400px]">
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
                      stroke={`hsl(${index * (360 / selectedKeywords.length)}, 70%, 50%)`}
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        <ScrollArea className="rounded-md border">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium">
                    <button className="flex items-center hover:text-primary transition-colors" onClick={() => requestSort('keyword')}>
                      KEYWORD <ArrowUpDown className="ml-1 h-4 w-4" />
                    </button>
                  </th>
                  <th className="text-center py-3 px-4 font-medium">
                    <button className="flex items-center justify-center mx-auto hover:text-primary transition-colors" onClick={() => requestSort('search_volume')}>
                      SEARCH VOLUME <ArrowUpDown className="ml-1 h-4 w-4" />
                    </button>
                  </th>
                  <th className="text-center py-3 px-4 font-medium">
                    <button className="flex items-center justify-center mx-auto hover:text-primary transition-colors" onClick={() => requestSort('difficulty')}>
                      DIFFICULTY <ArrowUpDown className="ml-1 h-4 w-4" />
                    </button>
                  </th>
                  <th className="text-center py-3 px-4 font-medium">
                    <button className="flex items-center justify-center mx-auto hover:text-primary transition-colors" onClick={() => requestSort('competition')}>
                      COMPETITION <ArrowUpDown className="ml-1 h-4 w-4" />
                    </button>
                  </th>
                  <th className="text-center py-3 px-4 font-medium">
                    <button className="flex items-center justify-center mx-auto hover:text-primary transition-colors" onClick={() => requestSort('cpc')}>
                      CPC <ArrowUpDown className="ml-1 h-4 w-4" />
                    </button>
                  </th>
                  <th className="text-center py-3 px-4 font-medium">CPC RANGE</th>
                  <th className="text-center py-3 px-4 font-medium">INTENT</th>
                  <th className="text-center py-3 px-4 font-medium">TRENDS</th>
                </tr>
              </thead>
              <tbody>
                {sortedResults.map((result, index) => (
                  <tr
                    key={result.keyword}
                    className={cn(
                      "border-b transition-colors hover:bg-muted/50",
                      index % 2 === 0 ? "bg-background" : "bg-muted/30"
                    )}
                  >
                    <td className="py-4 px-4 font-medium">{result.keyword}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-blue-400 dark:text-blue-300">
                        <Activity className="h-4 w-4" />
                        {result.keywordInfo.search_volume.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "font-mono",
                            getDifficultyColor(result.keywordInfo.difficulty)
                          )}
                        >
                          {result.keywordInfo.difficulty}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <Badge 
                          variant="outline"
                          className={cn(
                            "capitalize border",
                            getCompetitionColor(result.keywordInfo.competition_level)
                          )}
                        >
                          {result.keywordInfo.competition_level.toLowerCase()}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="text-green-600 font-medium">
                        ${result.keywordInfo.cpc.toFixed(2)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {(result.keywordInfo.low_top_of_page_bid !== undefined && result.keywordInfo.high_top_of_page_bid !== undefined) ? (
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <div className="flex flex-col items-center">
                            <span className="text-[11px] text-muted-foreground mb-0.5">Low</span>
                            <span className="text-green-600/80 font-medium">
                              ${result.keywordInfo.low_top_of_page_bid.toFixed(2)}
                            </span>
                          </div>
                          <div className="h-[2px] w-6 bg-muted-foreground/20 mt-4" />
                          <div className="flex flex-col items-center">
                            <span className="text-[11px] text-muted-foreground mb-0.5">High</span>
                            <span className="text-green-600 font-medium">
                              ${result.keywordInfo.high_top_of_page_bid.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11px] text-muted-foreground">-</div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center justify-center text-sm">
                        <Badge variant="secondary" className="font-normal">
                          {result.keywordInfo.intent.main}
                        </Badge>
                        {result.keywordInfo.intent.foreign && (
                          <span className="mt-1 text-muted-foreground">
                            + {result.keywordInfo.intent.foreign.join(', ')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <Button
                          variant={selectedKeywords.includes(result.keyword) ? "outline" : "outline"}
                          size="sm"
                          onClick={() => toggleKeywordSelection(result.keyword)}
                          className={cn(
                            "gap-2",
                            selectedKeywords.includes(result.keyword) 
                              ? "hover:bg-red-100 border-red-200 text-red-700 hover:text-red-800 hover:border-red-300" 
                              : ""
                          )}
                        >
                          <BarChart2 className="h-4 w-4" />
                          {selectedKeywords.includes(result.keyword) ? 'Remove' : 'Add'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </div>
    </Card>
  )
}
