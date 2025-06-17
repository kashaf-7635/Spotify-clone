import {authorize} from 'react-native-app-auth';
import {authConfig} from './authConfig';

export const loginToSpotify = async () => {
  try {
    const result = await authorize(authConfig);
    return result;
  } catch (error) {
    console.log('Spotify login failed', error);
  }
};
