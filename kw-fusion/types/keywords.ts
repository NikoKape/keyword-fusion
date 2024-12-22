// Raw API Response Types
export interface RawKeywordInfo {
  se_type: string
  last_updated_time: string
  competition: number
  competition_level: string
  cpc: number
  search_volume: number
  monthly_searches: Array<{
    year: number
    month: number
    search_volume: number
  }>
}

export interface RawKeywordProperties {
  keyword_difficulty: number
  core_keyword: string | null
  detected_language: string
}

export interface RawSearchIntentInfo {
  main_intent: string
  foreign_intent: string[] | null
  last_updated_time: string
}

export interface RawKeywordData {
  keyword: string
  keyword_info: RawKeywordInfo
  keyword_properties: RawKeywordProperties
  search_intent_info: RawSearchIntentInfo
  related_keywords: string[]
}

export interface RawApiResponse {
  status_code: number
  status_message: string
  tasks: Array<{
    result: Array<{
      items: Array<{
        keyword_data: RawKeywordData
      }>
    }>
  }>
}

// Transformed Types for UI
export interface KeywordInfo {
  search_volume: number
  cpc: number
  competition: number
  competition_level: string
  difficulty: number
  intent: {
    main: string
    foreign: string[] | null
  }
}

export interface TransformedKeyword {
  keyword: string
  keywordInfo: KeywordInfo
  relatedKeywords: string[]
  monthlyData: Array<{
    month: string
    searchVolume: number
  }>
}

export interface TransformedApiResponse {
  status: number
  message: string
  data: TransformedKeyword[]
}

// Form Types
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
