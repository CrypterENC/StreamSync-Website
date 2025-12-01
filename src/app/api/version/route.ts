import { NextResponse } from 'next/server';
import { Client } from 'pg';

interface VersionInfo {
  version: string;
  status: 'live' | 'beta' | 'development';
  releaseDate: string;
  title?: string;
}

export async function GET() {
  let client: Client | null = null;

  try {
    // Check if database URL is configured
    if (!process.env.NEON_DATABASE_URL) {
      console.error('NEON_DATABASE_URL environment variable not configured');
      return NextResponse.json({
        version: {
          version: '1.1.0',
          status: 'live' as const,
          releaseDate: new Date().toISOString().split('T')[0]
        },
        status: 'fallback'
      });
    }

    // Create a database client with connection timeout
    client = new Client({
      connectionString: process.env.NEON_DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000, // 10 second timeout
      query_timeout: 10000, // 10 second query timeout
    });

    await client.connect();

    // Query the latest version from changelog table
    const result = await client.query(`
      SELECT version, status, release_date, title
      FROM changelog
      ORDER BY release_date DESC
      LIMIT 1
    `);

    let latestVersion: VersionInfo;

    if (result.rows.length > 0) {
      const row = result.rows[0];
      latestVersion = {
        version: row.version,
        status: row.status || 'live',
        releaseDate: row.release_date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        title: row.title
      };
    } else {
      // Fallback if no version found in database
      latestVersion = {
        version: '1.1.0',
        status: 'live',
        releaseDate: new Date().toISOString().split('T')[0]
      };
    }

    return NextResponse.json({
      version: latestVersion,
      status: 'success'
    });

  } catch (error: any) {
    console.error('Error fetching version from database:', error);

    // Provide more specific error messages
    let errorMessage = 'Failed to fetch version';
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

    // Fallback response
    return NextResponse.json({
      version: {
        version: '1.1.0',
        status: 'live' as const,
        releaseDate: new Date().toISOString().split('T')[0]
      },
      status: 'fallback',
      error: errorMessage
    });
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
