const SPOTIFY_CLIENT_ID = '8ec87f28c4c74d0faf9d2c77b4b07180';
const SPOTIFY_CLIENT_SECRET = 'da0137a04dd2447f97f3c581314238e4';
const SPOTIFY_REDIRECT_URI = 'myspotify://callback';

export const authConfig = {
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
  redirectUrl: SPOTIFY_REDIRECT_URI,
  scopes: [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played',
    'playlist-read-private',
    'user-library-read',
    'user-follow-read',
    'user-read-playback-state',
    'user-library-modify',
  ],
  serviceConfiguration: {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  },
};

// export const authConfig = {
//   issuer: 'https://accounts.spotify.com',
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
//   additionalParameters: {
//     prompt: 'select_account',
//   },
//   usePKCE: true,
//   useNonce: true,
//   prefersEphemeralSession: true,
// };
