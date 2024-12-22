import { NextResponse } from 'next/server'

const API_URL = 'https://api.dataforseo.com/v3/dataforseo_labs/google/related_keywords/live'

interface RequestBody {
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

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json()
    console.log('Request body:', body)

    // Format the request body according to the API requirements
    const apiRequestBody = [{
      keyword: body.keyword,
      location_code: parseInt(body.location_code.toString()),
      language_code: body.language_code,
      depth: parseInt(body.depth.toString()),
      include_seed_keyword: body.include_seed_keyword ?? false,
      include_serp_info: body.include_serp_info ?? false,
      ignore_synonyms: body.ignore_synonyms ?? false,
      include_clickstream_data: body.include_clickstream_data ?? false,
      replace_with_core_keyword: body.replace_with_core_keyword ?? false,
      limit: parseInt(body.limit.toString())
    }]

    console.log('API request body:', apiRequestBody)

    if (!process.env.DATAFORSEO_LOGIN || !process.env.DATAFORSEO_PASSWORD) {
      throw new Error('DataForSEO credentials not configured')
    }

    const auth = Buffer.from(`${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`).toString('base64')

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(apiRequestBody)
    })

    const data = await response.json()
    console.log('API response:', JSON.stringify(data, null, 2))

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (data.status_code !== 20000) {
      throw new Error(data.status_message || 'API Error')
    }

    // Return the raw API response
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { 
        status_code: 500, 
        status_message: error instanceof Error ? error.message : 'Internal Server Error',
        tasks: []
      },
      { status: 500 }
    )
  }
}
