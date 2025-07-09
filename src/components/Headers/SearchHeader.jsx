import {StatusBar, StyleSheet, View} from 'react-native';
import React from 'react';
import SimpleLineIcons from '@react-native-vector-icons/simple-line-icons';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import TextCmp from '../Styled/TextCmp';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SearchHeader = () => {
  const insets = useSafeAreaInsets();
  return (
    <>
      <View style={[s.main, {paddingTop: insets.top}]}>
        <View style={s.titleContainer}>
          <TextCmp size={22} weight="bold">
            Search
          </TextCmp>
        </View>
        <View style={s.iconsContainer}>
          <SimpleLineIcons
            name="camera"
            color={'white'}
            size={verticalScale(30)}
          />
        </View>
      </View>
    </>
  );
};

export default SearchHeader;

const s = StyleSheet.create({
  main: {
    paddingHorizontal: scale(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  iconsContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
});
