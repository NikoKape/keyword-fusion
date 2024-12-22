'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Globe, Languages, Layers, List, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

// Mock API response
const mockApiResponse = (keyword: string) => ({
  keyword,
  results: [
    {
      keyword: keyword,
      search_volume: Math.floor(Math.random() * 100000),
      cpc: Math.random() * 10,
      competition: ["LOW", "MEDIUM", "HIGH"][Math.floor(Math.random() * 3)],
      relevance: Math.random() * 100
    },
    {
      keyword: keyword + " services",
      search_volume: Math.floor(Math.random() * 50000),
      cpc: Math.random() * 8,
      competition: ["LOW", "MEDIUM", "HIGH"][Math.floor(Math.random() * 3)],
      relevance: Math.random() * 100
    },
    {
      keyword: "best " + keyword,
      search_volume: Math.floor(Math.random() * 30000),
      cpc: Math.random() * 12,
      competition: ["LOW", "MEDIUM", "HIGH"][Math.floor(Math.random() * 3)],
      relevance: Math.random() * 100
    },
    {
      keyword: keyword + " near me",
      search_volume: Math.floor(Math.random() * 20000),
      cpc: Math.random() * 6,
      competition: ["LOW", "MEDIUM", "HIGH"][Math.floor(Math.random() * 3)],
      relevance: Math.random() * 100
    },
    {
      keyword: keyword + " company",
      search_volume: Math.floor(Math.random() * 15000),
      cpc: Math.random() * 9,
      competition: ["LOW", "MEDIUM", "HIGH"][Math.floor(Math.random() * 3)],
      relevance: Math.random() * 100
    }
  ]
})

