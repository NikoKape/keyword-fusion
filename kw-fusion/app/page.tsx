'use client'

import { useState } from 'react'
import { RelatedKeywords } from '@/components/features/labs/RelatedKeywords'
import { RelatedKeywordsResults } from '@/components/features/labs/RelatedKeywordsResults'
import { RelatedKeywordsHeader } from '@/components/features/labs/related-keywords-header'
import { KeywordFusion } from '@/components/shared/KeywordFusion'
import { KeywordFormData, RawApiResponse } from '@/types/keywords'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function RelatedKeywordsPage() {
  const [results, setResults] = useState<RawApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
        throw new Error(data.status_message || 'Failed to fetch keyword data')
      }

      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching keyword data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const keywords = results?.tasks?.[0]?.result?.[0]?.items?.map(
    item => item.keyword_data.keyword
  ) || []

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
          <div className="mt-4 flex justify-center">
            <LoadingSpinner />
          </div>
        )}
        {results && <RelatedKeywordsResults rawData={results} />}
        <KeywordFusion keywords={keywords} />
      </div>
    </div>
  )
}
