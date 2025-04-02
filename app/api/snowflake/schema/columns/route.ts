import { NextRequest, NextResponse } from 'next/server';
import { getConnection, getColumnsForTable } from '@/app/lib/snowflake';

export async function POST(req: NextRequest) {
  try {
    console.log('Received columns request');
    
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
      tableName: body?.tableName,
      role: body?.role
    });

    if (!body) {
      console.log('No body provided');
      return NextResponse.json(
        { error: 'Connection information is required' },
        { status: 400 }
      );
    }

    const { account, username, password, warehouse, database, schema, tableName } = body;
    
    if (!schema) {
      console.log('Missing schema parameter');
      return NextResponse.json(
        { error: 'Schema is required' },
        { status: 400 }
      );
    }
    
    if (!tableName) {
      console.log('Missing tableName parameter');
      return NextResponse.json(
        { error: 'Table name is required' },
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

    // Get columns for the specified table
    console.log(`Fetching columns for table: ${schema}.${tableName}`);
    const columns = await getColumnsForTable(conn, schema, tableName);
    console.log(`Found ${columns.length} columns in table ${schema}.${tableName}`);

    // Return response
    console.log('Returning columns response');
    return NextResponse.json(columns);
  } catch (error: any) {
    console.error('Error fetching columns:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch columns' },
      { status: 500 }
    );
  }
} 