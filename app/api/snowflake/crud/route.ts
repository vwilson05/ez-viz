import { NextRequest, NextResponse } from 'next/server';
import { getConnection, insertData, updateData, deleteData } from '@/app/lib/snowflake';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.operation) {
      return NextResponse.json(
        { error: 'Operation type is required (insert, update, delete)' },
        { status: 400 }
      );
    }

    if (!body.tableName) {
      return NextResponse.json(
        { error: 'Table name is required' },
        { status: 400 }
      );
    }

    if (!body.connection) {
      return NextResponse.json(
        { error: 'Connection information is required' },
        { status: 400 }
      );
    }

    const { operation, tableName, data, whereClause, whereParams, connection } = body;

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
      account: connection.account,
      username: connection.username,
      password: connection.password,
      warehouse: connection.warehouse,
      database: connection.database,
      schema: connection.schema || 'PUBLIC',
      role: connection.role
    });

    let result;

    // Perform requested operation
    switch (operation) {
      case 'insert':
        if (!data) {
          return NextResponse.json(
            { error: 'Data is required for insert operations' },
            { status: 400 }
          );
        }
        result = await insertData(conn, tableName, data);
        break;

      case 'update':
        if (!data) {
          return NextResponse.json(
            { error: 'Data is required for update operations' },
            { status: 400 }
          );
        }
        if (!whereClause) {
          return NextResponse.json(
            { error: 'Where clause is required for update operations' },
            { status: 400 }
          );
        }
        result = await updateData(conn, tableName, data, whereClause, whereParams || []);
        break;

      case 'delete':
        if (!whereClause) {
          return NextResponse.json(
            { error: 'Where clause is required for delete operations' },
            { status: 400 }
          );
        }
        result = await deleteData(conn, tableName, whereClause, whereParams || []);
        break;

      default:
        return NextResponse.json(
          { error: `Unknown operation: ${operation}` },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error performing CRUD operation:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to perform CRUD operation' },
      { status: 500 }
    );
  }
} 