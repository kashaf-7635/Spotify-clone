import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Fonts from '../../utils/constants/fonts';
import Colors from '../../utils/constants/colors';
import Entypo from '@react-native-vector-icons/entypo';
import { useNavigation } from '@react-navigation/native';
import TextCmp from '../Styled/TextCmp';
import ImageCmp from '../Styled/ImageCmp';
import { loadAndPlaySingleTrack } from '../../utils/helpers/player';

const LibraryCard = ({ item }) => {
  const navigation = useNavigation();
  const image =
    item?.type === 'track'
      ? item?.album?.images?.[0]?.url
      : item?.images?.[0]?.url;

  const handleNavigation = () => {
    if (item.type === 'track') {
      loadAndPlaySingleTrack(item)
    }

    if (item.type === 'album') {
      navigation.navigate('Album', { albumId: item.id });
    }

    if (item.type === 'playlist') {
      navigation.navigate('Playlist', { playlistId: item.id });
    }

    if (item.type === 'artist') {
      navigation.navigate('Artist', { artistId: item.id });
    }
  };
  return (
    <TouchableOpacity style={s.card} onPress={handleNavigation}>
      <View style={[s.likedSongs]}>
        <ImageCmp source={image} size={60} />
      </View>
      <View style={s.itemText}>
        <View style={s.playlistTitleHead}>
          <TextCmp size={16} weight="bold">
            {item?.name}
          </TextCmp>
        </View>

        {item.type === 'artist' ? (
          <TextCmp size={15} color={Colors.text400}>
            Artist
          </TextCmp>
        ) : item.type === 'playlist' || item.type === 'album' ? (
          <TextCmp size={15} color={Colors.text400}>
            {item.type === 'playlist' ? 'Playlist' : 'Album'}
            <Entypo name="dot-single" color={'white'} size={15} />
            Spotify
          </TextCmp>
        ) : item.type === 'track' ? (
          <View style={s.row}>
            <View style={s.grayBox}>
              <TextCmp color="#000" size={11} weight="bold">
                E
              </TextCmp>
            </View>
            <TextCmp size={15} color={Colors.text400}>
              Song
              <Entypo
                name="dot-single"
                color={'white'}
                size={moderateScale(15)}
              />
              Childish Gambino
            </TextCmp>
          </View>
        ) : (
          <></>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default LibraryCard;

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginTop: verticalScale(10),
  },
  likedSongs: {
    width: scale(70),
    height: scale(70),
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    justifyContent: 'center',
    paddingHorizontal: scale(10),
  },
  playlistTitle: {
    color: Colors.text400,
    fontFamily: Fonts.regular,
    fontSize: moderateScale(15),
  },
  playlistTitleHead: {
    marginBottom: verticalScale(5),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  grayBox: {
    backgroundColor: '#C4C4C4',
    width: scale(18),
    height: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(5),
    marginRight: scale(8),
  },
});
