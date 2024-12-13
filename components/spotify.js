import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();
let refreshToken = process.env.NEXT_PUBLIC_SPOTIFY_REFRESH_TOKEN;

export const authenticateSpotify = async () => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: `grant_type=refresh_token&refresh_token=${refreshToken}`
  });
  const data = await response.json();
  spotifyApi.setAccessToken(data.access_token);
};

export const fetchPlaylists = async () => {
    await authenticateSpotify();
    const response = await spotifyApi.getUserPlaylists();
    return response.items;
  };
  
  export const fetchSongsByPlaylist = async (playlistId) => {
    await authenticateSpotify();
    const response = await spotifyApi.getPlaylistTracks(playlistId, { limit: 100 });
    return response.items.map(item => item.track);
  };

export const fetchSongsByGenre = async (genre) => {
  const response = await spotifyApi.searchTracks(`genre:${genre}`, { limit: 10 });
  return response.tracks.items;
};

export const playTrack = async (trackUri) => {
  await authenticateSpotify();
  await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${spotifyApi.getAccessToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ uris: [trackUri] })
  });
};

export const setShuffle = async (state) => {
    await authenticateSpotify();
    await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${state}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${spotifyApi.getAccessToken()}`
      }
    });
  };