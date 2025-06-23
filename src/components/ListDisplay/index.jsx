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
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused} from '@react-navigation/native';

const ListDisplay = ({album, artist, isLoading}) => {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isSticky, setIsSticky] = useState(false);
  const playingObj = useSelector(state => state.player.playingObj);
  const playbackState = usePlaybackState().state;
  const isPlaying = playbackState === State.Playing;

  useEffect(() => {
    if (isFocused) {
      scrollY.setValue(0);
      setIsSticky(false);
    }
  }, [isFocused]);

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {
      useNativeDriver: false,
      listener: event => {
        const y = event.nativeEvent.contentOffset.y;
        if (y > 100 && !isSticky) {
          setIsSticky(true);
        } else if (y <= 100 && isSticky) {
          setIsSticky(false);
        }
      },
    },
  );

  const imageSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 70],
    extrapolate: 'clamp',
  });
  const titleOpacity = scrollY.interpolate({
    inputRange: [120, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const playBtnOpacity = scrollY.interpolate({
    inputRange: [100, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handlePlayPause = async () => {
    const isSameAlbum = playingObj?.parentId === album?.id;

    if (!isSameAlbum || !playingObj) {
      await loadAndPlayAlbum(album);
    } else {
      await togglePlayPause();
    }
  };

  return (
    <LinearGradient
      colors={['#C63224', '#641D17', '#271513', '#121212']}
      locations={[0, 0.37, 0.63, 1]}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      style={[s.container]}>
      {isLoading ? (
        <Loading />
      ) : (
        <View style={[s.main, {paddingTop: insets.top + 20}]}>
          <View style={s.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <SimpleLineIcons name="arrow-left" color={'white'} size={15} />
            </TouchableOpacity>
            <TextCmp
              size={18}
              animated={true}
              opacity={titleOpacity}
              weight="semibold">
              {album?.name || 'Loading...'}
            </TextCmp>
          </View>

          <View style={s.inner}>
            <Animated.FlatList
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              data={album?.tracks.items}
              ListHeaderComponent={
                <>
                  <View style={s.imageView}>
                    <ImageCmp
                      animated={true}
                      size={imageSize}
                      source={album?.images?.[0]?.url}
                    />
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
                              isPlaying && playingObj?.parentId === album.id
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

          <Animated.View
            style={[
              s.stickyPlayPauseView,
              isSticky && {
                top: insets.top + scale(30),
                right: scale(20),
              },
              {opacity: playBtnOpacity},
            ]}>
            <TouchableOpacity
              onPress={handlePlayPause}
              style={[s.iconCircle, s.iconCircleBig]}>
              <Foundation
                name={
                  isPlaying && playingObj?.parentId === album.id
                    ? 'pause'
                    : 'play'
                }
                color="#000000"
                size={moderateScale(35)}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </LinearGradient>
  );
};

export default ListDisplay;

const s = StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(20),
    paddingVertical: verticalScale(10),
    marginRight: scale(20),
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
  stickyPlayPauseView: {
    position: 'absolute',
    zIndex: 999,
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
