/**
 * Utility to interact with the iTunes Search API.
 * This is used as the primary music engine for Ethni-city to ensure reliable 30-second audio previews.
 */

export interface MusicTrackData {
  trackName: string;
  previewUrl: string | null;
  albumArtUrl: string | null;
  musicUrl: string;
}

/**
 * Searches iTunes for an artist's tracks.
 * Returns a list of tracks with previews.
 */
export async function searchITunesTracks(
  artistName: string,
  countryCode: string = "US"
): Promise<MusicTrackData[]> {
  try {
    // We search for the artist and limit results to tracks
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&media=music&entity=song&limit=10&country=${countryCode}`;
    
    const response = await fetch(url);
    if (!response.ok) {
        // Retry with US if regional code fails
        if (countryCode !== "US") {
            return searchITunesTracks(artistName, "US");
        }
        return [];
    }

    const data = await response.json();
    const results = data.results || [];

    return results.map((item: any) => ({
      trackName: item.trackName,
      previewUrl: item.previewUrl || null,
      albumArtUrl: item.artworkUrl100 ? item.artworkUrl100.replace("100x100bb", "600x600bb") : null,
      musicUrl: item.trackViewUrl || item.artistViewUrl || "",
    }));
  } catch (error) {
    console.error("iTunes search error:", error);
    return [];
  }
}

/**
 * Validates if an artist exists on iTunes and has a previewable track.
 */
export async function validateArtistOnITunes(artistName: string, countryCode: string = "US") {
    const tracks = await searchITunesTracks(artistName, countryCode);
    const withPreview = tracks.filter(t => !!t.previewUrl);
    
    if (withPreview.length > 0) {
        return {
            isValid: true,
            topTracks: withPreview.slice(0, 5)
        };
    }
    
    // Fallback search without country restrict if local branch is empty
    if (countryCode !== "US") {
        return validateArtistOnITunes(artistName, "US");
    }

    return { isValid: tracks.length > 0, topTracks: tracks.slice(0, 5) };
}
