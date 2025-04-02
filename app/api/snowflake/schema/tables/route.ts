import { NextRequest, NextResponse } from 'next/server';
import { getConnection, getTablesForSchema } from '@/app/lib/snowflake';

export async function POST(req: NextRequest) {
  try {
    console.log('Received tables request');
    
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

    if (!body) {
      console.log('No body provided');
      return NextResponse.json(
        { error: 'Connection information is required' },
        { status: 400 }
      );
    }

    const { account, username, password, warehouse, database, schema } = body;
    
    if (!schema) {
      console.log('Missing schema parameter');
      return NextResponse.json(
        { error: 'Schema is required' },
        { status: 400 }
      );
    }
    
    if (!account || !username || !password || !warehouse || !database) {
      console.log('Missing required connection parameters');
      return NextResponse.json(
        { error: 'Missing required connection parameters' },
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
      schema: schema || 'PUBLIC',
      role: body.role
    });
    console.log('Connection established successfully');

    // Get tables for the specified schema
    console.log(`Fetching tables for schema: ${schema}`);
    const tables = await getTablesForSchema(conn, schema);
    console.log(`Found ${tables.length} tables in schema ${schema}`);

    // Return response
    console.log('Returning tables response');
    return NextResponse.json(tables);
  } catch (error: any) {
    console.error('Error fetching tables:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tables' },
      { status: 500 }
    );
  }
} 