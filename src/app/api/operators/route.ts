import { NextRequest, NextResponse } from 'next/server';
import { Operator, OperatorCreateRequest } from '@/types/operator';

// Mock data - in a real app, this would come from a database
let operators: Operator[] = [
  {
    id: 1,
    firstName: "Mohamed",
    lastName: "Ali",
    email: "mohamed.ali@example.com",
    phone: "+252 61 234 5678",
    idNumber: "SL987654321",
    dateOfBirth: "1985-05-20",
    gender: "male",
    address: "Hargeisa, Somaliland",
    city: "Hargeisa",
    district_id: 1,
    region_id: 1,
    occupation: "Campaign Manager",
    education: "Masters",
    experience_years: 5,
    skills: ["leadership", "communication", "management"],
    languages: ["Somali", "English", "Arabic"],
    availability: "full-time",
    assigned_region_id: 1,
    assigned_district_id: 1,
    role: "field_coordinator",
    status: "active",
    hire_date: "2024-01-01",
    salary: 1500,
    emergency_contact: "Amina Ali",
    emergency_phone: "+252 61 234 5679",
    notes: "Experienced campaign organizer",
    created_by: 1,
    updated_by: 1,
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const role = searchParams.get('role') || '';
    const region_id = searchParams.get('region_id');
    const district_id = searchParams.get('district_id');

    let filteredOperators = operators;

    // Apply filters
    if (search) {
      filteredOperators = filteredOperators.filter(operator =>
        operator.firstName.toLowerCase().includes(search.toLowerCase()) ||
        operator.lastName.toLowerCase().includes(search.toLowerCase()) ||
        operator.email.toLowerCase().includes(search.toLowerCase()) ||
        operator.phone.includes(search)
      );
    }

    if (status) {
      filteredOperators = filteredOperators.filter(operator => operator.status === status);
    }

    if (role) {
      filteredOperators = filteredOperators.filter(operator => operator.role === role);
    }

    if (region_id) {
      filteredOperators = filteredOperators.filter(operator => operator.region_id === parseInt(region_id));
    }

    if (district_id) {
      filteredOperators = filteredOperators.filter(operator => operator.district_id === parseInt(district_id));
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOperators = filteredOperators.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedOperators,
      pagination: {
        page,
        limit,
        total: filteredOperators.length,
        totalPages: Math.ceil(filteredOperators.length / limit),
      },
      success: true,
      message: 'Operators retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching operators:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: OperatorCreateRequest = await request.json();

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.phone) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existingOperator = operators.find(o => o.email === body.email);
    if (existingOperator) {
      return NextResponse.json(
        { error: 'Email already registered', success: false },
        { status: 409 }
      );
    }

    // Create new operator
    const newOperator: Operator = {
      id: operators.length + 1,
      ...body,
      status: 'pending',
      hire_date: new Date().toISOString().split('T')[0],
      created_by: 1, // This would come from auth context
      updated_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    operators.push(newOperator);

    return NextResponse.json({
      data: newOperator,
      success: true,
      message: 'Operator registered successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating operator:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
