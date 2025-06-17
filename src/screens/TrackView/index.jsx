import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import SimpleLineIcons from '@react-native-vector-icons/simple-line-icons';
import Entypo from '@react-native-vector-icons/entypo';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import Ionicons from '@react-native-vector-icons/ionicons';
import Feather from '@react-native-vector-icons/feather';
import Fantisto from '@react-native-vector-icons/fontisto';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import Fonts from '../../utils/constants/fonts';
import Colors from '../../utils/constants/colors';
import Slider from '@react-native-community/slider';
import Foundation from '@react-native-vector-icons/foundation';
import {useDispatch, useSelector} from 'react-redux';
import {formatTime} from '../../utils/helpers/time';
import {usePlaybackState, State} from 'react-native-track-player';
import {useRequest} from '../../hooks/useRequest';
import {createSpotifyAPI} from '../../utils/axios/axiosInstance';
import {getCurrentTrack, togglePlayPause} from '../../utils/helpers/player';
import {setPlayingObj} from '../../store/playerSlice';
import TextCmp from '../../components/Styled/TextCmp';
import ImageCmp from '../../components/Styled/ImageCmp';

const TrackView = () => {
  const dispatch = useDispatch();
  const playingObj = useSelector(state => state.player.playingObj);
  const duration = playingObj?.duration_ms || 1;
  const [position, setPosition] = useState(0);
  const playbackState = usePlaybackState().state;
  const isPlaying = playbackState === State.Playing;
  const {requestHandler, isLoading} = useRequest();
  const accessToken = useSelector(state => state.auth.accessToken);
  const refreshToken = useSelector(state => state.auth.refreshToken);
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    if (!accessToken) return;

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

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPosition(prev => {
          const next = prev + 1000;
          return next >= duration ? duration : next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const handlePlayPause = async () => {
    await togglePlayPause();
  };

  return (
    <>
      <LinearGradient
        colors={['#962419', '#661710', '#430E09']}
        locations={[0, 0.45, 1]}
        style={s.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}
          contentContainerStyle={s.main}>
          <View style={s.main}>
            <View style={s.header}>
              <View style={{flex: 0.1}}>
                <SimpleLineIcons
                  name="arrow-down"
                  color={'white'}
                  size={moderateScale(20)}
                />
              </View>
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
                  size={20}
                />
              </View>
            </View>

            <View style={s.image}>
              <ImageCmp source={playingObj?.artwork} width={300} height={300} />
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
                <View style={s.iconView}>
                  <FontAwesome
                    name="heart-o"
                    color={'#CBB7B5'}
                    size={moderateScale(30)}
                  />
                </View>
              </View>

              <View style={s.slider}>
                <Slider
                  style={{width: '110%', height: verticalScale(40)}}
                  minimumValue={0}
                  maximumValue={1}
                  value={position / duration}
                  onSlidingComplete={value => {
                    setPosition(value * duration); // seek to new position
                  }}
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="#a3a2a2"
                  thumbTintColor="#FFFFFF"
                />
                <View style={{position: 'absolute', bottom: 0, left: 0}}>
                  <TextCmp size={12}>{formatTime(position)}</TextCmp>
                </View>

                <View style={{position: 'absolute', bottom: 0, right: 0}}>
                  <TextCmp size={12}>
                    {' '}
                    -{formatTime(duration - position)}
                  </TextCmp>
                </View>
              </View>

              <View style={s.actions}>
                <View style={s.left}>
                  <Entypo
                    name="shuffle"
                    color="#FFFFFF"
                    size={moderateScale(30)}
                  />
                </View>

                <View style={s.mid}>
                  <TouchableOpacity>
                    <FontAwesome
                      name="step-backward"
                      color="#FFFFFF"
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

                  <TouchableOpacity>
                    <FontAwesome
                      name="step-forward"
                      color="#FFFFFF"
                      size={moderateScale(40)}
                    />
                  </TouchableOpacity>
                </View>

                <View style={s.right}>
                  <Feather
                    name="repeat"
                    color={Colors.green300}
                    size={moderateScale(30)}
                  />
                </View>
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
          </View>
        </ScrollView>
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
    paddingTop: verticalScale(30),
    paddingHorizontal: scale(10),
    paddingBottom: verticalScale(40),
  },
  header: {
    flexDirection: 'row',
    width: '100%',
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
