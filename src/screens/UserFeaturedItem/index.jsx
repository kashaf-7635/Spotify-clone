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
import LibraryCard from '../../components/Cards/LibraryCard';
import {usePlaybackState} from 'react-native-track-player';
import {State} from 'react-native-gesture-handler';
import TextCmp from '../../components/Styled/TextCmp';
import ImageCmp from '../../components/Styled/ImageCmp';

const UserFeaturedItem = ({navigation, route}) => {
  const dispatch = useDispatch();
  const type = route?.params?.type;
  const playbackState = usePlaybackState().state;
  const isPlaying = playbackState === State.Playing;
  const {requestHandler, isLoading} = useRequest();
  const accessToken = useSelector(state => state.auth.accessToken);
  const refreshToken = useSelector(state => state.auth.refreshToken);
  const userData = useSelector(state => state.auth.userData);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    if (!accessToken) return;

    const spotifyAPI = createSpotifyAPI(accessToken, refreshToken);

    if (type === 'tracks') {
      requestHandler({
        requestFn: () => spotifyAPI.get(`/me/top/tracks`),
        onSuccess: async res => {
          setTopTracks(res.data.items);
        },
        onError: err => {
          console.log(err.response?.data || err.message);
        },
      });
    }

    if (type === 'artists') {
      requestHandler({
        requestFn: () =>
          spotifyAPI.get(`/me/top/artists?limit=10&time_range=short_term`),
        onSuccess: async res => {
          console.log(res.data, 'top artists data');

          if (res.data.items.length !== 0) {
            setTopArtists(res.data.items);
          } else {
            // Fallback: get top tracks
            requestHandler({
              requestFn: () => spotifyAPI.get(`/me/top/tracks?limit=50`),
              onSuccess: async res => {
                const items = res.data.items;

                // Collect all artist IDs from tracks
                const allArtists = items.flatMap(track => track.artists);
                const uniqueMap = {};
                allArtists.forEach(artist => {
                  if (artist && artist.id && !uniqueMap[artist.id]) {
                    uniqueMap[artist.id] = true;
                  }
                });

                const artistIds = Object.keys(uniqueMap).slice(0, 10);
                if (artistIds.length === 0) return;

                // Get full artist details
                const artistDetailsRes = await spotifyAPI.get(
                  `/artists?ids=${artistIds.join(',')}`,
                );
                const artistDetails = artistDetailsRes.data.artists;

                setTopArtists(artistDetails);
              },
              onError: err => {
                console.log(err.response?.data || err.message);
              },
            });
          }
        },
        onError: err => {
          console.log(err.response?.data || err.message);
        },
      });
    }
  }, [accessToken]);

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
                data={type === 'tracks' ? topTracks : topArtists}
                ListHeaderComponent={
                  <>
                    <View style={s.imageView}>
                      <View style={s.imageContainer}>
                        <ImageCmp
                          size={200}
                          source={
                            type === 'tracks'
                              ? require('../../assets/images/album/1.png')
                              : require('../../assets/images/album/2.png')
                          }
                        />
                      </View>
                    </View>

                    <View style={s.panel}>
                      <View style={s.row}>
                        <View style={s.titleView}>
                          <View style={s.row}>
                            <View style={s.avatar}>
                              <ImageCmp
                                source={
                                  userData?.images?.[0]?.url ||
                                  'https://cdn-icons-png.flaticon.com/128/15735/15735374.png'
                                }
                                size={30}
                                borderRadius={15}
                              />
                            </View>
                            <TextCmp weight="bold" size={20}>
                              {`${
                                userData?.display_name?.split(' ')[0]
                              }'s Top ${
                                type === 'tracks' ? 'Songs' : 'Artists'
                              }`}{' '}
                            </TextCmp>
                          </View>

                          <View style={{marginTop: verticalScale(10)}}>
                            <TextCmp color={Colors.text400} size={15}>
                              Top {type === 'tracks' ? 'Songs' : 'Artists'}
                              <Entypo
                                name="dot-single"
                                color={'white'}
                                size={moderateScale(15)}
                              />
                              {new Date().getFullYear()}
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
                            style={[s.iconCircle, s.iconCircleBig]}>
                            <Foundation
                              name={isPlaying ? 'pause' : 'play'}
                              color="#000000"
                              size={moderateScale(35)}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </>
                }
                renderItem={({item}) => {
                  return (
                    <>
                      {type === 'tracks' ? (
                        <TrackCard item={item} />
                      ) : (
                        <LibraryCard item={item} />
                      )}
                    </>
                  );
                }}
              />
            </View>
          </View>
        </>
      )}
    </LinearGradient>
  );
};

export default UserFeaturedItem;

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: moderateScale(60),
    paddingHorizontal: moderateScale(10),
  },
  main: {
    flex: 1,
    paddingHorizontal: moderateScale(10),
    paddingBottom: moderateScale(30),
  },
  inner: {
    paddingHorizontal: moderateScale(10),
  },
  row: {
    flexDirection: 'row',
  },
  imageView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(20),
  },
  title: {
    color: 'white',
    fontFamily: Fonts.regular,
    fontSize: 16,
  },
  titleView: {
    flex: 1,
  },
  playPauseView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  avatar: {
    marginRight: moderateScale(10),
  },
  subtitle: {
    color: 'white',
    fontFamily: Fonts.bold,
    fontSize: 17,
    marginTop: moderateScale(8),
  },

  iconCircleSmall: {
    height: moderateScale(15),
    width: moderateScale(15),
    borderRadius: moderateScale(7.5),
  },
  iconCircle: {
    height: moderateScale(20),
    width: moderateScale(20),
    borderRadius: moderateScale(10),
    backgroundColor: Colors.green300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleBig: {
    height: moderateScale(50),
    width: moderateScale(50),
    borderRadius: moderateScale(25),
  },
  panel: {
    marginTop: moderateScale(30),
  },
  row: {
    flexDirection: 'row',
  },
});
