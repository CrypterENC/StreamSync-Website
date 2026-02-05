import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  let client: Client | null = null;

  try {
    if (!process.env.NEON_DATABASE_URL) {
      console.error('NEON_DATABASE_URL environment variable not configured');
      return NextResponse.json(
        {
          error: 'Database configuration missing',
          servers: []
        },
        { status: 500 }
      );
    }

    client = new Client({
      connectionString: process.env.NEON_DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
      query_timeout: 10000,
    });

    await client.connect();

    // Fetch the server_list metric from bot_analytics
    const serverListResult = await client.query(`
      SELECT metric_value FROM bot_analytics WHERE metric_name = 'server_list' LIMIT 1
    `);

    let servers: Array<{ id: string; name: string; memberCount: number; iconURL?: string }> = [];

    if (serverListResult.rows.length > 0) {
      const serverData = serverListResult.rows[0].metric_value;
      
      try {
        // Parse the JSON string
        const parsed = typeof serverData === 'string' ? JSON.parse(serverData) : serverData;
        
        if (Array.isArray(parsed)) {
          servers = parsed
            .filter(s => s.id && s.name && s.name !== 'Backdoor University')
            .map(s => ({
              id: String(s.id),
              name: s.name,
              memberCount: s.memberCount || 0,
              iconURL: s.iconURL || undefined
            }))
            .sort((a, b) => b.memberCount - a.memberCount);
        }
      } catch (parseError) {
        console.error('Error parsing server data:', parseError);
      }
    }

    return NextResponse.json({
      servers,
      totalServers: servers.length,
      status: 'success'
    });
  } catch (error: any) {
    console.error('Error fetching servers:', error);

    let errorMessage = 'Failed to fetch servers';
    let statusCode = 500;

    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Database connection refused';
      statusCode = 503;
    } else if (error.code === '42P01') {
      errorMessage = 'Analytics table not found';
      statusCode = 503;
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Database query timeout';
      statusCode = 504;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        servers: [],
        status: 'error'
      },
      { status: statusCode }
    );
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (closeError) {
        console.error('Error closing database client:', closeError);
      }
    }
  }
}
