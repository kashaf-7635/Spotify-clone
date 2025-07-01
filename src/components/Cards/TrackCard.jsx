import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import Fonts from '../../utils/constants/fonts';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import Colors from '../../utils/constants/colors';
import Entypo from '@react-native-vector-icons/entypo';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import {useSelector} from 'react-redux';
import TextCmp from '../Styled/TextCmp';

const TrackCard = ({item}) => {
  const playingObj = useSelector(state => state.player.playingObj);

  return (
    <View style={s.card}>
      <View style={{flex: 1}}>
        <TextCmp
          size={18}
          color={playingObj?.id === item.id ? Colors.green300 : 'white'}>
          {item.name}
        </TextCmp>
        <View
          style={[
            s.row,
            {
              marginTop: moderateScale(5),
              gap: moderateScale(10),
              alignContent: 'center',
            },
          ]}>
          <TouchableOpacity style={[s.iconCircle, s.iconCircleSmall]}>
            <FontAwesome
              name="long-arrow-down"
              color={'#000000'}
              size={moderateScale(10)}
            />
          </TouchableOpacity>
          <TextCmp color={Colors.text400} size={15}>
            {item?.artists[0]?.name}
          </TextCmp>
        </View>
      </View>
      <View style={s.playPauseView}>
        <Entypo
          name="dots-three-vertical"
          color={'white'}
          size={moderateScale(18)}
        />
      </View>
    </View>
  );
};

export default TrackCard;

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginVertical: verticalScale(10),
  },
  row: {
    flexDirection: 'row',
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
  playPauseView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});
