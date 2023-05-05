import postgres from 'postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Get body from request
  let body = await request.json();
  console.log(body);
  // Get DataBase URL to be used in query
  const DATABASE_URL = process.env.DATABASE_URL;
  // Establish connection with neon db
  // @ts-ignore
  const sql = postgres(DATABASE_URL, { ssl: require });
  // Try and catch for inserting data to the database
  try {
    const result1 = await sql.unsafe(
      ` INSERT
          INTO
        exchnageusers
          (name,email,address)
        VALUES
          ('${body.userName}','${body.userEmail}','${body.userWallet}')`
    );
    return NextResponse.json({ response: 'success' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ response: 'error' }, { status: 500 });
  }
}
