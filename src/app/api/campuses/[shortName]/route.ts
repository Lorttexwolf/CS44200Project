import { NextResponse } from 'next/server';
import { getCampusByShortName } from '@/lib/campusService';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortName: string }> }
) {
  try {
    const { shortName } = await params;
    const campus = await getCampusByShortName(shortName);
    
    if (!campus) {
      return NextResponse.json(
        { error: 'Campus not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(campus);
  } catch (error) {
    console.error('Error fetching campus:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campus' },
      { status: 500 }
    );
  }
}
