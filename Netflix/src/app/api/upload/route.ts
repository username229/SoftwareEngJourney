import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/services/s3Service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const key = `posters/${Date.now()}-${file.name}`;
    await uploadImage(buffer, key);
    
    return NextResponse.json({ 
      success: true, 
      key,
      url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}