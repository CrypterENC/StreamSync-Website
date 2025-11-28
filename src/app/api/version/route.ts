import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

interface VersionInfo {
  version: string;
  status: 'live' | 'beta' | 'development';
  releaseDate: string;
  title?: string;
}

export async function GET() {
  try {
    // Read changelog file
    const changelogPath = join(process.cwd(), 'CHANGELOG.md');
    const changelogContent = await readFile(changelogPath, 'utf-8');

    // Parse the latest version from changelog
    const lines = changelogContent.split('\n');
    let latestVersion: VersionInfo | null = null;

    for (const line of lines) {
      // Match version header pattern: ## [1.1.0] - 2024-11-28
      const versionMatch = line.match(/^## \[([0-9.]+)\] - (\d{4}-\d{2}-\d{2})/);
      
      if (versionMatch) {
        const [, version, date] = versionMatch;
        
        // Determine status based on version number
        let status: 'live' | 'beta' | 'development' = 'live';
        if (version.includes('beta') || version.includes('b')) {
          status = 'beta';
        } else if (version.includes('alpha') || version.includes('a') || version.includes('0.')) {
          status = 'development';
        }

        latestVersion = {
          version,
          status,
          releaseDate: date
        };
        break; // Get the first (latest) version
      }
    }

    // Fallback if no version found
    if (!latestVersion) {
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

  } catch (error) {
    console.error('Error reading version from changelog:', error);
    
    // Fallback response
    return NextResponse.json({
      version: {
        version: '1.1.0',
        status: 'live' as const,
        releaseDate: new Date().toISOString().split('T')[0]
      },
      status: 'fallback'
    });
  }
}
