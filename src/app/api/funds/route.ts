import { NextRequest, NextResponse } from 'next/server';

// Mock data - in a real app, this would come from a database
let funds: any[] = [
  {
    id: 1,
    amount: 5000,
    category: "event_funding",
    source: "donation",
    description: "Rally funding for Hargeisa event",
    operator_id: 1,
    event_id: 1,
    status: "approved",
    payment_method: "bank_transfer",
    transaction_id: "TXN-001",
    date: "2024-01-15",
    notes: "Initial funding for major rally",
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
    const category = searchParams.get('category') || '';
    const source = searchParams.get('source') || '';
    const status = searchParams.get('status') || '';
    const operator_id = searchParams.get('operator_id');
    const event_id = searchParams.get('event_id');
    const date_from = searchParams.get('date_from');
    const date_to = searchParams.get('date_to');
    const amount_min = searchParams.get('amount_min');
    const amount_max = searchParams.get('amount_max');
    const payment_method = searchParams.get('payment_method');

    let filteredFunds = funds;

    // Apply filters
    if (search) {
      filteredFunds = filteredFunds.filter(fund =>
        fund.description.toLowerCase().includes(search.toLowerCase()) ||
        fund.transaction_id.toLowerCase().includes(search.toLowerCase()) ||
        fund.notes.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filteredFunds = filteredFunds.filter(fund => fund.category === category);
    }

    if (source) {
      filteredFunds = filteredFunds.filter(fund => fund.source === source);
    }

    if (status) {
      filteredFunds = filteredFunds.filter(fund => fund.status === status);
    }

    if (operator_id) {
      filteredFunds = filteredFunds.filter(fund => fund.operator_id === parseInt(operator_id));
    }

    if (event_id) {
      filteredFunds = filteredFunds.filter(fund => fund.event_id === parseInt(event_id));
    }

    if (date_from) {
      filteredFunds = filteredFunds.filter(fund => fund.date >= date_from);
    }

    if (date_to) {
      filteredFunds = filteredFunds.filter(fund => fund.date <= date_to);
    }

    if (amount_min) {
      filteredFunds = filteredFunds.filter(fund => fund.amount >= parseFloat(amount_min));
    }

    if (amount_max) {
      filteredFunds = filteredFunds.filter(fund => fund.amount <= parseFloat(amount_max));
    }

    if (payment_method) {
      filteredFunds = filteredFunds.filter(fund => fund.payment_method === payment_method);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFunds = filteredFunds.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedFunds,
      pagination: {
        page,
        limit,
        total: filteredFunds.length,
        totalPages: Math.ceil(filteredFunds.length / limit),
      },
      success: true,
      message: 'Funds retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching funds:', error);
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
    if (!body.amount || !body.category || !body.source || !body.description) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    // Create new fund entry
    const newFund = {
      id: funds.length + 1,
      ...body,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      created_by: 1, // This would come from auth context
      updated_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    funds.push(newFund);

    return NextResponse.json({
      data: newFund,
      success: true,
      message: 'Fund entry created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating fund entry:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
