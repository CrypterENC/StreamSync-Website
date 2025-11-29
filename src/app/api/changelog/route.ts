import { NextResponse } from 'next/server';
import { Client } from 'pg';

// Helper function to map category names to change types
function mapChangeType(category: string): 'added' | 'removed' | 'updated' | 'fixed' {
  const mapping: Record<string, 'added' | 'removed' | 'updated' | 'fixed'> = {
    'website': 'updated',
    'website updates': 'updated',
    'bot': 'added',
    'bot updates': 'added',
    'improved': 'updated',
    'fixed': 'fixed',
    'added': 'added',
    'removed': 'removed',
    'updated': 'updated'
  };
  return mapping[category.toLowerCase()] || 'added';
}

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
    const changelog = changelogResult.rows.map(row => {
      // Parse changes if it's a string (JSON), otherwise use as is
      let parsedChanges = [];
      if (row.changes) {
        if (typeof row.changes === 'string') {
          try {
            const changesData = JSON.parse(row.changes);
            // Handle both array format and object format
            if (Array.isArray(changesData)) {
              parsedChanges = changesData;
            } else if (typeof changesData === 'object') {
              // If it's an object with categories (website, bot, improved, fixed)
              // Convert to flat array with type information
              parsedChanges = [];
              Object.entries(changesData).forEach(([type, items]: [string, any]) => {
                if (Array.isArray(items)) {
                  items.forEach((item: string) => {
                    parsedChanges.push({
                      type: mapChangeType(type),
                      description: item
                    });
                  });
                }
              });
            }
          } catch (e) {
            console.error('Error parsing changes JSON:', e);
            parsedChanges = [];
          }
        } else if (Array.isArray(row.changes)) {
          parsedChanges = row.changes;
        } else if (typeof row.changes === 'object') {
          // Handle object format directly
          Object.entries(row.changes).forEach(([type, items]: [string, any]) => {
            if (Array.isArray(items)) {
              items.forEach((item: string) => {
                parsedChanges.push({
                  type: mapChangeType(type),
                  description: item
                });
              });
            }
          });
        }
      }

      return {
        version: row.version,
        title: row.title,
        description: row.description,
        changes: parsedChanges,
        releaseDate: row.release_date?.toISOString(),
        status: row.status
      };
    });

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
