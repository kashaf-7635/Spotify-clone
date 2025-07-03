import {authorize, prefetchConfiguration} from 'react-native-app-auth';
import {authConfig} from './authConfig';
import axios from 'axios';

export const loginToSpotify = async () => {
  try {
    console.log('login in.....');
    console.log(authConfig);
    await prefetchConfiguration(authConfig);
    const result = await authorize(authConfig);
    console.log('login done.....');
    return result;
  } catch (error) {
    console.log('Spotify login failed', error);
  }
};

// export const loginToSpotify = async () => {
//   const data = {
//     grant_type: 'client_credentials',
//     client_id: authConfig.clientId,
//     client_secret: authConfig.clientSecret,
//   };
//   try {
//     const result = await axios.post(
//       'https://accounts.spotify.com/api/token',
//       data,
//       {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       },
//     );
//     return result;
//   } catch (error) {
//     console.log('Spotify login failed', error);
//   }
// };
