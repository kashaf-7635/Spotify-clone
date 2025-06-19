import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import SimpleLineIcons from '@react-native-vector-icons/simple-line-icons';
import Entypo from '@react-native-vector-icons/entypo';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Fonts from '../../utils/constants/fonts';
import { useRequest } from '../../hooks/useRequest';
import { useDispatch, useSelector } from 'react-redux';
import { createSpotifyAPI } from '../../utils/axios/axiosInstance';
import Loading from '../../components/Loading';
import Colors from '../../utils/constants/colors';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Foundation from '@react-native-vector-icons/foundation';
import TrackCard from '../../components/Cards/TrackCard';
import TrackPlayer, { State, usePlaybackState } from 'react-native-track-player';
import TextCmp from '../../components/Styled/TextCmp';
import ImageCmp from '../../components/Styled/ImageCmp';
import { loadAndPlayPlaylist, playPlaylistFromIndex, togglePlayPause } from '../../utils/helpers/player';


const Playlist = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const playlistId = route?.params.playlistId;
  const { requestHandler, isLoading } = useRequest();
  const accessToken = useSelector(state => state.auth.accessToken);
  const refreshToken = useSelector(state => state.auth.refreshToken);
  const [playlist, setPlaylist] = useState(null);
  const playbackState = usePlaybackState().state;
  const isPlaying = playbackState === State.Playing;
  const playingObj = useSelector(state => state.player.playingObj);

  useEffect(() => {
    if (!accessToken) return;

    const spotifyAPI = createSpotifyAPI(accessToken, refreshToken);
    requestHandler({
      requestFn: () => spotifyAPI.get(`/playlists/${playlistId}`),
      onSuccess: async res => {
        setPlaylist(res.data);
      },
      onError: err => {
        console.log(err.response?.data || err.message);
      },
    });
  }, [accessToken, route]);

  const handlePlayPause = async () => {
    const isSamePlaylist = playingObj?.parentId === playlist?.id;
    if (!isSamePlaylist || !playingObj) {


      loadAndPlayPlaylist(playlist);
    } else {
      await togglePlayPause();
    }
  };

  const handleTrackSelect = async index => {
    await playPlaylistFromIndex(playlist, index);
  };

  return (
    <LinearGradient
      colors={['#962419', '#661710', '#430E09']}
      locations={[0, 0.45, 1]}
      style={s.container}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <View style={s.main}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <SimpleLineIcons
                name="arrow-left"
                color={'white'}
                size={moderateScale(15)}
              />
            </TouchableOpacity>

            <View style={s.inner}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={playlist?.tracks.items}
                ListHeaderComponent={
                  <>
                    <View style={s.imageView}>
                      <ImageCmp
                        size={200}
                        source={playlist?.images?.[0]?.url}
                      />
                    </View>

                    <View style={s.panel}>
                      <View style={s.row}>
                        <View style={s.titleView}>
                          <TextCmp weight="bold" size={20}>
                            {playlist?.name || 'Loading...'}
                          </TextCmp>

                          <View style={[s.row, { marginTop: verticalScale(10) }]}>
                            <TextCmp weight="bold" size={17}>
                              Created by' {playlist?.owner.display_name || ''}
                            </TextCmp>
                          </View>

                          <View style={{ marginTop: verticalScale(10) }}>
                            <TextCmp color={Colors.text400} size={15}>
                              Playlist
                              <Entypo
                                name="dot-single"
                                color={'white'}
                                size={15}
                              />
                              {playlist?.tracks?.items.length}
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
                                isPlaying && playingObj?.parentId === playlist.id
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
                renderItem={({ item, index }) => {
                  return <TouchableOpacity onPress={() => handleTrackSelect(index)}>
                    <TrackCard item={item.track} />
                  </TouchableOpacity>;
                }}
              />
            </View>
          </View>
        </>
      )}
    </LinearGradient>
  );
};

export default Playlist;

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
  title: {
    color: 'white',
    fontFamily: Fonts.regular,
    fontSize: moderateScale(16),
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
    height: verticalScale(50),
    width: scale(50),
    borderRadius: moderateScale(25),
  },
  panel: {
    marginTop: moderateScale(30),
  },
  row: {
    flexDirection: 'row',
  },
});
