import { NextRequest, NextResponse } from 'next/server';
import { getConnection, getDatabaseSchema } from '@/app/lib/snowflake';

export async function POST(req: NextRequest) {
  try {
    console.log('Received schema request');
    
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    console.log('Request body:', {
      account: body?.account,
      username: body?.username,
      hasPassword: !!body?.password,
      warehouse: body?.warehouse,
      database: body?.database,
      schema: body?.schema,
      role: body?.role
    });

    // Validate connection
    if (!body) {
      console.log('No body provided');
      return NextResponse.json(
        { error: 'Connection information is required' },
        { status: 400 }
      );
    }

    const { account, username, password, warehouse, database } = body;
    
    if (!account) {
      console.log('Missing account parameter');
      return NextResponse.json(
        { error: 'Account is required' },
        { status: 400 }
      );
    }
    
    if (!username) {
      console.log('Missing username parameter');
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }
    
    if (!password) {
      console.log('Missing password parameter');
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }
    
    if (!warehouse) {
      console.log('Missing warehouse parameter');
      return NextResponse.json(
        { error: 'Warehouse is required' },
        { status: 400 }
      );
    }
    
    if (!database) {
      console.log('Missing database parameter');
      return NextResponse.json(
        { error: 'Database is required' },
        { status: 400 }
      );
    }

    // Establish connection
    console.log('Attempting to establish connection to Snowflake');
    const conn = await getConnection({
      account,
      username,
      password,
      warehouse,
      database,
      schema: body.schema || 'PUBLIC',
      role: body.role
    });
    console.log('Connection established successfully');

    // Get schema information
    console.log('Fetching schema information');
    const schema = await getDatabaseSchema(conn);
    console.log('Schema fetched successfully');

    // Return response
    console.log('Returning schema response');
    return NextResponse.json(schema);
  } catch (error: any) {
    console.error('Error fetching schema:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch schema' },
      { status: 500 }
    );
  }
} 