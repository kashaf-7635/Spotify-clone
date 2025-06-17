import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Fonts from '../../utils/constants/fonts';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {persistor, store} from '../../store';
import Colors from '../../utils/constants/colors';
import TrackPlayer from 'react-native-track-player';
import TextCmp from '../Styled/TextCmp';

export const logoutFromSpotify = async () => {
  await TrackPlayer.reset();
  store.dispatch({type: 'RESET_STORE'});
  await persistor.purge();
  console.log('Store reset and storage purged');
};

const HomeHeader = () => {
  return (
    <>
      <View style={s.main}>
        <View style={s.titleContainer}>
          <TextCmp weight="bold" size={22}>
            Recently played
          </TextCmp>
        </View>
        <View style={s.iconsContainer}>
          <MaterialIcons
            name="notifications-none"
            color={'white'}
            size={moderateScale(30)}
          />
          <MaterialIcons
            name="history"
            color={'white'}
            size={moderateScale(30)}
          />
          <MaterialIcons
            name="settings"
            color={'white'}
            size={moderateScale(30)}
          />
          <TouchableOpacity onPress={logoutFromSpotify}>
            <MaterialIcons
              name="logout"
              color={'white'}
              size={moderateScale(30)}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default HomeHeader;

const s = StyleSheet.create({
  main: {
    paddingTop: verticalScale(80),
    paddingHorizontal: scale(20),
    flexDirection: 'row',
    backgroundColor: Colors.bg800,
  },
  titleContainer: {
    flex: 1.5,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: moderateScale(22),
    color: 'white',
  },
  iconsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    gap: scale(5),
  },
});
