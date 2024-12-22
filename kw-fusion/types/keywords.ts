export interface KeywordResult {
  keyword: string
  search_volume: number
  cpc: number
  competition: string
  relevance: number
}

export interface KeywordData {
  keyword: string
  results: KeywordResult[]
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
