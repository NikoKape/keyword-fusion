import { useState, useCallback } from 'react'

interface ModelSettings {
  selectedProvider: string
  selectedModel: string
  temperature: string
}

interface UseModelSettingsReturn {
  settings: ModelSettings
  setSelectedProvider: (provider: string) => void
  setSelectedModel: (model: string) => void
  setTemperature: (temp: string) => void
  updateProviderAndModel: (provider: string) => void
}

export function useModelSettings(
  initialProvider: string = 'openai',
  initialModel: string = 'openai/gpt-4o-2024-11-20',
  initialTemperature: string = '0.2'
): UseModelSettingsReturn {
  const [settings, setSettings] = useState<ModelSettings>({
    selectedProvider: initialProvider,
    selectedModel: initialModel,
    temperature: initialTemperature,
  })

  const setSelectedProvider = useCallback((provider: string): void => {
    setSettings(prev => ({ ...prev, selectedProvider: provider }))
  }, [])

  const setSelectedModel = useCallback((model: string): void => {
    setSettings(prev => ({ ...prev, selectedModel: model }))
  }, [])

  const setTemperature = useCallback((temp: string): void => {
    setSettings(prev => ({ ...prev, temperature: temp }))
  }, [])

  const updateProviderAndModel = useCallback((provider: string): void => {
    const defaultModel = provider === "openai" 
      ? "openai/gpt-4o-2024-11-20"
      : provider === "anthropic" 
        ? "anthropic/claude-3.5-sonnet"
        : "google/gemini-pro-1.5"

    setSettings(prev => ({
      ...prev,
      selectedProvider: provider,
      selectedModel: defaultModel
    }))
  }, [])

  return {
    settings,
    setSelectedProvider,
    setSelectedModel,
    setTemperature,
    updateProviderAndModel,
  }
}
