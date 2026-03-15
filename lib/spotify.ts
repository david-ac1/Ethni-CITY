/**
 * Helper to fetch a Spotify Client Credentials Access Token
 */
async function getSpotifyAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.warn("Spotify credentials missing in environment variables.");
    return null;
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
      // Re-fetch token every 50 minutes (expires in 60m)
      next: { revalidate: 3000 },
    });

    if (!response.ok) {
      throw new Error(`Spotify auth failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token as string;
  } catch (error) {
    console.error("Error getting Spotify token:", error);
    return null;
  }
}

export interface SpotifyTrackData {
  trackName: string;
  previewUrl: string | null;
  albumArtUrl: string | null;
  spotifyUrl: string;
}

/**
 * Maps common country names to ISO-2 codes for Spotify market lookup.
 */
function getMarketCode(countryName: string): string {
  const mapping: Record<string, string> = {
    "Morocco": "MA",
    "Belgium": "BE",
    "Nigeria": "NG",
    "Senegal": "SN",
    "Mali": "ML",
    "Brazil": "BR",
    "Colombia": "CO",
    "Mexico": "MX",
    "South Africa": "ZA",
    "Kenya": "KE",
    "Ghana": "GH",
    "Ethiopia": "ET",
    "Egypt": "EG",
    "Algeria": "DZ",
    "Tunisia": "TN",
    "United States": "US",
    "United Kingdom": "GB",
    "France": "FR",
    "Germany": "DE",
    "Japan": "JP",
    "Thailand": "TH",
    "Indonesia": "ID",
    "Vietnam": "VN",
    "India": "IN",
  };
  return mapping[countryName] || "US";
}

/**
 * Searches Spotify for a specific track by an artist, but returns up to 5 tracks in total.
 * Implements a tiered market fallback (Local -> US -> Global) and PRIORITIZES tracks with previews.
 * Aggressively checks across markets to find the one that actually provides a preview_url.
 */
export async function searchArtistTrack(
  artistName: string,
  trackName: string,
  country: string = "United States"
): Promise<SpotifyTrackData[]> {
  const token = await getSpotifyAccessToken();
  if (!token) return [];

  const results: SpotifyTrackData[] = [];
  const seenTrackIds = new Set<string>();
  const market = getMarketCode(country);
  const marketsToTry = Array.from(new Set([market, "US", "GB"])); // Prioritize local, then US/GB fallbacks

  try {
    // 1. First, try to find the specific track explicitly (Across markets if needed)
    let specificTrack = null;
    if (trackName) {
      for (const m of marketsToTry) {
        console.log(`[Spotify] Searching for "${trackName}" by "${artistName}" in market: ${m}...`);
        const query = `track:${trackName} artist:${artistName}`;
        const searchRes = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5&market=${m}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const items = searchData.tracks?.items || [];
          
          // Look for a version with a preview in this market
          const withPreview = items.find((t: any) => !!t.preview_url);
          specificTrack = withPreview || items[0];
          
          if (specificTrack && specificTrack.preview_url) {
            console.log(`[Spotify] ✅ Found track with preview in market: ${m}`);
            break; 
          }
        }
      }

      // Fallback: If no specific track found with title, try just the artist name
      if (!specificTrack) {
        for (const m of marketsToTry) {
          console.log(`[Spotify] Specific track search fail for ${artistName}, fallback to artist search in market: ${m}...`);
          const artistFallbackRes = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent('artist:' + artistName)}&type=track&limit=5&market=${m}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (artistFallbackRes.ok) {
            const fallbackData = await artistFallbackRes.json();
            const items = fallbackData.tracks?.items || [];
            const withPreview = items.find((t: any) => !!t.preview_url);
            specificTrack = withPreview || items[0];
            if (specificTrack && specificTrack.preview_url) {
              console.log(`[Spotify] ✅ Found artist track with preview in market: ${m}`);
              break;
            }
          }
        }
      }
        
      if (specificTrack) {
        results.push({
          trackName: specificTrack.name,
          previewUrl: specificTrack.preview_url,
          albumArtUrl: specificTrack.album?.images?.[0]?.url || null,
          spotifyUrl: specificTrack.external_urls?.spotify || "",
        });
        seenTrackIds.add(specificTrack.id);
      }
    }

    // 2. Fetch the artist's general top tracks (Across markets to maximize preview availability)
    const artistSearchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (artistSearchRes.ok) {
      const artistData = await artistSearchRes.json();
      const artistId = artistData.artists?.items?.[0]?.id;
      
      if (artistId) {
        let allMarketTracks: any[] = [];
        let tracksWithPreviews: any[] = [];
        
        for (const m of marketsToTry) {
          console.log(`[Spotify] Fetching top tracks for "${artistName}" in market: ${m}...`);
          const topTracksRes = await fetch(
            `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=${m}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          if (topTracksRes.ok) {
            const topTracksData = await topTracksRes.json();
            const tracks = topTracksData.tracks || [];
            allMarketTracks = [...allMarketTracks, ...tracks];
            
            // Collect any tracks that have previews in THIS market
            const withPrev = tracks.filter((t: any) => !!t.preview_url);
            tracksWithPreviews = [...tracksWithPreviews, ...withPrev];
            
            // If we have enough tracks with previews, we can stop early
            if (tracksWithPreviews.length >= 5) break;
          }
        }

        // Deduplicate
        const uniquePool = Array.from(new Map([...tracksWithPreviews, ...allMarketTracks].map(t => [t.id, t])).values());
        
        // Sort: Previews first, then popularity
        uniquePool.sort((a, b) => {
          if (a.preview_url && !b.preview_url) return -1;
          if (!a.preview_url && b.preview_url) return 1;
          return (b.popularity || 0) - (a.popularity || 0);
        });
        
        for (const track of uniquePool) {
          if (results.length >= 5) break;
          if (!seenTrackIds.has(track.id)) {
            console.log(`[Spotify] Adding track: ${track.name} (Preview: ${!!track.preview_url})`);
            results.push({
              trackName: track.name,
              previewUrl: track.preview_url,
              albumArtUrl: track.album?.images?.[0]?.url || null,
              spotifyUrl: track.external_urls?.spotify || "",
            });
            seenTrackIds.add(track.id);
          }
        }
      }
    }

    return results;
  } catch (error) {
    console.error(`Error fetching Spotify tracks for ${artistName}:`, error);
    return results;
  }
}

/**
 * Fallback: Searches Spotify for an artist and returns their most popular track + album art
 */
export async function getArtistTopTrack(
  artistName: string
): Promise<SpotifyTrackData | null> {
  const token = await getSpotifyAccessToken();
  if (!token) return null;

  try {
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();
    const artist = searchData.artists?.items?.[0];

    if (!artist) return null;

    const topTracksRes = await fetch(
      `https://api.spotify.com/v1/artists/${artist.id}/top-tracks`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!topTracksRes.ok) return null;
    const topTracksData = await topTracksRes.json();
    const topTrack = topTracksData.tracks?.[0];

    if (!topTrack) return null;

    return {
      trackName: topTrack.name,
      previewUrl: topTrack.preview_url,
      albumArtUrl: topTrack.album?.images?.[0]?.url || null,
      spotifyUrl: topTrack.external_urls?.spotify || "",
    };
  } catch (error) {
    console.error(`Error fetching top track for ${artistName}:`, error);
    return null;
  }
}

