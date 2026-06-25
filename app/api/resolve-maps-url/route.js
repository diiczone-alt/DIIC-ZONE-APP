import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL es requerida' }, { status: 400 });
    }

    let finalUrl = url.trim();
    let coords = null;

    // Follow redirect if it looks like a shortened URL (Google Maps or Waze)
    const isShortened = 
      finalUrl.includes('maps.app.goo.gl') || 
      finalUrl.includes('goo.gl/maps') || 
      finalUrl.includes('waze.to') || 
      finalUrl.includes('waze.com/ul');

    if (isShortened) {
      try {
        const response = await fetch(finalUrl, {
          method: 'GET',
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
          }
        });
        finalUrl = response.url;
      } catch (err) {
        console.error('Error resolving short URL:', err);
      }
    }

    // Coordinate extraction regex patterns
    // 1. Google Maps @lat,lng format
    const atMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      coords = [parseFloat(atMatch[1]), parseFloat(atMatch[2])];
    } else {
      // 2. Google Maps query parameters q=lat,lng or query=lat,lng
      const queryMatch = finalUrl.match(/[?&](?:query|q)=(-?\d+\.\d+)(?:,|%2C)(-?\d+\.\d+)/i);
      if (queryMatch) {
        coords = [parseFloat(queryMatch[1]), parseFloat(queryMatch[2])];
      } else {
        // 3. Google Maps internal !3d lat !4d lng format
        const dMatch = finalUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
        if (dMatch) {
          coords = [parseFloat(dMatch[1]), parseFloat(dMatch[2])];
        } else {
          // 4. Waze ll=lat,lng query parameter
          const wazeMatch = finalUrl.match(/[?&]ll=(-?\d+\.\d+)(?:,|%2C)(-?\d+\.\d+)/i);
          if (wazeMatch) {
            coords = [parseFloat(wazeMatch[1]), parseFloat(wazeMatch[2])];
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      originalUrl: url,
      resolvedUrl: finalUrl,
      coords
    });
  } catch (error) {
    console.error('Error in resolve-maps-url API:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
