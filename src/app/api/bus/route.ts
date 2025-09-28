import { NextRequest, NextResponse } from 'next/server';
import { Bus } from '@/lib/bus';

// Mock data - in a real app, this would come from a database
let buses: Bus[] = [
  {
    id: 'bus-001',
    busNumber: 'BUS-001',
    plateNumber: 'SL-123-ABC',
    busType: 'standard',
    capacity: 50,
    year: 2020,
    manufacturer: 'Mercedes',
    model: 'Sprinter',
    color: 'Blue',
    fuelType: 'diesel',
    status: 'active',
    isGpsEnabled: true,
    hasWifi: false,
    hasAirConditioning: true,
    isAccessible: false,
    driverId: 'driver-001',
    routeId: 'route-001',
    maintenanceDate: '2024-01-15',
    insuranceExpiry: '2024-12-31',
    inspectionDate: '2024-01-10',
    notes: 'Regular maintenance completed',
    emergencyContact: 'John Doe',
    emergencyPhone: '+252 61 234 5678',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const busType = searchParams.get('busType') || '';

    let filteredBuses = buses;

    // Apply filters
    if (search) {
      filteredBuses = filteredBuses.filter(bus =>
        bus.busNumber.toLowerCase().includes(search.toLowerCase()) ||
        bus.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
        bus.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
        bus.model.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filteredBuses = filteredBuses.filter(bus => bus.status === status);
    }

    if (busType) {
      filteredBuses = filteredBuses.filter(bus => bus.busType === busType);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBuses = filteredBuses.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedBuses,
      pagination: {
        page,
        limit,
        total: filteredBuses.length,
        totalPages: Math.ceil(filteredBuses.length / limit),
      },
      success: true,
      message: 'Buses retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching buses:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.busNumber || !body.plateNumber || !body.busType || !body.capacity) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    // Create new bus
    const newBus: Bus = {
      id: `bus-${String(buses.length + 1).padStart(3, '0')}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    buses.push(newBus);

    return NextResponse.json({
      data: newBus,
      success: true,
      message: 'Bus created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating bus:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
