import { NextResponse } from 'next/server';

const BASE_URL = 'https://www.dedu.se/Deduwebextern/Hoganas/GataPark';

export async function POST() {
  try {
    const response = await fetch(`${BASE_URL}/Service.aspx/GetCategories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
