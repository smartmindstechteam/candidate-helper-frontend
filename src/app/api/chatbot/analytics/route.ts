import { NextRequest, NextResponse } from 'next/server';
import { mockAnalytics } from '../../../../lib/chatbot';

export async function GET(request: NextRequest) {
  try {
    // In a real application, this would fetch from database
    return NextResponse.json(mockAnalytics);
  } catch (error) {
    console.error('Error fetching chatbot analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
