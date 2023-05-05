import postgres from 'postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get body from request
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  // Get DataBase URL to be used in query
  const DATABASE_URL = process.env.DATABASE_URL;
  // Establish connection with neon db
  // @ts-ignore
  const sql = postgres(DATABASE_URL, { ssl: require });
  // Try and catch to get users from database
  try {
    const result1 = await sql.unsafe(
      `SELECT
        name
      FROM
        exchnageusers
      WHERE    
        address = '${address}'`
    );
    return NextResponse.json(result1, { status: 201 });
  } catch (error) {
    return NextResponse.json({ response: 'error' }, { status: 500 });
  }
}
