import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../utils/constants/colors';
import TextCmp from '../Styled/TextCmp';
import ImageCmp from '../Styled/ImageCmp';
import { loadAndPlaySingleTrack } from '../../utils/helpers/player';

const NewReleaseAlbum = ({ item }) => {
  const navigation = useNavigation();

  const image =
    item.type === 'track'
      ? item?.album?.images?.[0]?.url
      : item?.images?.[0]?.url;

  const handleNavigation = async () => {
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
    <TouchableOpacity style={s.album} onPress={handleNavigation}>
      <ImageCmp source={image} size={150} borderRadius={8} />
      {item.type === 'track' ? (
        <View style={s.trackText}>
          <TextCmp size={14} weight="bold" align="center">
            {item?.name}
          </TextCmp>
        </View>
      ) : (
        <View style={s.albumText}>
          <TextCmp size={13} align="center" color={Colors.text500}>
            {item?.artists?.map(artist => artist.name).join(' & ')}
          </TextCmp>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default NewReleaseAlbum;

const s = StyleSheet.create({
  album: {
    marginRight: scale(15),
    width: scale(150),
  },

  trackText: {
    marginTop: 10,
  },
  albumText: {
    marginTop: 10,
  },
});
