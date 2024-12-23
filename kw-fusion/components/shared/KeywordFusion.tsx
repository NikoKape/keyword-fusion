'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Brain, Zap, TrendingUp, DollarSign, Users, BarChart2, Search, Target, Globe, ArrowRight, LineChart, FileText, Link, Share2, Maximize2, MousePointer2, Megaphone, PieChart, Coins, ChevronDown, ChevronUp } from 'lucide-react'
import { useModelSettings } from '@/lib/hooks/useModelSettings'

const seoPrompts = [
  { icon: TrendingUp, label: "Trend Analysis" },
  { icon: Search, label: "Keyword Opportunities" },
  { icon: BarChart2, label: "Competitor Analysis" },
  { icon: Target, label: "Content Gap Analysis" },
  { icon: Globe, label: "Geo Targeting" },
  { icon: LineChart, label: "Ranking Potential" },
  { icon: FileText, label: "Content Optimization" },
  { icon: Link, label: "Link Building Ideas" },
]

const ppcPrompts = [
  { icon: DollarSign, label: "CPC Optimization" },
  { icon: Users, label: "Audience Targeting" },
  { icon: Share2, label: "Ad Copy Suggestions" },
  { icon: Maximize2, label: "Conversion Rate Tips" },
  { icon: MousePointer2, label: "Click-Through Rate Boost" },
  { icon: Megaphone, label: "Ad Extension Ideas" },
  { icon: PieChart, label: "Budget Allocation" },
  { icon: Coins, label: "ROI Improvement" },
]

interface KeywordFusionProps {
  keywords: string[]
}

interface ModelSettingsProps {
  selectedProvider: string
  selectedModel: string
  temperature: string
  setSelectedModelAction: (model: string) => void
  setTemperatureAction: (temp: string) => void
  updateProviderAndModelAction: (provider: string) => void
}

