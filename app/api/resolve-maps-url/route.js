import { NextResponse } from 'next/server';

// Helper for OSM geocoding
async function geocodeAddress(address) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`, {
      headers: {
        'User-Agent': 'DiicZoneApp/1.0 (contact: info@diiczone.com)'
      }
    });
    const data = await response.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (err) {
    console.error(`Geocoding error for address "${address}":`, err);
  }
  return null;
}

export async function POST(req) {
  try {
    const { url, city, country } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL o dirección es requerida' }, { status: 400 });
    }

    let finalUrl = url.trim();
    let coords = null;
    let methodUsed = 'url_extraction';

    // Simple URL detection
    const isUrl = finalUrl.match(/^https?:\/\//i) || finalUrl.match(/^www\./i) || finalUrl.includes('.gl/') || finalUrl.includes('.to/') || finalUrl.includes('google.com/maps') || finalUrl.includes('waze.com');

    if (isUrl) {
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

      // Fallback: If it's a Google Maps URL but we couldn't extract coordinates directly,
      // try to extract the place name or search query and geocode it.
      if (!coords) {
        const placeMatch = finalUrl.match(/\/maps\/place\/([^/]+)/);
        const searchMatch = finalUrl.match(/\/maps\/search\/([^/]+)/);
        const qParamMatch = finalUrl.match(/[?&](?:query|q)=([^&]+)/);

        let queryToGeocode = null;
        if (placeMatch) {
          queryToGeocode = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
        } else if (searchMatch) {
          queryToGeocode = decodeURIComponent(searchMatch[1].replace(/\+/g, ' '));
        } else if (qParamMatch) {
          queryToGeocode = decodeURIComponent(qParamMatch[1].replace(/\+/g, ' '));
        }

        if (queryToGeocode) {
          coords = await geocodeAddress(queryToGeocode);
          methodUsed = 'url_place_geocoding';
        }
      }
    } else {
      // It's a text address
      // 1. Try geocoding with city/country context first (to respect local scope)
      if (city || country) {
        const combinedQuery = `${finalUrl}, ${city || ''}, ${country || ''}`
          .replace(/,\s*,/g, ',')
          .trim()
          .replace(/^,|,$/g, '');
        coords = await geocodeAddress(combinedQuery);
        methodUsed = 'combined_geocoding';
      }

      // 2. Try direct geocoding as fallback (for specific/foreign addresses)
      if (!coords) {
        coords = await geocodeAddress(finalUrl);
        methodUsed = 'direct_geocoding';
      }
    }

    return NextResponse.json({
      success: !!coords,
      originalUrl: url,
      resolvedUrl: finalUrl,
      coords,
      methodUsed
    });
  } catch (error) {
    console.error('Error in resolve-maps-url API:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