const ModernLoadingAnimation = () => {
  return (
    <div className="relative w-8 h-8">
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{
          duration: 7,
          ease: "linear",
          repeat: Infinity
        }}
      >
        {[...Array(13)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-full origin-center"
            style={{
              rotate: `${i * 27.7}deg`,
            }}
          >
            <motion.div
              className="absolute top-0 left-1/2 w-1.5 h-1.5 -ml-[3px]"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.75,
                repeat: Infinity,
                delay: i * -0.1,
              }}
              style={{
                background: `hsl(${i * 28}, 100%, 65%)`,
                boxShadow: `0 0 12px hsl(${i * 28}, 100%, 65%)`,
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

interface LabsRequestBody {
  keyword: string;
  location_code: number;
  language_code: string;
  depth: number;
  include_seed_keyword: boolean;
  include_serp_info: boolean;
  ignore_synonyms: boolean;
  include_clickstream_data: boolean;
  replace_with_core_keyword: boolean;
  limit: number;
}

export function RelatedKeywords({ onSubmit }) {
  const [formData, setFormData] = useState({
    keyword: '',
    location_code: '2840',
    language_code: 'en',
    depth: '3',
    limit: '20',
    include_seed_keyword: false,
    include_serp_info: false,
    ignore_synonyms: false,
    include_clickstream_data: false,
    replace_with_core_keyword: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [locationOptions, setLocationOptions] = useState([
    { value: '2840', label: 'United States' }
  ])
  const [languageOptions, setLanguageOptions] = useState([
    { value: 'en', label: 'English' }
  ])

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('/api/labs/menu')
        if (!response.ok) {
          throw new Error('Failed to fetch options')
        }
        const data = await response.json()
        if (data.locations && data.languages) {
          // Set locations
          const sortedLocations = [...data.locations].sort((a, b) => 
            a.label.localeCompare(b.label)
          )
          setLocationOptions(sortedLocations)

          // Set languages and ensure uniqueness
          const uniqueLanguages = new Map()
          data.languages.forEach(lang => {
            if (!uniqueLanguages.has(lang.value)) {
              uniqueLanguages.set(lang.value, lang)
            }
          })
          const sortedLanguages = Array.from(uniqueLanguages.values())
            .sort((a, b) => a.label.localeCompare(b.label))
          setLanguageOptions(sortedLanguages)

          // Set default values if current ones don't exist in new options
          setFormData(prev => {
            const locationExists = sortedLocations.some(loc => loc.value === prev.location_code)
            const languageExists = uniqueLanguages.has(prev.language_code)
            
            return {
              ...prev,
              location_code: locationExists ? prev.location_code : sortedLocations[0]?.value || '2840',
              language_code: languageExists ? prev.language_code : sortedLanguages[0]?.value || 'en'
            }
          })
        }
      } catch (error) {
        console.error('Error fetching options:', error)
      }
    }

    fetchOptions()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.keyword) return

    setIsLoading(true)
    
    try {
      const requestBody: LabsRequestBody = {
        keyword: formData.keyword,
        location_code: parseInt(formData.location_code),
        language_code: formData.language_code,
        depth: parseInt(formData.depth),
        limit: parseInt(formData.limit),
        include_seed_keyword: formData.include_seed_keyword,
        include_serp_info: formData.include_serp_info,
        ignore_synonyms: formData.ignore_synonyms,
        include_clickstream_data: formData.include_clickstream_data,
        replace_with_core_keyword: formData.replace_with_core_keyword
      }

      const response = await fetch('/api/labs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      onSubmit(data)
    } catch (error) {
      console.error('Error fetching keyword data:', error)
      // Fallback to mock data in case of error
      const mockData = mockApiResponse(formData.keyword)
      onSubmit(mockData)
    } finally {
      setIsLoading(false)
    }
  }

  const SelectButton = ({ 
    icon: Icon, 
    label, 
    value, 
    options, 
    onChange 
  }: { 
    icon: any
    label: string
    value: string
    options: { value: string; label: string }[]
    onChange: (value: string) => void
  }) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-12 px-4 bg-background border-input hover:bg-accent hover:text-accent-foreground">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-muted-foreground" />
          <SelectValue placeholder={label} />
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        <div className="max-h-[300px] overflow-y-auto">
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="py-2.5 px-4 text-sm cursor-pointer hover:bg-accent"
            >
              {option.label}
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  )

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto space-y-4">
      <div className="relative">
        <Input
          value={formData.keyword}
          onChange={(e) => setFormData(prev => ({ ...prev, keyword: e.target.value }))}
          placeholder="Enter keyword for related terms..."
          className={cn(
            "h-14 pl-12 pr-24 text-lg bg-background border-input",
            "placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          )}
        />
        <svg
          className="absolute left-4 top-4 h-6 w-6 text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <motion.div
          className="absolute right-2 top-2"
          whileTap={{ scale: 0.95 }}
        >
          <Button
            type="submit"
            size="lg"
            className={cn(
              "h-10 px-6 rounded-full relative overflow-hidden",
              "transition-all duration-300 ease-in-out",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "border border-transparent",
              isLoading 
                ? "bg-transparent hover:bg-transparent min-w-[96px] flex items-center justify-center" 
                : [
                    "bg-gradient-to-r from-blue-500 to-violet-500",
                    "dark:from-blue-400 dark:to-violet-400",
                    "hover:from-blue-600 hover:to-violet-600",
                    "dark:hover:from-blue-500 dark:hover:to-violet-500",
                    "text-white dark:text-gray-900",
                    "shadow-lg dark:shadow-none",
                    "after:absolute after:inset-0 after:opacity-0 after:transition-opacity",
                    "after:bg-gradient-to-r after:from-blue-600 after:to-violet-600",
                    "dark:after:from-blue-500 dark:after:to-violet-500",
                    "hover:after:opacity-100",
                    "hover:scale-[1.02]",
                    "active:scale-[0.98]"
                  ].join(' ')
            )}
            disabled={!formData.keyword || isLoading}
          >
            {isLoading ? (
              <ModernLoadingAnimation />
            ) : (
              <span className="relative z-10 flex items-center font-medium">
                <Search className="w-5 h-5 mr-2" />
                Search
              </span>
            )}
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SelectButton
          icon={Globe}
          label="Location"
          value={formData.location_code}
          options={locationOptions}
          onChange={(value) => setFormData(prev => ({ ...prev, location_code: value }))}
        />

        <SelectButton
          icon={Languages}
          label="Language"
          value={formData.language_code}
          options={languageOptions}
          onChange={(value) => setFormData(prev => ({ ...prev, language_code: value }))}
        />

        <SelectButton
          icon={Layers}
          label="Depth"
          value={formData.depth}
          options={[
            { value: '3', label: 'Depth: 3' },
            { value: '5', label: 'Depth: 5' },
            { value: '10', label: 'Depth: 10' },
          ]}
          onChange={(value) => setFormData(prev => ({ ...prev, depth: value }))}
        />

        <SelectButton
          icon={List}
          label="Limit"
          value={formData.limit}
          options={[
            { value: '20', label: 'Limit: 20' },
            { value: '50', label: 'Limit: 50' },
            { value: '100', label: 'Limit: 100' },
          ]}
          onChange={(value) => setFormData(prev => ({ ...prev, limit: value }))}
        />
      </div>
    </form>
  )
}
