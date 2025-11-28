import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  let client: Client | null = null;

  try {
    // Check if database URL is configured
    if (!process.env.NEON_DATABASE_URL) {
      console.error('NEON_DATABASE_URL environment variable not configured');
      return NextResponse.json(
        {
          error: 'Database configuration missing',
          changelog: []
        },
        { status: 500 }
      );
    }

    // Create a database client with connection timeout
    client = new Client({
      connectionString: process.env.NEON_DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000, // 10 second timeout
      query_timeout: 10000, // 10 second query timeout
    });

    await client.connect();

    // Query changelog data
    const changelogResult = await client.query(`
      SELECT
        version,
        title,
        description,
        changes,
        release_date,
        status
      FROM changelog
      ORDER BY release_date DESC
      LIMIT 10
    `);

    // Format the response
    const changelog = changelogResult.rows.map(row => ({
      version: row.version,
      title: row.title,
      description: row.description,
      changes: row.changes || [],
      releaseDate: row.release_date?.toISOString(),
      status: row.status
    }));

    return NextResponse.json({
      changelog,
      status: 'success'
    });
  } catch (error: any) {
    console.error('Error fetching changelog:', error);

    // Provide more specific error messages
    let errorMessage = 'Failed to fetch changelog';
    let statusCode = 500;

    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Database connection refused';
      statusCode = 503;
    } else if (error.code === '42P01') {
      errorMessage = 'Changelog table not found - database may need initialization';
      statusCode = 503;
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Database query timeout';
      statusCode = 504;
    } else if (error.message?.includes('authentication')) {
      errorMessage = 'Database authentication failed';
      statusCode = 500;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        changelog: [],
        status: 'error'
      },
      { status: statusCode }
    );
  } finally {
    // Ensure client is always closed
    if (client) {
      try {
        await client.end();
      } catch (closeError) {
        console.error('Error closing database client:', closeError);
      }
    }
  }
}
