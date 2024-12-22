import { NextResponse } from 'next/server'

const API_URL = 'https://api.dataforseo.com/v3/dataforseo_labs/locations_and_languages'

interface AvailableLanguage {
  language_name: string
  language_code: string
  available_sources: string[]
  keywords: number
  serps: number
}

interface LocationData {
  location_code: number
  location_name: string
  location_code_parent: number | null
  country_iso_code: string
  location_type: string
  available_languages: AvailableLanguage[]
}

interface ApiResponse {
  tasks: Array<{
    result: LocationData[]
  }>
}

interface SelectOption {
  label: string
  value: string
}

export async function GET(): Promise<NextResponse> {
  if (!process.env.DATAFORSEO_LOGIN || !process.env.DATAFORSEO_PASSWORD) {
    return NextResponse.json(
      { error: 'API credentials not configured' },
      { status: 500 }
    )
  }

  try {
    const auth = Buffer.from(
      `${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`
    ).toString('base64')

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse = await response.json()
    
    // Create Sets to store unique locations and languages
    const uniqueLocations = new Set<string>()
    const languageMap = new Map<string, string>() // language_code -> language_name
    const locationMap = new Map<string, SelectOption>()

    // Process the data to get unique values
    data.tasks[0]?.result?.forEach((location) => {
      const locationKey = `${location.location_code}:${location.location_name}`
      if (!uniqueLocations.has(locationKey)) {
        uniqueLocations.add(locationKey)
        locationMap.set(locationKey, {
          value: location.location_code.toString(),
          label: location.location_name
        })
      }

      // For languages, only store one name per language code
      location.available_languages.forEach((lang) => {
        if (!languageMap.has(lang.language_code)) {
          languageMap.set(lang.language_code, lang.language_name)
        }
      })
    })

    // Convert to arrays and sort
    const locations = Array.from(locationMap.values())
      .sort((a, b) => a.label.localeCompare(b.label))
    
    const languages = Array.from(languageMap.entries())
      .map(([code, name]) => ({
        value: code,
        label: name
      }))
      .sort((a, b) => a.label.localeCompare(b.label))

    return NextResponse.json({
      locations,
      languages
    })

  } catch (error) {
    console.error('Error fetching locations and languages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch locations and languages' },
      { status: 500 }
    )
  }
}
