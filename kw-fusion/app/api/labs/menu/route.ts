import { NextResponse } from 'next/server'

const API_URL = 'https://api.dataforseo.com/v3/dataforseo_labs/locations_and_languages'

interface LocationLanguageData {
  location_name?: string;
  location_code?: number;
  language_name?: string;
  language_code?: string;
}

export async function GET() {
  try {
    const auth = Buffer.from(`${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`).toString('base64')

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

    const data = await response.json()
    
    // Separate maps for locations and languages
    const locations = new Map<string, number>()
    const languages = new Map<string, string>()

    if (data.tasks?.[0]?.result) {
      data.tasks[0].result.forEach((item: LocationLanguageData) => {
        if (item.location_name && item.location_code) {
          locations.set(item.location_name, item.location_code)
        }
        if (item.language_name && item.language_code) {
          languages.set(item.language_name, item.language_code)
        }
      })
    }

    // Convert to arrays and sort alphabetically
    const locationOptions = Array.from(locations)
      .map(([name, code]) => ({
        label: name,
        value: code.toString()
      }))
      .sort((a, b) => a.label.localeCompare(b.label))

    const languageOptions = Array.from(languages)
      .map(([name, code]) => ({
        label: name,
        value: code
      }))
      .sort((a, b) => a.label.localeCompare(b.label))

    return NextResponse.json({
      locations: locationOptions,
      languages: languageOptions
    })
  } catch (error) {
    console.error('Error fetching locations and languages:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
