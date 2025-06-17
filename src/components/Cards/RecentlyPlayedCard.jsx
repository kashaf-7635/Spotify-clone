import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import TextCmp from '../Styled/TextCmp';
import ImageCmp from '../Styled/ImageCmp';
import { loadAndPlaySingleTrack } from '../../utils/helpers/player';

const RecentlyPlayedCard = ({ item }) => {
  const navigation = useNavigation();
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
    <>
      <TouchableOpacity onPress={handleNavigation} style={s.main}>
        {item.type === 'artist' ? <View style={s.imageContainer}>
          <ImageCmp source={item?.images?.[0]?.url} size={90} borderRadius={45} />
        </View> : <View style={s.imageContainer}>
          <ImageCmp source={item?.images?.[0]?.url} size={90} />
        </View>}


        <TextCmp
          weight="bold"
          align="center"
          size={12}
          color="white"
          textConfig={{ numberOfLines: 2 }}>
          {item?.name}
        </TextCmp>
      </TouchableOpacity>
    </>
  );
};

export default RecentlyPlayedCard;

const s = StyleSheet.create({
  main: {
    width: scale(100),
    height: verticalScale(120),
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(5),
  },
});
