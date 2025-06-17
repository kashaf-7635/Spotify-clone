import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import SimpleLineIcons from '@react-native-vector-icons/simple-line-icons';
import Entypo from '@react-native-vector-icons/entypo';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import Fonts from '../../utils/constants/fonts';
import {useRequest} from '../../hooks/useRequest';
import {useDispatch, useSelector} from 'react-redux';
import {createSpotifyAPI} from '../../utils/axios/axiosInstance';
import Loading from '../../components/Loading';
import Colors from '../../utils/constants/colors';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Foundation from '@react-native-vector-icons/foundation';
import TrackCard from '../../components/Cards/TrackCard';
import {State, usePlaybackState} from 'react-native-track-player';
import {setPlayingObj} from '../../store/playerSlice';
import {
  getCurrentTrack,
  loadAndPlayAlbum,
  playAlbumFromIndex,
  togglePlayPause,
} from '../../utils/helpers/player';
import TextCmp from '../../components/Styled/TextCmp';
import ImageCmp from '../../components/Styled/ImageCmp';

const Album = ({route, navigation}) => {
  const dispatch = useDispatch();

  const albumId = route?.params.albumId;
  const {requestHandler, isLoading} = useRequest();
  const accessToken = useSelector(state => state.auth.accessToken);
  const refreshToken = useSelector(state => state.auth.refreshToken);
  const playingObj = useSelector(state => state.player.playingObj);
  const [album, setAlbum] = useState(null);
  const [artist, setArtist] = useState(null);
  const playbackState = usePlaybackState().state;
  const isPlaying = playbackState === State.Playing;

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

  const handlePlayPause = async () => {
    const isSameAlbum = playingObj?.albumId === album?.id;

    if (!isSameAlbum || !playingObj) {
      await loadAndPlayAlbum(album);
    } else {
      await togglePlayPause();
    }
  };

  const handleTrackSelect = async index => {
    await playAlbumFromIndex(album, index);
  };

  return (
    <LinearGradient
      colors={['#962419', '#661710', '#430E09']}
      locations={[0, 0.45, 1]}
      style={s.container}>
      {isLoading || !album || !artist ? (
        <Loading />
      ) : (
        <>
          <View style={s.main}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <SimpleLineIcons name="arrow-left" color={'white'} size={15} />
            </TouchableOpacity>

            <View style={s.inner}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={album?.tracks.items}
                ListHeaderComponent={
                  <>
                    <View style={s.imageView}>
                      <ImageCmp size={200} source={album?.images?.[0]?.url} />
                    </View>

                    <View style={s.panel}>
                      <View style={s.row}>
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
                              Album
                              <Entypo
                                name="dot-single"
                                color={'white'}
                                size={moderateScale(15)}
                              />
                              {new Date(album?.release_date).getFullYear()}
                            </TextCmp>
                          </View>

                          <View
                            style={[
                              s.row,
                              {
                                marginTop: verticalScale(10),
                                gap: scale(20),
                              },
                            ]}>
                            <FontAwesome
                              name="heart-o"
                              color={'#CBB7B5'}
                              size={moderateScale(25)}
                            />

                            <TouchableOpacity style={s.iconCircle}>
                              <FontAwesome
                                name="long-arrow-down"
                                color={'#000000'}
                                size={moderateScale(15)}
                              />
                            </TouchableOpacity>
                            <Entypo
                              name="dots-three-horizontal"
                              color={'white'}
                              size={moderateScale(20)}
                            />
                          </View>
                        </View>
                        <View style={s.playPauseView}>
                          <TouchableOpacity
                            onPress={handlePlayPause}
                            style={[s.iconCircle, s.iconCircleBig]}>
                            <Foundation
                              name={
                                isPlaying && playingObj?.albumId === album.id
                                  ? 'pause'
                                  : 'play'
                              }
                              color="#000000"
                              size={moderateScale(35)}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </>
                }
                renderItem={({item, index}) => (
                  <TouchableOpacity onPress={() => handleTrackSelect(index)}>
                    <TrackCard item={item} />
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </>
      )}
    </LinearGradient>
  );
};

export default Album;

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: verticalScale(60),
    paddingHorizontal: scale(10),
  },
  main: {
    flex: 1,
    paddingHorizontal: scale(10),
  },
  inner: {
    paddingHorizontal: scale(10),
  },
  row: {
    flexDirection: 'row',
  },
  imageView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  titleView: {
    flex: 1,
  },
  playPauseView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  iconCircleSmall: {
    height: scale(15),
    width: scale(15),
    borderRadius: moderateScale(7.5),
  },
  iconCircle: {
    height: scale(20),
    width: scale(20),
    borderRadius: moderateScale(10),
    backgroundColor: Colors.green300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleBig: {
    height: scale(50),
    width: scale(50),
    borderRadius: moderateScale(25),
  },
  panel: {
    marginTop: verticalScale(30),
  },
  row: {
    flexDirection: 'row',
  },
});
