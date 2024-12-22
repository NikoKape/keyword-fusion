'use client'

import { useState, useEffect } from 'react'
import { RelatedKeywords } from '@/components/features/labs/RelatedKeywords'
import { RelatedKeywordsResults } from '@/components/features/labs/RelatedKeywordsResults'
import { KeywordFusion } from '@/components/shared/KeywordFusion'
import { RelatedKeywordsHeader } from '@/components/features/labs/related-keywords-header'
import { KeywordData, KeywordResult, KeywordFormData } from '@/types/keywords'

export default function RelatedKeywordsPage() {
  const [results, setResults] = useState<KeywordData | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleFormSubmit = (data: KeywordFormData) => {
    // TODO: Make API call here
    const mockData: KeywordData = {
      keyword: data.keyword,
      results: [
        {
          keyword: data.keyword,
          search_volume: 1000,
          cpc: 0.5,
          competition: "LOW",
          relevance: 100
        }
      ]
    }
    setResults(mockData)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto">
      <div className="py-8">
        <RelatedKeywordsHeader />
        <RelatedKeywords onSubmitAction={handleFormSubmit} />
        {results && <RelatedKeywordsResults data={results} />}
        <KeywordFusion keywords={results ? results.results.map((r: KeywordResult) => r.keyword) : []} />
      </div>
    </div>
  )
}
