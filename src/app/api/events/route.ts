import { NextRequest, NextResponse } from 'next/server';
import { Event, EventCreateRequest, EventUpdateRequest } from '@/types/event';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const type = searchParams.get('type') || '';

    let filteredEvents = events;

    // Apply filters
    if (search) {
      filteredEvents = filteredEvents.filter(event =>
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase()) ||
        event.venue.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filteredEvents = filteredEvents.filter(event => event.status === status);
    }

    if (type) {
      filteredEvents = filteredEvents.filter(event => event.type === type);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedEvents,
      pagination: {
        page,
        limit,
        total: filteredEvents.length,
        totalPages: Math.ceil(filteredEvents.length / limit),
      },
      success: true,
      message: 'Events retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: EventCreateRequest = await request.json();

    // Validate required fields
    if (!body.title || !body.type || !body.start_time || !body.end_time) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    // Create new event
    const newEvent: Event = {
      id: events.length + 1,
      ...body,
      created_by: 1, // This would come from auth context
      updated_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    events.push(newEvent);

    return NextResponse.json({
      data: newEvent,
      success: true,
      message: 'Event created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
