import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../utils/constants/colors';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import Fonts from '../../utils/constants/fonts';
import Foundation from '@react-native-vector-icons/foundation';
import Slider from '@react-native-community/slider';
import Entypo from '@react-native-vector-icons/entypo';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {State, usePlaybackState} from 'react-native-track-player';
import {togglePlayPause} from '../../utils/helpers/player';
import TextCmp from '../Styled/TextCmp';
import ImageCmp from '../Styled/ImageCmp';

const CurrentlyPlaying = ({style}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const playingObj = useSelector(state => state.player.playingObj);
  const duration = playingObj?.duration_ms || 1;
  const [position, setPosition] = useState(0);
  const playbackState = usePlaybackState().state;
  const isPlaying = playbackState === State.Playing;

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
      <TouchableOpacity
        onPress={() => navigation.navigate('TrackView')}
        style={[s.container, style]}>
        <View style={s.main}>
          <View style={s.imageDiv}>
            <ImageCmp
              size={35}
              borderRadius={12}
              source={playingObj?.artwork}
            />
          </View>

          <View style={s.titleDiv}>
            <TextCmp weight="bold">
              {playingObj?.title}
              <Entypo
                name="dot-single"
                color={'white'}
                size={moderateScale(15)}
              />
              <TextCmp color={Colors.text400}>{playingObj?.artist}</TextCmp>
            </TextCmp>

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
          </View>
          <View style={s.icons}>
            <TouchableOpacity>
              <Foundation
                name="bluetooth"
                color={Colors.green300}
                size={moderateScale(30)}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePlayPause}>
              <Foundation
                name={isPlaying ? 'pause' : 'play'}
                color={'white'}
                size={moderateScale(30)}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Slider
          style={s.slider}
          minimumValue={0}
          maximumValue={1}
          value={position / duration || 0}
          onSlidingComplete={value => {
            setPosition(value * duration);
          }}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#a3a2a2"
          thumbTintColor="#FFFFFF"
        />
      </TouchableOpacity>
    </>
  );
};

export default CurrentlyPlaying;

const s = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(12),
    backgroundColor: Colors.red800,
  },
  main: {
    flexDirection: 'row',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 0.1,
    gap: scale(10),
    paddingHorizontal: scale(5),
  },
  imageDiv: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleDiv: {
    flex: 0.9,
    justifyContent: 'space-between',
    paddingHorizontal: scale(5),
    paddingVertical: verticalScale(5),
  },
  bluetooth: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: verticalScale(5),
  },
  bluetoothTitle: {
    color: Colors.green300,
    fontSize: 11,
  },
  slider: {
    width: '100%',
    height: verticalScale(20),
    position: 'absolute',
    bottom: verticalScale(-10),
  },
});
