import { NextRequest, NextResponse } from 'next/server';
import { createChatSession } from '../../../../lib/chatbot';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userRole = searchParams.get('userRole') as 'admin' | 'operator' | 'supporter';
    const module = searchParams.get('module');

    if (!userId || !userRole) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // In a real application, this would fetch from database
    // For now, create a new session
    const session = createChatSession(userId, userRole, module || undefined);

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error creating chatbot session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // In a real application, this would delete from database
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chatbot session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
