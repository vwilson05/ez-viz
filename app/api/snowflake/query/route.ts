import { NextRequest, NextResponse } from 'next/server';
import { getConnection, executeQuery } from '@/app/lib/snowflake';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    if (!body.connection) {
      return NextResponse.json(
        { error: 'Connection information is required' },
        { status: 400 }
      );
    }

    const { query, connection } = body;

    // Validate connection
    const { account, username, password, warehouse, database } = connection;
    if (!account || !username || !password || !warehouse || !database) {
      return NextResponse.json(
        { error: 'Missing required connection parameters' },
        { status: 400 }
      );
    }

    // Establish connection
    const conn = await getConnection({
      account,
      username,
      password,
      warehouse,
      database,
      schema: connection.schema || 'PUBLIC',
      role: connection.role
    });

    // Execute query
    console.log(`Executing query in schema ${connection.schema || 'PUBLIC'}: ${query}`);
    const result = await executeQuery(conn, query);
    
    // Format the result for the client
    interface QueryResult {
      columns: string[];
      rows: Record<string, any>[];
      totalRows: number;
      queryId: string;
    }
    
    let formattedResult: QueryResult = {
      columns: [],
      rows: [],
      totalRows: 0,
      queryId: 'query-' + Date.now()
    };
    
    if (result && result.length > 0) {
      // Extract column names from first row
      const firstRow = result[0];
      formattedResult.columns = Object.keys(firstRow);
      formattedResult.rows = result;
      formattedResult.totalRows = result.length;
    }

    return NextResponse.json(formattedResult);
  } catch (error: any) {
    console.error('Error executing query:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to execute query' },
      { status: 500 }
    );
  }
} 