import { NextRequest, NextResponse } from 'next/server';
import { Supporter, SupporterCreateRequest } from '@/types/supporter';

// Mock data - in a real app, this would come from a database
let supporters: Supporter[] = [
  {
    id: 1,
    firstName: "Ahmed",
    lastName: "Hassan",
    email: "ahmed.hassan@example.com",
    phone: "+252 61 234 5678",
    idNumber: "SL123456789",
    dateOfBirth: "1990-01-15",
    gender: "male",
    address: "Hargeisa, Somaliland",
    city: "Hargeisa",
    district_id: 1,
    region_id: 1,
    pollingstation_id: 1,
    occupation: "Teacher",
    education: "University",
    fav_party: "Waddani",
    registration_date: "2024-01-15",
    status: "active",
    volunteer_interests: ["canvassing", "events"],
    skills: ["communication", "organization"],
    availability: "weekends",
    emergency_contact: "Fatima Hassan",
    emergency_phone: "+252 61 234 5679",
    notes: "Very enthusiastic supporter",
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
    const region_id = searchParams.get('region_id');
    const district_id = searchParams.get('district_id');

    let filteredSupporters = supporters;

    // Apply filters
    if (search) {
      filteredSupporters = filteredSupporters.filter(supporter =>
        supporter.firstName.toLowerCase().includes(search.toLowerCase()) ||
        supporter.lastName.toLowerCase().includes(search.toLowerCase()) ||
        supporter.email.toLowerCase().includes(search.toLowerCase()) ||
        supporter.phone.includes(search)
      );
    }

    if (status) {
      filteredSupporters = filteredSupporters.filter(supporter => supporter.status === status);
    }

    if (region_id) {
      filteredSupporters = filteredSupporters.filter(supporter => supporter.region_id === parseInt(region_id));
    }

    if (district_id) {
      filteredSupporters = filteredSupporters.filter(supporter => supporter.district_id === parseInt(district_id));
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSupporters = filteredSupporters.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedSupporters,
      pagination: {
        page,
        limit,
        total: filteredSupporters.length,
        totalPages: Math.ceil(filteredSupporters.length / limit),
      },
      success: true,
      message: 'Supporters retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching supporters:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SupporterCreateRequest = await request.json();

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.phone) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existingSupporter = supporters.find(s => s.email === body.email);
    if (existingSupporter) {
      return NextResponse.json(
        { error: 'Email already registered', success: false },
        { status: 409 }
      );
    }

    // Create new supporter
    const newSupporter: Supporter = {
      id: supporters.length + 1,
      ...body,
      registration_date: new Date().toISOString().split('T')[0],
      status: 'pending',
      created_by: 1, // This would come from auth context
      updated_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    supporters.push(newSupporter);

    return NextResponse.json({
      data: newSupporter,
      success: true,
      message: 'Supporter registered successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating supporter:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
