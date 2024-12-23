'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Globe, Languages, Layers, List, Search, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { KeywordFormData } from '@/types/keywords'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface SelectOption {
  value: string
  label: string
}

interface RelatedKeywordsProps {
  onSubmitAction: (data: KeywordFormData) => void
}

export function RelatedKeywords({ onSubmitAction }: RelatedKeywordsProps) {
  const [formData, setFormData] = useState<KeywordFormData>({
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
  const [error, setError] = useState<string | null>(null)
  const [locationOptions, setLocationOptions] = useState<SelectOption[]>([
    { value: '2840', label: 'United States' }
  ])
  const [languageOptions, setLanguageOptions] = useState<SelectOption[]>([
    { value: 'en', label: 'English' }
  ])
  const [locationLanguages, setLocationLanguages] = useState<Record<string, SelectOption[]>>({})

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('/api/labs/menu')
        if (!response.ok) {
          throw new Error('Failed to fetch options')
        }
        const data = await response.json()
        if (data.locations && data.languages && data.locationLanguages) {
          setLocationOptions(data.locations)
          setLanguageOptions(data.languages)
          setLocationLanguages(data.locationLanguages)

          setFormData(prev => {
            const locationExists = data.locations.some((loc: SelectOption) => loc.value === prev.location_code)
            const locationCode = locationExists ? prev.location_code : data.locations[0]?.value || '2840'
            const availableLanguages = data.locationLanguages[locationCode] || []
            const languageExists = availableLanguages.some((lang: SelectOption) => lang.value === prev.language_code)
            
            return {
              ...prev,
              location_code: locationCode,
              language_code: languageExists ? prev.language_code : availableLanguages[0]?.value || 'en'
            }
          })
        }
      } catch (error) {
        console.error('Error fetching options:', error)
      }
    }

    fetchOptions()
  }, [])

  const handleLocationChange = (value: string) => {
    const availableLanguages = locationLanguages[value] || []
    setFormData(prev => ({
      ...prev,
      location_code: value,
      language_code: availableLanguages[0]?.value || prev.language_code
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.keyword) return

    setIsLoading(true)
    setError(null)

    try {
      onSubmitAction(formData)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      console.error('Error:', error)
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
    options: SelectOption[]
    onChange: (value: string) => void
  }) => {
    const [searchQuery, setSearchQuery] = useState('')
    
    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12 px-4 bg-component border-input hover:bg-accent hover:text-accent-foreground">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-muted-foreground" />
            <SelectValue placeholder={label} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <div className="p-2">
            <div className="flex items-center h-9 px-2 rounded-md border border-input bg-background">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                className="flex-1 h-8 ml-2 bg-transparent outline-none placeholder:text-muted-foreground"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setSearchQuery('')
                  }
                  e.stopPropagation()
                }}
              />
              {searchQuery && (
                <button
                  className="h-4 w-4 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSearchQuery('')
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <div className="max-h-[250px] overflow-y-auto px-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="py-2.5 px-8 text-sm cursor-pointer hover:bg-accent rounded-sm"
                >
                  {option.label}
                </SelectItem>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found
              </div>
            )}
          </div>
        </SelectContent>
      </Select>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto space-y-4">
      <div className="relative">
        <Input
          value={formData.keyword}
          onChange={(e) => setFormData(prev => ({ ...prev, keyword: e.target.value }))}
          placeholder="Enter keyword for related terms..."
          className={cn(
            "h-14 pl-12 pr-24 text-lg rounded-2xl bg-gradient-to-br from-white/90 via-white/80 to-background/90",
            "border border-border/30 relative",
            "before:absolute before:inset-0 before:rounded-2xl before:border before:border-white/60 before:bg-gradient-to-b before:from-white/80 before:to-white/40 before:-z-10",
            "after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-t after:from-white/40 after:to-white/10 after:-z-20",
            "[box-shadow:0_2px_4px_rgba(0,0,0,0.02),0_1px_6px_rgba(0,0,0,0.03),inset_0_0_32px_rgba(255,255,255,0.9)]",
            "dark:bg-gradient-to-br dark:from-background/80 dark:via-muted/30 dark:to-background/90",
            "dark:border-border/30 dark:before:border-white/[0.08]",
            "dark:after:bg-gradient-to-t dark:after:from-white/[0.08] dark:after:to-white/[0.02]",
            "dark:[box-shadow:0_0_0_1px_rgba(255,255,255,0.08),inset_0_0_32px_rgba(255,255,255,0.06)]",
            "placeholder:text-muted-foreground/60",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
            "focus-visible:border-ring/50",
            "dark:focus-visible:ring-ring dark:focus-visible:border-ring",
            "dark:focus-visible:ring-offset-background",
            "transition-all duration-200 ease-out"
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
              <LoadingSpinner />
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
          onChange={handleLocationChange}
        />

        <SelectButton
          icon={Languages}
          label="Language"
          value={formData.language_code}
          options={locationLanguages[formData.location_code] || languageOptions}
          onChange={(value) => setFormData(prev => ({ ...prev, language_code: value }))}
        />

        <SelectButton
          icon={Layers}
          label="Depth"
          value={formData.depth}
          options={[
            { value: '0', label: 'Base Level' },
            { value: '1', label: '1 Level' },
            { value: '2', label: '2 Levels' },
            { value: '3', label: '3 Levels' },
            { value: '4', label: '4 Levels' },
          ]}
          onChange={(value) => setFormData(prev => ({ ...prev, depth: value }))}
        />

        <SelectButton
          icon={List}
          label="Limit"
          value={formData.limit}
          options={[
            { value: '10', label: '10 Results' },
            { value: '20', label: '20 Results' },
            { value: '30', label: '30 Results' },
            { value: '40', label: '40 Results' },
            { value: '50', label: '50 Results' },
            { value: '60', label: '60 Results' },
            { value: '70', label: '70 Results' },
            { value: '80', label: '80 Results' },
            { value: '90', label: '90 Results' },
            { value: '100', label: '100 Results' },
          ]}
          onChange={(value) => setFormData(prev => ({ ...prev, limit: value }))}
        />
      </div>

      <Collapsible className="w-full space-y-2 mt-6">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-center gap-3 group">
            <div className="h-px flex-1 bg-muted-foreground/20 group-hover:bg-muted-foreground/30 transition-colors" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground/50 group-hover:text-muted-foreground/70 transition-colors flex items-center gap-2">
              Advanced Options
              <ChevronDown className="h-3 w-3 transition-transform duration-200 opacity-50" />
            </span>
            <div className="h-px flex-1 bg-muted-foreground/20 group-hover:bg-muted-foreground/30 transition-colors" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          <div className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
            <div className="space-y-1">
              <Label htmlFor="ignore-synonyms" className="text-sm font-medium">Ignore Synonyms</Label>
              <p className="text-sm text-muted-foreground">
                When enabled, synonymous keywords will be filtered out from the results
              </p>
            </div>
            <Switch
              id="ignore-synonyms"
              checked={formData.ignore_synonyms}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, ignore_synonyms: checked }))
              }
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </form>
  )
}
