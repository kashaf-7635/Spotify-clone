import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import Fonts from '../../utils/constants/fonts';
import Entypo from '@react-native-vector-icons/entypo';
import {moderateScale, scale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import TextCmp from '../Styled/TextCmp';
import ImageCmp from '../Styled/ImageCmp';

const LibraryHeader = () => {
  const userData = useSelector(state => state.auth.userData);
  console.log(userData);

  return (
    <>
      <View style={s.main}>
        <View style={s.left}>
          <ImageCmp
            source={
              userData?.images?.[0]?.url ||
              'https://cdn-icons-png.flaticon.com/128/15735/15735374.png'}
            size={35}
            borderRadius={17.5}
          />

          <View style={s.titleContainer}>
            <TextCmp size={22} weight="bold">
              {`${userData?.display_name?.split(' ')[0]}'s Library`}{' '}
            </TextCmp>
          </View>
        </View>

        <View style={s.iconsContainer}>
          <Entypo name="plus" color={'#A7A7A7'} size={moderateScale(30)} />
        </View>
      </View>
    </>
  );
};

export default LibraryHeader;

const s = StyleSheet.create({
  main: {
    paddingTop: moderateScale(80),
    paddingHorizontal: moderateScale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
  },
  titleContainer: {
    justifyContent: 'center',
    marginLeft: scale(10),
  },
  iconsContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
});
