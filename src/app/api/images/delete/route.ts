import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
    }

    // Only delete images from our uploads folder (not external URLs)
    if (!imageUrl.startsWith('/api/images/')) {
      return NextResponse.json({ 
        success: true, 
        message: 'External URL, no deletion needed' 
      });
    }

    // Extract filename from URL (/api/images/filename.jpg -> filename.jpg)
    const filename = imageUrl.split('/').pop();
    
    if (!filename) {
      return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
    }

    // Security: Prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'uploads', 'parking-lots');
    const filePath = path.join(uploadsDir, filename);

    // Check if file exists before attempting deletion
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      return NextResponse.json({ 
        success: true, 
        message: 'Image deleted successfully' 
      });
    } catch (error) {
      // File doesn't exist or can't be deleted - not a critical error
      return NextResponse.json({ 
        success: true, 
        message: 'Image not found or already deleted' 
      });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
