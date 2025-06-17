import {refresh} from 'react-native-app-auth';
import axios from 'axios';
import {authConfig} from '../auth/authConfig';
import {Alert} from 'react-native';
import {logoutFromSpotify} from '../../components/Headers/HomeHeader';


export const createSpotifyAPI = (initialAccessToken, initialRefreshToken) => {
  let accessToken = initialAccessToken;
  let refreshToken = initialRefreshToken;

  const api = axios.create({
    baseURL: 'https://api.spotify.com/v1',
  });

  const getAccessToken = () => accessToken;

  const refreshAccessToken = async () => {
    console.log('refreshing token...', refreshToken);

    try {
      const result = await refresh(authConfig, {refreshToken});
      accessToken = result.accessToken;
      refreshToken = result.refreshToken;
      console.log(result);
    } catch (err) {
      console.error('Failed to refresh token:', err);
      logoutFromSpotify();
      Alert.alert('Session Expired', 'Please log in again.');
    }
  };

  api.interceptors.request.use(
    async config => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error),
  );

  api.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (
        error.response?.data?.error?.status === 401 &&
        error.response.data.error.message === 'The access token expired' &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          await refreshAccessToken();
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    },
  );

  return api;
};
