import React, {useEffect, useState} from 'react';
import {useRequest} from '../../hooks/useRequest';
import {useSelector} from 'react-redux';
import {createSpotifyAPI} from '../../utils/axios/axiosInstance';
import ListDisplay from '../../components/ListDisplay';

const Album = ({route}) => {
  const albumId = route?.params.albumId;
  const {requestHandler, isLoading} = useRequest();zzzz
  const accessToken = useSelector(state => state.auth.accessToken);
  const refreshToken = useSelector(state => state.auth.refreshToken);

  const [album, setAlbum] = useState(null);
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    if (!accessToken) return;

    const spotifyAPI = createSpotifyAPI(accessToken, refreshToken);
    requestHandler({
      requestFn: () => spotifyAPI.get(`/albums/${albumId}`),
      onSuccess: async res => {
        setAlbum(res.data);
        requestHandler({
          requestFn: () =>
            spotifyAPI.get(`/artists/${res.data.artists?.[0]?.id}`),
          onSuccess: res => {
            setArtist(res.data);
          },
        });
      },
      onError: err => {
        console.log(err.response?.data || err.message);
      },
    });
  }, [accessToken, route]);

  return <ListDisplay album={album} artist={artist} isLoading={isLoading} />;
};

export default Album;
