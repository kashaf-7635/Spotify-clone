import React, {useEffect, useState} from 'react';
import {useRequest} from '../../hooks/useRequest';
import {useSelector} from 'react-redux';
import {createSpotifyAPI} from '../../utils/axios/axiosInstance';
import ListDisplay from '../../components/ListDisplay';
import {StyleSheet, View} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import Colors from '../../utils/constants/colors';
import TextCmp from '../../components/Styled/TextCmp';
import ImageCmp from '../../components/Styled/ImageCmp';
import Entypo from '@react-native-vector-icons/entypo';
import {formatDate, formatTotalDuration} from '../../utils/helpers/time';

const Playlist = ({route, navigation}) => {
  const playlistId = route?.params.playlistId;
  const {requestHandler, isLoading} = useRequest();
  const accessToken = useSelector(state => state.auth.accessToken);
  const refreshToken = useSelector(state => state.auth.refreshToken);
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (!accessToken) return;

    const spotifyAPI = createSpotifyAPI(accessToken, refreshToken);
    requestHandler({
      requestFn: () => spotifyAPI.get(`/playlists/${playlistId}`),
      onSuccess: async res => {
        setPlaylist(res.data);
        const tracks = res?.data?.tracks?.items.map(item => item.track);
        setTracks(tracks);
      },
      onError: err => {
        console.log(err.response?.data || err.message);
      },
    });
  }, [accessToken, route]);

  const Header = () => {
    return (
      <View style={s.titleView}>
        <TextCmp weight="bold" size={20}>
          {playlist?.name || 'Loading...'}
        </TextCmp>

        <View style={[{marginTop: moderateScale(10)}]}>
          <TextCmp weight="bold" size={17}>
            {playlist?.owner?.display_name || ''}
          </TextCmp>
        </View>

        <View style={[{marginTop: moderateScale(10)}]}>
          <TextCmp size={17}>
            {formatTotalDuration(tracks)}
          </TextCmp>
        </View>
      </View>
    );
  };

  return (
    <ListDisplay
      album={playlist}
      tracks={tracks}
      isLoading={isLoading}
      header={<Header />}
    />
  );
};

export default Playlist;

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  titleView: {
    flex: 1,
  },
});
