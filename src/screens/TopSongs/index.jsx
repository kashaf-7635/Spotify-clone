import React, {useEffect, useState} from 'react';
import {useRequest} from '../../hooks/useRequest';
import {useSelector} from 'react-redux';
import {createSpotifyAPI} from '../../utils/axios/axiosInstance';
import ListDisplay from '../../components/ListDisplay';
import {StyleSheet, View} from 'react-native';
import TextCmp from '../../components/Styled/TextCmp';

const TopSongs = ({}) => {
  const {requestHandler, isLoading} = useRequest();

  const accessToken = useSelector(state => state.auth.accessToken);
  const refreshToken = useSelector(state => state.auth.refreshToken);

  const [album, setAlbum] = useState({});

  useEffect(() => {
    if (!accessToken) return;

    const spotifyAPI = createSpotifyAPI(accessToken, refreshToken);
    requestHandler({
      requestFn: () => spotifyAPI.get(`/me/top/tracks`),
      onSuccess: async res => {
        const topSongsAlbum = {
          id: 'top-songs',
          name: 'Your Top Songs',
          tracks: {items: res.data.items},
        };
        setAlbum(topSongsAlbum);
      },
      onError: err => {
        console.log(err.response?.data || err.message);
      },
    });
  }, [accessToken]);

  const Header = () => {
    return (
      <View style={s.titleView}>
        <TextCmp weight="bold" size={20}>
          {album?.name || 'Loading...'}
        </TextCmp>
      </View>
    );
  };

  return (
    <ListDisplay
      album={album}
      header={<Header />}
      isLoading={isLoading}
      tracks={album?.tracks?.items}
      image={require('../../assets/images/album/1.png')}
    />
  );
};

export default TopSongs;

const s = StyleSheet.create({
  titleView: {
    flex: 1,
  },

  row: {
    flexDirection: 'row',
  },
});
