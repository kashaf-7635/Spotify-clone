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
import {formatDate} from '../../utils/helpers/time';

const Album = ({route}) => {
  const albumId = route?.params.albumId;
  const {requestHandler, isLoading} = useRequest();

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

  const Header = () => {
    return (
      <View style={s.titleView}>
        <TextCmp weight="bold" size={20}>
          {album?.name || 'Loading...'}
        </TextCmp>

        <View style={[s.row, {marginTop: moderateScale(10)}]}>
          <ImageCmp
            source={artist?.images?.[0].url}
            size={30}
            borderRadius={15}
          />
          <View
            style={{
              justifyContent: 'center',
              marginLeft: scale(10),
            }}>
            <TextCmp weight="bold" size={17}>
              {artist?.name || ''}
            </TextCmp>
          </View>
        </View>
        <View style={{marginTop: verticalScale(10)}}>
          <TextCmp color={Colors.text400}>
            {album?.type.slice(0, 1).toUpperCase() + album?.type.slice(1)}
            <Entypo
              name="dot-single"
              color={'white'}
              size={moderateScale(15)}
            />
            {formatDate(album?.release_date)}
          </TextCmp>
        </View>
      </View>
    );
  };

  return (
    <ListDisplay
      album={album}
      header={<Header />}
      isLoading={isLoading}
      tracks={album?.tracks.items}
    />
  );
};

export default Album;

const s = StyleSheet.create({
  titleView: {
    flex: 1,
  },

  row: {
    flexDirection: 'row',
  },
});
