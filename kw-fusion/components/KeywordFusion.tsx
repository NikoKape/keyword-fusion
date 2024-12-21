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

export function KeywordFusion({ keywords = [] }: KeywordFusionProps) {
  const [mounted, setMounted] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false)
  const [aiProvider, setAiProvider] = useState('openai')
  const [aiModel, setAiModel] = useState('gpt-3.5-turbo')
  const [temperature, setTemperature] = useState(0.7)

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
AI Provider: ${aiProvider}
AI Model: ${aiModel}
Temperature: ${temperature}

This is a placeholder response. In a real application, this would be replaced with actual AI-generated content based on the user input, system prompt, selected keywords, and AI settings.`)
  }

  return (
    <Card className="w-full mt-8 bg-gradient-to-b from-slate-900/50 to-slate-800/50 backdrop-blur-sm border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Brain className="w-6 h-6" />
          Keyword Fusion
        </CardTitle>
        <CardDescription>
          Get AI-powered insights on your keywords for SEO and PPC
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible
          open={isAISettingsOpen}
          onOpenChange={setIsAISettingsOpen}
          className="mb-4 space-y-2"
        >
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/50"
                onClick={() => setIsAISettingsOpen(!isAISettingsOpen)}
              >
                {isAISettingsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                AI Settings
              </Button>
            </CollapsibleTrigger>
            {!isAISettingsOpen && (
              <div className="flex gap-2">
                <span className="bg-slate-800/60 text-slate-200 px-2 py-1 rounded-full text-xs border border-slate-700/50">
                  {aiProvider}
                </span>
                <span className="bg-slate-800/60 text-slate-200 px-2 py-1 rounded-full text-xs border border-slate-700/50">
                  {aiModel}
                </span>
                <span className="bg-slate-800/60 text-slate-200 px-2 py-1 rounded-full text-xs border border-slate-700/50">
                  T: {temperature}
                </span>
              </div>
            )}
          </div>
          <CollapsibleContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="ai-provider">AI Provider</Label>
                <Select value={aiProvider} onValueChange={setAiProvider}>
                  <SelectTrigger id="ai-provider">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="cohere">Cohere</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ai-model">AI Model</Label>
                <Select value={aiModel} onValueChange={setAiModel}>
                  <SelectTrigger id="ai-model">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="claude-v1">Claude v1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature: {temperature}</Label>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Tabs defaultValue="seo" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="seo" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600/40 data-[state=active]:to-blue-500/30 data-[state=active]:text-white"
            >
              SEO
            </TabsTrigger>
            <TabsTrigger 
              value="ppc"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600/40 data-[state=active]:to-orange-400/30 data-[state=active]:text-white"
            >
              PPC
            </TabsTrigger>
          </TabsList>
          <TabsContent value="seo">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
              {seoPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex items-center justify-start gap-2 h-auto py-2"
                  onClick={() => handlePromptClick(prompt.label)}
                >
                  <prompt.icon className="w-4 h-4" />
                  <span className="text-sm">{prompt.label}</span>
                </Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="ppc">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
              {ppcPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex items-center justify-start gap-2 h-auto py-2"
                  onClick={() => handlePromptClick(prompt.label)}
                >
                  <prompt.icon className="w-4 h-4" />
                  <span className="text-sm">{prompt.label}</span>
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-4 mb-4">
          <div>
            <Label htmlFor="system-prompt">System Prompt</Label>
            <Textarea
              id="system-prompt"
              placeholder="Enter a system prompt to guide the AI's behavior"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="user-prompt">User Prompt</Label>
            <div className="flex gap-2">
              <Input
                id="user-prompt"
                placeholder="Enter your prompt or select from above"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={handleSubmit}>
                Analyze
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-b from-slate-900/40 to-slate-800/40 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg">Selected Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] w-full rounded-md border border-slate-700/50 bg-slate-900/30 p-4">
                {keywords.map((keyword, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className={`m-1 bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/50 ${
                      selectedKeywords.includes(keyword) 
                        ? 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30' 
                        : ''
                    }`}
                    onClick={() => handleKeywordToggle(keyword)}
                  >
                    {keyword}
                  </Button>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-b from-slate-900/40 to-slate-800/40 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg">AI Response</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] w-full rounded-md border border-slate-700/50 bg-slate-900/30 p-4">
                <Textarea
                  value={aiResponse}
                  readOnly
                  className="w-full h-full min-h-[180px] bg-transparent border-0 focus-visible:ring-0"
                />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
