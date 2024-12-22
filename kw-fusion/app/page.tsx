'use client'

import { useState, useEffect } from 'react'
import { RelatedKeywords } from '@/components/features/labs/RelatedKeywords'
import { RelatedKeywordsResults } from '@/components/features/labs/RelatedKeywordsResults'
import { KeywordFusion } from '@/components/shared/KeywordFusion'
import { HelpCircle, Search, FlaskConical } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

export default function RelatedKeywordsPage() {
  const [results, setResults] = useState<KeywordData | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleFormSubmit = (data: {
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
  }) => {
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
        <div className="max-w-5xl mx-auto mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <FlaskConical className="w-8 h-8 text-purple-500 dark:text-purple-400" />
                <span className="text-lg font-semibold text-purple-500 dark:text-purple-400">Labs</span>
                <span className="mx-2 text-muted-foreground">/</span>
              </div>
              <Search className="w-8 h-8 text-foreground" />
              <h1 className={`
                text-3xl font-bold 
                text-foreground
                transition-all duration-300
                transform hover:scale-[1.02]
                hover:drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]
                dark:hover:drop-shadow-[0_4px_6px_rgba(255,255,255,0.1)]
                inline-block
              `}>
                Related Keywords
              </h1>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button" 
                      className="inline-flex items-center justify-center rounded-full w-5 h-5 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <HelpCircle className="w-5 h-5" />
                      <span className="sr-only">More information about Related Keywords</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="right"
                    className="max-w-[400px] p-4"
                    sideOffset={5}
                  >
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm mb-2">Related Keywords Feature (Labs)</h4>
                      <ul className="list-disc pl-4 space-y-1 text-sm">
                        <li>Discover related keyword opportunities</li>
                        <li>Analyze search volume and trends</li>
                        <li>Explore keyword variations</li>
                        <li>Get AI-powered insights for SEO and PPC</li>
                        <li>Part of our experimental Labs section</li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <p className="text-muted-foreground text-lg">
            Discover valuable related keywords and get AI-powered insights
          </p>
        </div>
        <RelatedKeywords onSubmitAction={handleFormSubmit} />
        {results && <RelatedKeywordsResults data={results} />}
        <KeywordFusion keywords={results ? results.results.map((r: KeywordResult) => r.keyword) : []} />
      </div>
    </div>
  )
}
