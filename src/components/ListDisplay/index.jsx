import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import SimpleLineIcons from '@react-native-vector-icons/simple-line-icons';
import Entypo from '@react-native-vector-icons/entypo';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import Loading from '../../components/Loading';
import Colors from '../../utils/constants/colors';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Foundation from '@react-native-vector-icons/foundation';
import TrackCard from '../../components/Cards/TrackCard';
import {State, usePlaybackState} from 'react-native-track-player';
import {
  loadAndPlayAlbum,
  playAlbumFromIndex,
  togglePlayPause,
} from '../../utils/helpers/player';
import TextCmp from '../../components/Styled/TextCmp';
import ImageCmp from '../../components/Styled/ImageCmp';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {formatTotalDuration} from '../../utils/helpers/time';

const ListDisplay = ({album, header, isLoading, tracks, image}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const scrollY = useRef(new Animated.Value(0)).current;
  const playingObj = useSelector(state => state.player.playingObj);
  const playbackState = usePlaybackState().state;
  const isPlaying = playbackState === State.Playing;

  useEffect(() => {
    if (isFocused) {
      scrollY.setValue(0);

      console.log(formatTotalDuration(tracks));
    }
  }, [isFocused]);

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {
      useNativeDriver: false,
    },
  );

  const imageSize = scrollY.interpolate({
    inputRange: [0, 20, 40, 60, 80, 100],
    outputRange: [200, 170, 140, 110, 90, 70],
    extrapolate: 'clamp',
  });
  const titleOpacity = scrollY.interpolate({
    inputRange: [150, 180],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const playBtnOpacity = scrollY.interpolate({
    inputRange: [220, 250],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handlePlayPause = async () => {
    const isSameAlbum = playingObj?.parentId === album?.id;

    if (!isSameAlbum || !playingObj) {
      await loadAndPlayAlbum(album, tracks);
    } else {
      await togglePlayPause();
    }
  };

  const handleTrackSelect = async index => {
    await playAlbumFromIndex(album, tracks, index);
  };

  return (
    <LinearGradient
      colors={['#C63224', '#641D17', '#271513', '#121212']}
      locations={[0, 0.37, 0.63, 1]}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      style={[s.container, {paddingTop: insets.top}]}>
      {isLoading ? (
        <Loading />
      ) : (
        <View
          style={[
            s.main,
            {
              paddingBottom: playingObj ? verticalScale(90) : verticalScale(35),
            },
          ]}>
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

            <Animated.View
              style={[
                s.stickyPlayPauseView,
                {
                  right: scale(0),
                  bottom: verticalScale(-20),
                  opacity: playBtnOpacity,
                },
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

          <View style={s.inner}>
            <Animated.FlatList
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              data={tracks}
              ListHeaderComponent={
                <>
                  <View style={s.imageView}>
                    <ImageCmp
                      animated={true}
                      size={imageSize}
                      source={image ? image : album?.images?.[0]?.url}
                    />
                  </View>

                  <View style={s.panel}>
                    {header}

                    <View style={[s.row]}>
                      <View style={s.actionsView}>
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
                          name="dots-three-vertical"
                          color={'white'}
                          size={moderateScale(18)}
                        />
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
              ListFooterComponent={
                <>
                  <View style={[s.row, {paddingVertical: verticalScale(15)}]}>
                    <TextCmp size={15}>{`${tracks?.length} Songs`}</TextCmp>
                    <Entypo
                      name="dot-single"
                      color={'white'}
                      size={moderateScale(20)}
                    />
                    <TextCmp size={15}>{`${
                      tracks?.length !== 0 && formatTotalDuration(tracks)
                    }`}</TextCmp>
                  </View>
                </>
              }
            />
          </View>
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
    position: 'relative',
  },
  imageView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  titleView: {
    flex: 1,
  },
  actionsView: {
    flexDirection: 'row',
    gap: scale(20),
    flex: 1,
    alignItems: 'center',
  },
  playPauseView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  stickyPlayPauseView: {
    position: 'absolute',
    right: 0,
    zIndex: 999,
    paddingRight: scale(10),
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
