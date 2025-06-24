import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import Fonts from '../../utils/constants/fonts';
import {useRequest} from '../../hooks/useRequest';
import {useDispatch, useSelector} from 'react-redux';
import {createSpotifyAPI} from '../../utils/axios/axiosInstance';
import Colors from '../../utils/constants/colors';
import TrackPlayer, {State, usePlaybackState} from 'react-native-track-player';
import {useIsFocused} from '@react-navigation/native';
import {setLikedSongAlbum} from '../../store/playerSlice';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ListDisplay from '../../components/ListDisplay';
import TextCmp from '../../components/Styled/TextCmp';

const LikedSongs = ({}) => {
  const dispatch = useDispatch();
  const {requestHandler, isLoading} = useRequest();
  const accessToken = useSelector(state => state.auth.accessToken);
  const refreshToken = useSelector(state => state.auth.refreshToken);

  const likedSongAlbum = useSelector(state => state.player.likedSongAlbum);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!accessToken) return;

    const spotifyAPI = createSpotifyAPI(accessToken, refreshToken);

    requestHandler({
      requestFn: () => spotifyAPI.get(`/me/tracks`),
      onSuccess: async res => {
        const tracks = res?.data?.items.map(item => item.track);
        const album = {
          id: 'liked-songs',
          name: 'Liked Songs',
          tracks: {items: tracks},
        };
        dispatch(setLikedSongAlbum(album));
      },
      onError: err => {
        console.log(err.response?.data || err.message);
      },
    });
  }, [accessToken, refreshToken, isFocused]);

  const Header = () => {
    return (
      <View style={s.titleView}>
        <TextCmp weight="bold" size={20}>
          {likedSongAlbum?.name || 'Loading...'}
        </TextCmp>
      </View>
    );
  };

  return (
    <ListDisplay
      album={likedSongAlbum}
      tracks={likedSongAlbum?.tracks?.items}
      isLoading={isLoading}
      header={<Header />}
      image={require('../../assets/images/album/liked.png')}
    />
  );
};

export default LikedSongs;

const s = StyleSheet.create({
  titleView: {
    flex: 1,
  },

  row: {
    flexDirection: 'row',
  },
});
