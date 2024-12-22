import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowUpDown, TrendingUp } from 'lucide-react'
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
import { RawApiResponse, TransformedApiResponse, TransformedKeyword } from '@/types/keywords'

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
        }
      },
      relatedKeywords: item.keyword_data?.related_keywords ?? [],
      monthlyData: (item.keyword_data?.keyword_info?.monthly_searches ?? []).map(search => ({
        month: `${search.year}-${search.month.toString().padStart(2, '0')}`,
        searchVolume: search.search_volume
      }))
    })) ?? []
  }

  // Early return if no data
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

    const sortedMonths = Array.from(allMonths).sort()

    return sortedMonths.map(month => {
      const entry: { [key: string]: number | string } = {
        month
      }

      selectedItems.forEach(item => {
        const monthData = item.monthlyData?.find(d => d.month === month)
        const searchVolume = monthData?.searchVolume
        if (typeof searchVolume === 'number') {
          entry[item.keyword] = searchVolume
        } else {
          entry[item.keyword] = 0
        }
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
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const exportToCsv = () => {
    if (!transformedData.data?.length) return

    const headers = ['Keyword', 'Search Volume', 'Difficulty', 'CPC', 'Competition', 'Intent']
    const csvData = sortedResults.map(result => [
      result.keyword,
      result.keywordInfo.search_volume,
      result.keywordInfo.difficulty,
      result.keywordInfo.cpc,
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
    <div className="mt-8">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">
                Results for: <span className="text-primary">"{transformedData.data[0].keyword}"</span>
              </h2>
              <p className="text-sm text-muted-foreground">
                Found {transformedData.data.length} related keywords
              </p>
            </div>
            <Button onClick={exportToCsv}>Export to CSV</Button>
          </div>

          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr>
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
                    <button className="flex items-center" onClick={() => requestSort('difficulty')}>
                      DIFFICULTY <ArrowUpDown className="ml-1 h-4 w-4" />
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
                    INTENT
                  </th>
                  <th className="text-left py-3 px-4 font-medium">CHART</th>
                </tr>
              </thead>
              <tbody>
                {sortedResults.map((result, index) => (
                  <tr
                    key={result.keyword}
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
                      <div className="text-sm">
                        {result.keywordInfo.difficulty}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <span className="mr-1">$</span>
                        {result.keywordInfo.cpc.toFixed(2)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getCompetitionColor(result.keywordInfo.competition_level)
                      )}>
                        {result.keywordInfo.competition_level.toLowerCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        {result.keywordInfo.intent.main}
                        {result.keywordInfo.intent.foreign && (
                          <span className="text-muted-foreground"> + {result.keywordInfo.intent.foreign.join(', ')}</span>
                        )}
                      </div>
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
              <h3 className="text-lg font-semibold mb-4">Search Volume Trends</h3>
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
                        stroke={`hsl(${index * 360 / selectedKeywords.length}, 70%, 50%)`}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
