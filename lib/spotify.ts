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
 * Searches Spotify for a specific track by an artist, but returns up to 5 tracks in total.
 * The specific recommended track (if found) will be the first item, followed by their other top tracks.
 */
export async function searchArtistTrack(
  artistName: string,
  trackName: string
): Promise<SpotifyTrackData[]> {
  const token = await getSpotifyAccessToken();
  if (!token) return [];

  const results: SpotifyTrackData[] = [];
  const seenTrackIds = new Set<string>();

  try {
    // 1. First, try to find the specific track explicitly
    let specificTrack = null;
    if (trackName) {
      const query = `track:${trackName} artist:${artistName}`;
      const searchRes = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        specificTrack = searchData.tracks?.items?.[0];
        
        if (specificTrack && specificTrack.preview_url) {
          results.push({
            trackName: specificTrack.name,
            previewUrl: specificTrack.preview_url,
            albumArtUrl: specificTrack.album?.images?.[0]?.url || null,
            spotifyUrl: specificTrack.external_urls?.spotify || "",
          });
          seenTrackIds.add(specificTrack.id);
        }
      }
    }

    // 2. Regardless of finding the specific track, fetch the artist's general top tracks
    console.log(`Fetching general top tracks for "${artistName}" to fill out the roster...`);
    
    const artistRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (artistRes.ok) {
      const artistData = await artistRes.json();
      const artistId = artistData.artists?.items?.[0]?.id;
      
      if (artistId) {
        const topTracksRes = await fetch(
          `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (topTracksRes.ok) {
          const topTracksData = await topTracksRes.json();
          const tracksData = topTracksData.tracks || [];
          
          for (const track of tracksData) {
            // Stop once we have 5 tracks
            if (results.length >= 5) break;
            
            // Deduplicate and ONLY add tracks that have a playable preview_url
            if (!seenTrackIds.has(track.id) && track.preview_url) {
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
      `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
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

