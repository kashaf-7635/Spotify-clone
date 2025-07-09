import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import SimpleLineIcons from '@react-native-vector-icons/simple-line-icons';
import Entypo from '@react-native-vector-icons/entypo';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import Ionicons from '@react-native-vector-icons/ionicons';
import Feather from '@react-native-vector-icons/feather';
import Fantisto from '@react-native-vector-icons/fontisto';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import Colors from '../../utils/constants/colors';
import Slider from '@react-native-community/slider';
import Foundation from '@react-native-vector-icons/foundation';
import {useDispatch, useSelector} from 'react-redux';
import {formatTime} from '../../utils/helpers/time';
import TrackPlayer, {
  usePlaybackState,
  State,
  useProgress,
  Event,
  RepeatMode,
} from 'react-native-track-player';
import {useRequest} from '../../hooks/useRequest';
import {createSpotifyAPI} from '../../utils/axios/axiosInstance';
import {getCurrentTrack, togglePlayPause} from '../../utils/helpers/player';
import TextCmp from '../../components/Styled/TextCmp';
import ImageCmp from '../../components/Styled/ImageCmp';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {setIsShuffled} from '../../store/playerSlice';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const TrackView = () => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const playingObj = useSelector(state => state.player.playingObj);
  const isShuffled = useSelector(state => state.player.isShuffled);
  const {position, duration} = useProgress(250);
  const [repeatMode, setRepeatMode] = useState(RepeatMode.Off);
  const originalQueueRef = useRef([]);

  const playbackState = usePlaybackState().state;
  const isPlaying = playbackState === State.Playing;
  const {requestHandler, isLoading} = useRequest();
  const accessToken = useSelector(state => state.auth.accessToken);
  const refreshToken = useSelector(state => state.auth.refreshToken);
  const [album, setAlbum] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [canShuffle, setCanShuffle] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
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
    outputRange: [verticalScale(300), verticalScale(70)],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (!playingObj) return;

    const spotifyAPI = createSpotifyAPI(accessToken, refreshToken);
    requestHandler({
      requestFn: () =>
        spotifyAPI.get(`/me/tracks/contains?ids=${playingObj?.id}`),
      onSuccess: res => {
        setIsLiked(res?.data?.[0]);
      },
      onError: err => {
        console.log(err.response?.data || err.message);
      },
    });
  }, [playingObj?.id, accessToken, refreshToken]);

  useEffect(() => {
    const checkTrackAvailability = async () => {
      const queue = await TrackPlayer.getQueue();
      const current = await getCurrentTrack();

      const currentIndex = queue.findIndex(track => track.id === current.id);
      setHasNext(currentIndex < queue.length - 1);
      setHasPrevious(currentIndex > 0);
      setCanShuffle(queue.length > 1);
    };

    checkTrackAvailability();

    const listener = TrackPlayer.addEventListener(
      Event.PlaybackActiveTrackChanged,
      checkTrackAvailability,
    );

    return () => {
      listener.remove();
    };
  }, []);

  const handleNext = async () => {
    if (hasNext) {
      await TrackPlayer.skipToNext();
    }
  };

  const handlePrevious = async () => {
    if (hasPrevious) {
      await TrackPlayer.skipToPrevious();
    }
  };

  useEffect(() => {
    if (!accessToken || !playingObj?.albumId) return;

    const spotifyAPI = createSpotifyAPI(accessToken, refreshToken);
    requestHandler({
      requestFn: () => spotifyAPI.get(`/albums/${playingObj?.albumId}`),
      onSuccess: async res => {
        setAlbum(res.data);
      },
      onError: err => {
        console.log(err.response?.data || err.message);
      },
    });
  }, [accessToken, playingObj?.albumId]);

  const handlePlayPause = async () => {
    await togglePlayPause();
  };

  useEffect(() => {
    if (!playingObj) {
      navigation.goBack();
    }
  }, [playingObj]);

  useEffect(() => {
    const fetchRepeatMode = async () => {
      const mode = await TrackPlayer.getRepeatMode();
      setRepeatMode(mode);
    };
    fetchRepeatMode();
  }, []);

  const toggleRepeat = async () => {
    let newMode;

    if (repeatMode === RepeatMode.Off) {
      newMode = RepeatMode.Track;
    } else {
      newMode = RepeatMode.Off;
    }

    await TrackPlayer.setRepeatMode(newMode);
    setRepeatMode(newMode);
  };

  const toggleShuffle = async () => {
    const queue = await TrackPlayer.getQueue();

    if (queue.length <= 1) {
      console.warn('Shuffle not applicable for 1 or fewer tracks');
      return;
    }

    const currentIndex = await TrackPlayer.getActiveTrackIndex();

    if (!isShuffled) {
      // Store original queue
      originalQueueRef.current = queue;

      // Shuffle queue
      const shuffledQueue = [...queue].sort(() => Math.random() - 0.5);

      await TrackPlayer.reset();
      await TrackPlayer.add(shuffledQueue);
      if (currentIndex !== null && currentIndex < shuffledQueue.length) {
        await TrackPlayer.skip(currentIndex);
      }
      await TrackPlayer.play();
      dispatch(setIsShuffled(true));
    } else {
      const originalQueue = originalQueueRef.current;

      if (originalQueue.length === 0) {
        console.warn('Original queue not available');
        return;
      }

      await TrackPlayer.reset();
      await TrackPlayer.add(originalQueue);
      if (currentIndex !== null && currentIndex < originalQueue.length) {
        await TrackPlayer.skip(currentIndex);
      }
      await TrackPlayer.play();
      dispatch(setIsShuffled(false));
    }
  };

  const handleAddToLikedSongs = trackId => {
    const spotifyAPI = createSpotifyAPI(accessToken, refreshToken);
    requestHandler({
      requestFn: () => spotifyAPI.put(`/me/tracks`, {ids: [`${trackId}`]}),
      onSuccess: async res => {
        console.log(res.data);
      },
      onError: err => {
        console.log(err.response?.data || err.message);
      },
    });
  };

  const handleRemoveFromLikedSongs = trackId => {
    const spotifyAPI = createSpotifyAPI(accessToken, refreshToken);
    requestHandler({
      requestFn: () => spotifyAPI.delete(`/me/tracks?ids=${trackId}`),
      onSuccess: async res => {
        console.log(res.data);
      },
      onError: err => {
        console.log(err.response?.data || err.message);
      },
    });
  };
  const handleFav = async trackId => {
    if (isLiked) {
      await handleRemoveFromLikedSongs(trackId);
      setIsLiked(false);
    } else {
      await handleAddToLikedSongs(trackId);
      setIsLiked(true);
    }
  };

  return (
    <>
      <LinearGradient
        colors={['#962419', '#661710', '#430E09']}
        // locations={[0, 0.45, 1]}
        style={s.container}>
        <View style={[s.main, {paddingTop: insets.top}]}>
          <View style={s.header}>
            <TouchableOpacity
              style={{flex: 0.1}}
              onPress={() => navigation.goBack()}>
              <SimpleLineIcons
                name="arrow-down"
                color={'white'}
                size={moderateScale(20)}
              />
            </TouchableOpacity>
            <View style={{flex: 0.8}}>
              <TextCmp size={16} align="center">
                {album?.name}
              </TextCmp>
            </View>

            <View
              style={{
                flex: 0.1,
                alignItems: 'flex-end',
              }}>
              <Entypo
                name="dots-three-horizontal"
                color={'white'}
                size={moderateScale(20)}
              />
            </View>
          </View>

          <ScrollView
            onScroll={handleScroll}
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}
            contentContainerStyle={s.main}>
            <View style={s.image}>
              <ImageCmp
                animated={true}
                source={playingObj?.artwork}
                size={imageSize}
              />
            </View>
            <View style={s.panel}>
              <View style={s.row}>
                <View style={s.titleView}>
                  <TextCmp weight="bold" size={20}>
                    {playingObj?.title}
                  </TextCmp>
                  <View style={s.subtitle}>
                    <TextCmp color={Colors.text400} size={17}>
                      {' '}
                      {playingObj?.artist}
                    </TextCmp>
                  </View>
                </View>
                <TouchableOpacity
                  style={s.iconView}
                  onPress={() => handleFav(playingObj.id)}>
                  <FontAwesome
                    name={`${isLiked ? 'heart' : 'heart-o'}`}
                    color={'#CBB7B5'}
                    size={moderateScale(30)}
                  />
                </TouchableOpacity>
              </View>

              <View style={s.slider}>
                <Slider
                  style={{width: '110%', height: verticalScale(40)}}
                  minimumValue={0}
                  maximumValue={1}
                  value={duration ? position / duration : 0}
                  onSlidingComplete={async value => {
                    await TrackPlayer.seekTo(value * duration);
                  }}
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="#a3a2a2"
                  thumbTintColor="#FFFFFF"
                />
                <View style={{position: 'absolute', bottom: 0, left: 0}}>
                  <TextCmp size={12}>{formatTime(position * 1000)}</TextCmp>
                </View>

                <View style={{position: 'absolute', bottom: 0, right: 0}}>
                  <TextCmp size={12}>
                    -{formatTime((duration - position) * 1000)}
                  </TextCmp>
                </View>
              </View>

              <View style={s.actions}>
                <TouchableOpacity
                  style={s.left}
                  onPress={toggleShuffle}
                  disabled={!canShuffle}>
                  <Entypo
                    name="shuffle"
                    color={
                      !canShuffle
                        ? '#666666'
                        : isShuffled
                        ? Colors.green300
                        : '#FFFFFF'
                    }
                    size={moderateScale(30)}
                  />
                </TouchableOpacity>

                <View style={s.mid}>
                  <TouchableOpacity
                    disabled={!hasPrevious}
                    onPress={handlePrevious}>
                    <FontAwesome
                      name="step-backward"
                      color={hasPrevious ? '#FFFFFF' : '#666666'}
                      size={moderateScale(40)}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handlePlayPause}>
                    <MaterialIcons
                      name={isPlaying ? 'pause-circle' : 'play-circle'}
                      color="#FFFFFF"
                      size={moderateScale(80)}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity disabled={!hasNext} onPress={handleNext}>
                    <FontAwesome
                      name="step-forward"
                      color={hasNext ? '#FFFFFF' : '#666666'}
                      size={moderateScale(40)}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={s.right} onPress={toggleRepeat}>
                  <Feather
                    name="repeat"
                    color={
                      repeatMode === RepeatMode.Off
                        ? '#CBB7B5'
                        : Colors.green300
                    }
                    size={moderateScale(30)}
                  />
                </TouchableOpacity>
              </View>

              <View style={s.row}>
                <View style={s.bluetooth}>
                  <Foundation
                    name="bluetooth"
                    color={Colors.green300}
                    size={moderateScale(15)}
                  />
                  <TextCmp color={Colors.green300} size={11}>
                    BEATSPILL+
                  </TextCmp>
                </View>

                <View style={[s.row, s.playlist]}>
                  <Ionicons
                    name="share-outline"
                    color={'white'}
                    size={moderateScale(25)}
                  />
                  <Fantisto
                    name="play-list"
                    color={'white'}
                    size={moderateScale(20)}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </LinearGradient>
    </>
  );
};

export default TrackView;

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flexGrow: 1,
    paddingHorizontal: scale(10),
    paddingBottom: verticalScale(40),
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  subtitle: {
    marginTop: verticalScale(8),
  },
  panel: {
    marginTop: verticalScale(30),
  },
  row: {
    flexDirection: 'row',
  },
  titleView: {
    flex: 0.9,
  },
  iconView: {
    flex: 0.1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  slider: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  left: {
    flex: 0.1,
  },
  mid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 0.8,
  },
  right: {
    flex: 0.1,
  },
  bluetooth: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: verticalScale(5),
    flex: 1,
  },

  playlist: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: scale(20),
  },
});
