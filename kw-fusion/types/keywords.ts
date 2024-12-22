export interface MonthlySearch {
  year: number
  month: number
  search_volume: number
}

export interface KeywordInfo {
  search_volume: number
  cpc: number
  competition: number
  competition_level: string
  monthly_searches?: MonthlySearch[]
  search_volume_trend?: {
    monthly: number
    quarterly: number
    yearly: number
  }
}

export interface KeywordData {
  keyword: string
  keywordInfo: KeywordInfo
  relatedKeywords: string[]
  monthlyData: Array<{
    month: string
    searchVolume: number
  }>
}

export interface KeywordFormData {
  keyword: string
  location_code: string
  language_code: string
  depth: string
  limit: string
  include_seed_keyword: boolean
  include_serp_info: boolean
  ignore_synonyms: boolean
  include_clickstream_data: boolean
  replace_with_core_keyword: boolean
}

export interface ApiResponse {
  status: number
  message: string
  data: KeywordData[]
}

export interface ApiTask {
  id: string
  status_code: number
  status_message: string
  time: string
  cost: number
  result_count: number
  path: string[]
  data: {
    api: string
    function: string
    se: string
    se_type: string
    language_code: string
    location_code: number
    keyword: string
  }
  result: Array<{
    items: Array<{
      keyword_data: {
        keyword: string
        keyword_info: KeywordInfo
        related_keywords: string[]
      }
    }>
  }>
}
