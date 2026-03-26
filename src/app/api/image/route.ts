import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const uhid = formData.get('uhid');
    const file = formData.get('file') as File | null;
    
    if (!file || !uhid) {
      return NextResponse.json(
        { error: 'Missing file or uhid' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const proxyFormData = new FormData();
    proxyFormData.append('file', new Blob([buffer], { type: file.type }), file.name);
    proxyFormData.append('uhid', uhid as string);

    const response = await fetch(`${BASE_URL}/ImageHandler.ashx`, {
      method: 'POST',
      body: proxyFormData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
