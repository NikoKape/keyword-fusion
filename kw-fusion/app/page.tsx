'use client'

import { useState, useEffect } from 'react'
import { RelatedKeywords } from '@/components/features/labs/RelatedKeywords'
import { RelatedKeywordsResults } from '@/components/features/labs/RelatedKeywordsResults'
import { KeywordFusion } from '@/components/shared/KeywordFusion'
import { RelatedKeywordsHeader } from '@/components/features/labs/related-keywords-header'
import { KeywordFormData } from '@/types/keywords'

interface ApiResponse {
  status: number
  message: string
  data: Array<{
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
  }>
}

export default function RelatedKeywordsPage() {
  const [results, setResults] = useState<ApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Component mounted
  }, [])

  const handleFormSubmit = async (formData: KeywordFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/labs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch keyword data')
      }

      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching keyword data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto">
      <div className="py-8">
        <RelatedKeywordsHeader />
        <RelatedKeywords onSubmitAction={handleFormSubmit} />
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="mt-4 p-4 text-center">
            Loading...
          </div>
        )}
        {results && <RelatedKeywordsResults data={results} />}
        <KeywordFusion 
          keywords={results?.data.map(item => item.keyword) || []} 
        />
      </div>
    </div>
  )
}
