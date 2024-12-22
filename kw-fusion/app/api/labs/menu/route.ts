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
    const locationMap = new Map<string, SelectOption>()
    const locationLanguages = new Map<string, Set<string>>()

    // Process the data to get unique values
    data.tasks[0]?.result?.forEach((location) => {
      const locationKey = `${location.location_code}:${location.location_name}`
      if (!uniqueLocations.has(locationKey)) {
        uniqueLocations.add(locationKey)
        const locationId = location.location_code.toString()
        locationMap.set(locationKey, {
          value: locationId,
          label: location.location_name
        })
        
        // Store languages for this location
        if (!locationLanguages.has(locationId)) {
          locationLanguages.set(locationId, new Set())
        }
        location.available_languages.forEach(lang => {
          locationLanguages.get(locationId)?.add(lang.language_code)
        })
      }
    })

    // Convert to arrays and sort
    const locations = Array.from(locationMap.values())
      .sort((a, b) => a.label.localeCompare(b.label))
    
    // Get all unique languages across all locations
    const allLanguages = new Map<string, string>()
    data.tasks[0]?.result?.forEach(location => {
      location.available_languages.forEach(lang => {
        allLanguages.set(lang.language_code, lang.language_name)
      })
    })

    const languages = Array.from(allLanguages.entries())
      .map(([code, name]) => ({
        value: code,
        label: name
      }))
      .sort((a, b) => a.label.localeCompare(b.label))

    // Create location to languages mapping
    const locationToLanguages = Object.fromEntries(
      Array.from(locationLanguages.entries()).map(([locId, langCodes]) => [
        locId,
        languages.filter(lang => langCodes.has(lang.value))
      ])
    )

    return NextResponse.json({
      locations,
      languages,
      locationLanguages: locationToLanguages
    })

  } catch (error) {
    console.error('Error fetching locations and languages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch locations and languages' },
      { status: 500 }
    )
  }
}