function ModelSettings({
  selectedProvider,
  selectedModel,
  temperature,
  setSelectedModelAction,
  setTemperatureAction,
  updateProviderAndModelAction,
}: ModelSettingsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm mb-2 block">Select Provider</label>
          <Select value={selectedProvider} onValueChange={updateProviderAndModelAction}>
            <SelectTrigger className="bg-white dark:bg-[#141414] border-gray-300 dark:border-[#2C2C2C]">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-[#141414] border-gray-300 dark:border-[#2C2C2C]">
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="anthropic">Anthropic</SelectItem>
              <SelectItem value="google">Google</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm mb-2 block">Select Model</label>
          <Select value={selectedModel} onValueChange={setSelectedModelAction}>
            <SelectTrigger className="bg-white dark:bg-[#141414] border-gray-300 dark:border-[#2C2C2C]">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-[#141414] border-gray-300 dark:border-[#2C2C2C]">
              {selectedProvider === "openai" ? (
                <>
                  <SelectItem value="openai/gpt-4o-2024-11-20">GPT4o</SelectItem>
                  <SelectItem value="openai/o1">GPTo1</SelectItem>
                </>
              ) : selectedProvider === "anthropic" ? (
                <SelectItem value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
              ) : (
                <>
                  <SelectItem value="google/gemini-pro-1.5">Gemini Pro 1.5</SelectItem>
                  <SelectItem value="google/gemini-2.0-flash-exp:free">Gemini Flash 2.0 Experimental</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm">Temperature (Accuracy vs Creativity)</label>
          <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{temperature}</span>
        </div>
        <div className="space-y-4">
          <Slider
            defaultValue={[parseFloat(temperature)]}
            max={1}
            min={0}
            step={0.1}
            onValueChange={(value) => setTemperatureAction(value[0].toString())}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Maximum Accuracy</span>
            <span>Balanced</span>
            <span>Maximum Creativity</span>
          </div>
        </div>
      </div>
    </>
  )
}

export function KeywordFusion({ keywords = [] }: KeywordFusionProps) {
  const [mounted, setMounted] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false)
  const { settings, setSelectedProvider, setSelectedModel, setTemperature, updateProviderAndModel } = useModelSettings()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handlePromptClick = (prompt: string) => {
    setUserInput(prompt)
    setAiResponse(`AI analysis for: ${prompt}\n\nThis is a placeholder response. In a real application, this would be replaced with actual AI-generated content based on the selected prompt and keywords.`)
  }

  const handleKeywordToggle = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    )
  }

  const handleSubmit = () => {
    setAiResponse(`Analysis based on:
User Prompt: "${userInput}"
System Prompt: "${systemPrompt}"
Selected keywords: ${selectedKeywords.join(', ')}
AI Provider: ${settings.selectedProvider}
AI Model: ${settings.selectedModel}
Temperature: ${settings.temperature}

This is a placeholder response. In a real application, this would be replaced with actual AI-generated content based on the user input, system prompt, selected keywords, and AI settings.`)
  }

  return (
    <Card className="w-full mt-8 bg-gradient-to-br from-background via-muted/50 to-background backdrop-blur-sm border-border shadow-2xl hover:shadow-border/20 transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20 dark:from-blue-500/20 dark:to-violet-500/20">
            <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
            Keyword Fusion
          </span>
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Get AI-powered insights on your keywords for SEO and PPC
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible
          open={isAISettingsOpen}
          onOpenChange={setIsAISettingsOpen}
          className="mb-6 space-y-2"
        >
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 hover:bg-muted transition-colors"
                onClick={() => setIsAISettingsOpen(!isAISettingsOpen)}
              >
                {isAISettingsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                AI Settings
              </Button>
            </CollapsibleTrigger>
            {!isAISettingsOpen && (
              <div className="flex gap-2">
                <span className="bg-gradient-to-r from-muted/80 to-muted text-foreground px-3 py-1 rounded-full text-xs border shadow-sm">
                  {settings.selectedProvider === "openai" ? "OpenAI" :
                   settings.selectedProvider === "anthropic" ? "Anthropic" : "Google"}
                </span>
                <span className="bg-gradient-to-r from-muted/80 to-muted text-foreground px-3 py-1 rounded-full text-xs border shadow-sm">
                  {settings.selectedModel === "openai/gpt-4o-2024-11-20" ? "GPT4o" :
                   settings.selectedModel === "openai/o1" ? "GPTo1" :
                   settings.selectedModel === "anthropic/claude-3.5-sonnet" ? "Claude 3.5 Sonnet" :
                   settings.selectedModel === "google/gemini-pro-1.5" ? "Gemini Pro 1.5" :
                   "Gemini Flash 2.0"}
                </span>
                <span className="bg-gradient-to-r from-muted/80 to-muted text-foreground px-3 py-1 rounded-full text-xs border shadow-sm">
                  T: {settings.temperature}
                </span>
              </div>
            )}
          </div>
          <CollapsibleContent className="space-y-4">
            <ModelSettings
              selectedProvider={settings.selectedProvider}
              selectedModel={settings.selectedModel}
              temperature={settings.temperature}
              setSelectedModelAction={setSelectedModel}
              setTemperatureAction={setTemperature}
              updateProviderAndModelAction={updateProviderAndModel}
            />
          </CollapsibleContent>
        </Collapsible>

        <Tabs defaultValue="seo" className="w-full">
          <TabsList className="grid w-full grid-cols-3 p-1 bg-muted/50">
            <TabsTrigger 
              value="seo" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/10 data-[state=active]:to-violet-500/10 dark:data-[state=active]:from-blue-500/20 dark:data-[state=active]:to-violet-500/20 transition-all duration-200"
            >
              SEO
            </TabsTrigger>
            <TabsTrigger 
              value="ppc"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/10 data-[state=active]:to-red-500/10 dark:data-[state=active]:from-orange-500/20 dark:data-[state=active]:to-red-500/20 transition-all duration-200"
            >
              PPC
            </TabsTrigger>
            <TabsTrigger 
              value="custom"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/10 data-[state=active]:to-teal-500/10 dark:data-[state=active]:from-emerald-500/20 dark:data-[state=active]:to-teal-500/20 transition-all duration-200"
            >
              Custom
            </TabsTrigger>
          </TabsList>
          <TabsContent value="seo">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-6">
              {seoPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex items-center justify-start gap-2 h-auto py-2 hover:bg-muted transition-all duration-200 group"
                  onClick={() => handlePromptClick(prompt.label)}
                >
                  <prompt.icon className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
                  <span className="text-sm group-hover:text-foreground transition-colors">{prompt.label}</span>
                </Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="ppc">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-6">
              {ppcPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex items-center justify-start gap-2 h-auto py-2 hover:bg-muted transition-all duration-200 group"
                  onClick={() => handlePromptClick(prompt.label)}
                >
                  <prompt.icon className="w-4 h-4 text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors" />
                  <span className="text-sm group-hover:text-foreground transition-colors">{prompt.label}</span>
                </Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="custom">
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="system-prompt" className="text-foreground">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  placeholder="Enter a system prompt to guide the AI's behavior"
                  value={systemPrompt}
                  onChange={(e) => {
                    setSystemPrompt(e.target.value)
                    e.target.style.height = 'auto'
                    e.target.style.height = `${e.target.scrollHeight}px`
                  }}
                  className="mt-1.5 bg-background/50 hover:bg-background focus:bg-background transition-colors min-h-[100px] w-full"
                  style={{ resize: 'none', overflow: 'hidden' }}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="user-prompt" className="text-foreground">User Prompt</Label>
            <div className="flex gap-2">
              <Input
                id="user-prompt"
                placeholder="Enter your prompt or select from above"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-grow bg-background/50 hover:bg-background focus:bg-background transition-colors"
              />
              <Button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 dark:from-blue-500 dark:to-violet-500 dark:hover:from-blue-600 dark:hover:to-violet-600 text-white shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-200"
              >
                <Zap className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-background via-muted/50 to-background border shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-foreground">Selected Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full rounded-md border bg-muted/30 p-4">
                <div className="flex flex-wrap gap-1">
                  {keywords.map((keyword, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className={`hover:bg-muted transition-colors ${
                        selectedKeywords.includes(keyword) 
                          ? 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-700 dark:bg-blue-500/20 dark:hover:bg-blue-500/30 dark:text-blue-200' 
                          : ''
                      }`}
                      onClick={() => handleKeywordToggle(keyword)}
                    >
                      {keyword}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-background via-muted/50 to-background border shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-foreground">AI Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full rounded-md border bg-muted/30 p-4">
                <Textarea
                  value={aiResponse}
                  readOnly
                  className="w-full bg-transparent border-0 focus-visible:ring-0 text-muted-foreground min-h-[100px]"
                  style={{
                    resize: 'none',
                    overflow: 'hidden',
                    height: 'auto',
                    minHeight: '100px'
                  }}
                  onChange={(e) => {
                    e.target.style.height = 'auto'
                    e.target.style.height = `${e.target.scrollHeight}px`
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
