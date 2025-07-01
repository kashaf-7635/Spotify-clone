import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
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
import LibraryCard from '../../components/Cards/LibraryCard';
import {State, usePlaybackState} from 'react-native-track-player';
import TextCmp from '../../components/Styled/TextCmp';
import ImageCmp from '../../components/Styled/ImageCmp';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused} from '@react-navigation/native';

const Artist = ({route, navigation}) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const artistId = route?.params.artistId;
  const {requestHandler, isLoading} = useRequest();
  const accessToken = useSelector(state => state.auth.accessToken);
  const refreshToken = useSelector(state => state.auth.refreshToken);
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);

  const isFocused = useIsFocused();
  const scrollY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (isFocused) {
      scrollY.setValue(0);
    }
  }, [isFocused]);
  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {
      useNativeDriver: false,
    },
  );

  const imageSize = scrollY.interpolate({
    inputRange: [verticalScale(0), verticalScale(100)],
    outputRange: [verticalScale(200), verticalScale(70)],
    extrapolate: 'clamp',
  });
  const titleOpacity = scrollY.interpolate({
    inputRange: [verticalScale(150), verticalScale(180)],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (!accessToken) return;

    const spotifyAPI = createSpotifyAPI(accessToken, refreshToken);
    requestHandler({
      requestFn: () => spotifyAPI.get(`/artists/${artistId}`),
      onSuccess: async res => {
        setArtist(res.data);

        requestHandler({
          requestFn: () => spotifyAPI.get(`/artists/${artistId}/albums`),
          onSuccess: async res => {
            setAlbums(res.data.items);
          },
          onError: err => {
            console.log(err.response?.data || err.message);
          },
        });
      },
      onError: err => {
        console.log(err.response?.data || err.message);
      },
    });
  }, [accessToken, route]);

  return (
    <LinearGradient
      colors={['#C63224', '#641D17', '#271513', '#121212']}
      locations={[0, 0.37, 0.63, 1]}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      style={s.container}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <View style={[s.main, {paddingTop: insets.top + verticalScale(20)}]}>
            <View style={s.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <SimpleLineIcons name="arrow-left" color={'white'} size={moderateScale(15)} />
              </TouchableOpacity>
              <TextCmp
                size={18}
                animated={true}
                opacity={titleOpacity}
                weight="semibold">
                {artist?.name || 'Loading...'}
              </TextCmp>
            </View>

            <View style={s.inner}>
              <Animated.FlatList
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                data={albums}
                ListHeaderComponent={
                  <>
                    <View style={s.imageView}>
                      <ImageCmp
                        animated={true}
                        size={imageSize}
                        source={artist?.images?.[0]?.url}
                      />
                    </View>

                    <View style={s.panel}>
                      <View style={s.row}>
                        <View style={s.titleView}>
                          <TextCmp weight="bold" size={20}>
                            {artist?.name || 'Loading...'}
                          </TextCmp>

                          <View style={[s.row, {marginTop: verticalScale(10)}]}>
                            <TextCmp weight="bold" size={17}>
                              {artist?.genres.join(' , ')}
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
                        {/* <View style={s.playPauseView}>
                          <TouchableOpacity
                            style={[s.iconCircle, s.iconCircleBig]}>
                            <Foundation
                              name={isPlaying ? 'pause' : 'play'}
                              color="#000000"
                              size={moderateScale(35)}
                            />
                          </TouchableOpacity>
                        </View> */}
                      </View>
                    </View>
                  </>
                }
                renderItem={({item}) => {
                  return <LibraryCard item={item} />;
                }}
              />
            </View>
          </View>
        </>
      )}
    </LinearGradient>
  );
};

export default Artist;

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(10),
  },
  main: {
    flex: 1,
    paddingHorizontal: scale(10),
    paddingBottom: verticalScale(30),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(20),
    paddingVertical: verticalScale(10),
    marginRight: scale(20),
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
    marginTop: verticalScale(10),
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
    borderRadius: scale(7.5),
  },
  iconCircle: {
    height: scale(20),
    width: scale(20),
    borderRadius: scale(10),
    backgroundColor: Colors.green300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleBig: {
    height: scale(50),
    width: scale(50),
    borderRadius: scale(25),
  },
  panel: {
    marginTop: verticalScale(30),
  },
  row: {
    flexDirection: 'row',
  },
});
