'use client'

import { HelpCircle, Search, FlaskConical } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function RelatedKeywordsHeader() {
  return (
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
                className="max-w-[350px] p-5 rounded-lg shadow-lg"
                sideOffset={5}
              >
                <div className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex flex-col">
                      <span className="font-semibold text-purple-500">Explore Up to 4,680 Keywords</span>
                      <span className="text-sm text-muted-foreground">Discover a wide range of related search terms</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="font-semibold text-purple-500">Analyze Trends</span>
                      <span className="text-sm text-muted-foreground">Gain insights with monthly and 12-month search trends</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="font-semibold text-purple-500">Performance Metrics</span>
                      <span className="text-sm text-muted-foreground">View daily impressions, clicks, and CPC estimates</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="font-semibold text-purple-500">Competition Insights</span>
                      <span className="text-sm text-muted-foreground">Understand keyword competitiveness to refine strategies</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="font-semibold text-purple-500">Depth-Based Search</span>
                      <span className="text-sm text-muted-foreground">Adjust search depth to uncover niche and long-tail keywords</span>
                    </li>
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <p className="text-muted-foreground text-lg">
      Discover related keywords to expand your reach and drive more traffic.
</p>
    </div>
  )
}
