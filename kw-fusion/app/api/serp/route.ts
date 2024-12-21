import { NextResponse } from 'next/server'

const API_URL = 'https://api.dataforseo.com/v3/serp/google/organic/live/advanced'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const auth = Buffer.from(`${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`).toString('base64')

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([body])
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in SERP API route:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

