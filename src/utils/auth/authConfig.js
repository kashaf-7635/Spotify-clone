export const SPOTIFY_CLIENT_ID = '8ec87f28c4c74d0faf9d2c77b4b07180';
export const SPOTIFY_CLIENT_SECRET = 'da0137a04dd2447f97f3c581314238e4';
export const SPOTIFY_REDIRECT_URI = 'myspotify://callback';
export const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
export const scopes = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-read-recently-played',
  'playlist-read-private',
  'user-library-read',
  'user-follow-read',
  'user-read-playback-state',
  'user-library-modify',
];

// export const authConfig = {
//   clientId: SPOTIFY_CLIENT_ID,
//   clientSecret: SPOTIFY_CLIENT_SECRET,
//   redirectUrl: SPOTIFY_REDIRECT_URI,
//   scopes: [
//     'user-read-private',
//     'user-read-email',
//     'user-top-read',
//     'user-read-recently-played',
//     'playlist-read-private',
//     'user-library-read',
//     'user-follow-read',
//     'user-read-playback-state',
//     'user-library-modify',
//   ],
//   serviceConfiguration: {
//     authorizationEndpoint: 'https://accounts.spotify.com/authorize',
//     tokenEndpoint: 'https://accounts.spotify.com/api/token',
//   },
// };

// export const authConfig = {
//   clientId: '8ec87f28c4c74d0faf9d2c77b4b07180',
//   redirectUrl: 'myspotify://callback',
//   scopes: [
//     'user-read-private',
//     'user-read-email',
//     'user-top-read',
//     'user-read-recently-played',
//     'playlist-read-private',
//     'user-library-read',
//     'user-follow-read',
//     'user-read-playback-state',
//     'user-library-modify',
//   ],
//   serviceConfiguration: {
//     authorizationEndpoint: 'https://accounts.spotify.com/authorize',
//     tokenEndpoint: 'https://accounts.spotify.com/api/token',
//   },
//   usePKCE: true,
//   useNonce: false,
//   prefersEphemeralSession: true,
// };
