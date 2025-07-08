import {
  scopes,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
} from './authConfig';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import axios from 'axios';

export const handleOpenInAppBrowser = async () => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${SPOTIFY_REDIRECT_URI}&response_type=code&scope=${scopes}&show_dialog=${true}`;
  try {
    if (await InAppBrowser.isAvailable()) {

      
      const response = await InAppBrowser.openAuth(
        authUrl,
        SPOTIFY_REDIRECT_URI,
        {},
      );
      console.log(response);

      let code = response.url.split('code=')[1];
      console.log(code, 'code');

      if (code) {
        const res = await getAccessToken(code);
        return res;
      }
    }
  } catch (error) {
    console.error('Error opening InAppBrowser:', error);
  }
};

export const getAccessToken = async code => {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', SPOTIFY_REDIRECT_URI);

  const authString = `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`;
  const encodedAuth = btoa(authString);

  try {
    const result = await axios.post(
      'https://accounts.spotify.com/api/token',
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${encodedAuth}`,
        },
      },
    );
    return result.data;
  } catch (error) {
    console.log('Spotify login failed', error.response?.data);
  }
};
