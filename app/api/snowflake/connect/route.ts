import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/app/lib/snowflake';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { account, username, password, warehouse, database, schema } = body;
    
    // Validate required fields
    if (!account || !username || !password || !warehouse || !database) {
      return NextResponse.json(
        { error: 'Missing required connection parameters' },
        { status: 400 }
      );
    }
    
    // Attempt to connect to Snowflake
    const connection = await getConnection({
      account,
      username,
      password,
      warehouse,
      database,
      schema: schema || 'PUBLIC'
    });
    
    // Success, return connection info (excluding sensitive data)
    return NextResponse.json({
      success: true,
      connection: {
        account,
        username,
        database,
        warehouse,
        schema: schema || 'PUBLIC'
      }
    });
  } catch (error: any) {
    console.error('Error connecting to Snowflake:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to connect to Snowflake',
        message: error.message || 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 