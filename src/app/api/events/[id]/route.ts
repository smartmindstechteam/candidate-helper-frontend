import { NextRequest, NextResponse } from 'next/server';
import { Event, EventUpdateRequest } from '@/types/event';

// Mock data - in a real app, this would come from a database
let events: Event[] = [
  {
    id: 1,
    title: "Campaign Rally - Hargeisa",
    type: "rally",
    category: "Political Rally",
    timezone: "Africa/Mogadishu",
    description: "Major campaign rally in Hargeisa city center",
    objective: "Mobilize supporters and present campaign platform",
    tags: ["rally", "hargeisa", "major"],
    priority: "high",
    start_time: "2024-02-15T10:00:00Z",
    end_time: "2024-02-15T14:00:00Z",
    recurrence: "none",
    setup_time: "2024-02-15T08:00:00Z",
    teardown_time: "2024-02-15T16:00:00Z",
    venue: "Hargeisa Stadium",
    city: "Hargeisa",
    district_id: 1,
    region_id: 1,
    address: "Hargeisa Stadium, Hargeisa, Somaliland",
    lat: 9.5616,
    lng: 44.0650,
    max_capacity: 5000,
    expected_attendance: 3000,
    actual_attendance: 0,
    budget_amount: 10000,
    estimated_cost: 8500,
    funding_source_id: 1,
    status: "scheduled",
    media_links: ["https://example.com/rally-video"],
    organizer_name: "Campaign Team",
    organizer_contact: "+252 61 234 5678",
    backup_contact: "+252 61 234 5679",
    assigned_operator_id: 1,
    risk_assessment: "Low risk event in controlled venue",
    contingency_plan: "Indoor backup venue available",
    feedback_link: "https://example.com/feedback",
    created_by: 1,
    updated_by: 1,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id);
    const event = events.find(e => e.id === eventId);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: event,
      success: true,
      message: 'Event retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id);
    const body: EventUpdateRequest = await request.json();

    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) {
      return NextResponse.json(
        { error: 'Event not found', success: false },
        { status: 404 }
      );
    }

    // Update event
    events[eventIndex] = {
      ...events[eventIndex],
      ...body,
      updated_by: 1, // This would come from auth context
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      data: events[eventIndex],
      success: true,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id);
    const eventIndex = events.findIndex(e => e.id === eventId);

    if (eventIndex === -1) {
      return NextResponse.json(
        { error: 'Event not found', success: false },
        { status: 404 }
      );
    }

    events.splice(eventIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
