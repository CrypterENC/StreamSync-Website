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
          serverCount: 0,
          songsPlayed: 0
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

    // Query all analytics data at once
    const analyticsResult = await client.query(`
      SELECT metric_name, metric_value, last_updated
      FROM bot_analytics
      WHERE metric_name IN ('server_count', 'songs_played')
    `);

    // Parse results into an object
    const analytics: { [key: string]: { value: number; lastUpdated: string | null } } = {};
    analyticsResult.rows.forEach(row => {
      analytics[row.metric_name] = {
        value: row.metric_value,
        lastUpdated: row.last_updated?.toISOString() || null
      };
    });

    // Extract individual metrics with fallbacks
    const serverCount = Number(analytics.server_count?.value) || 0;
    const songsPlayed = Number(analytics.songs_played?.value) || 0;

    return NextResponse.json({
      serverCount,
      songsPlayed,
      lastUpdated: analytics.server_count?.lastUpdated || analytics.songs_played?.lastUpdated || null,
      status: 'success'
    });
  } catch (error: any) {
    console.error('Error fetching server count:', error);

    // Provide more specific error messages
    let errorMessage = 'Failed to fetch server count';
    let statusCode = 500;

    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Database connection refused';
      statusCode = 503;
    } else if (error.code === '42P01') {
      errorMessage = 'Analytics table not found - database may need initialization';
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
        serverCount: 0,
        songsPlayed: 0,
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
