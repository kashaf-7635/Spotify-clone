import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Fonts from '../../utils/constants/fonts';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Octicons from '@react-native-vector-icons/octicons';
import Colors from '../../utils/constants/colors';
import Entypo from '@react-native-vector-icons/entypo';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useRequest } from '../../hooks/useRequest';
import { useDispatch, useSelector } from 'react-redux';
import { createSpotifyAPI } from '../../utils/axios/axiosInstance';
import LibraryCard from '../../components/Cards/LibraryCard';
import TextCmp from '../../components/Styled/TextCmp';
import { setLikedSongAlbum } from '../../store/playerSlice';
import { handleAddToLikedSongs } from '../TrackView';
import { useIsFocused } from '@react-navigation/native';

const Library = ({ navigation }) => {
  const dispatch = useDispatch();
  const { requestHandler, isLoading } = useRequest();
  const accessToken = useSelector(state => state.auth.accessToken);
  const refreshToken = useSelector(state => state.auth.refreshToken);
  const isFocused = useIsFocused();
  const [playlists, setPlaylists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [results, setResults] = useState([]);
  const playingObj = useSelector(state => state.player.playingObj);
  const likedSongAlbum = useSelector(state => state.player.likedSongAlbum);


  const [tab, setTab] = useState([]);

  const Tab = ({ title }) => {
    const isSelected = tab.includes(title);

    return (
      <TouchableOpacity
        style={[s.tab, isSelected ? { backgroundColor: Colors.green300 } : {}]}
        onPress={() => {
          setTab(currTab =>
            isSelected ? currTab.filter(t => t !== title) : [...currTab, title],
          );
        }}>
        <TextCmp size={13}>{title}</TextCmp>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (!accessToken) return;

    const spotifyAPI = createSpotifyAPI(accessToken, refreshToken);

    requestHandler({
      requestFn: () => spotifyAPI.get(`/me/tracks`),
      onSuccess: async res => {
        const album = {
          id: 'liked-songs',
          tracks: { items: res.data.items }
        }
        dispatch(setLikedSongAlbum(album))

      },
      onError: err => {
        console.log(err.response?.data || err.message);
      },
    });
    requestHandler({
      requestFn: () => spotifyAPI.get(`/me/playlists`),
      onSuccess: async res => {
        setPlaylists(res?.data?.items);
      },
      onError: err => {
        console.log(err.response?.data || err.message);
      },
    });

    requestHandler({
      requestFn: () => spotifyAPI.get(`/me/albums`),
      onSuccess: async res => {
        setAlbums(res?.data?.items);
      },
      onError: err => {
        console.log(err.response?.data || err.message);
      },
    });

    requestHandler({
      requestFn: () => spotifyAPI.get(`/me/following?type=artist`),
      onSuccess: async res => {
        setArtists(res?.data?.artists?.items);
      },
      onError: err => {
        console.log('artist Api', err.response?.data || err.message);
      },
    });
  }, [accessToken, refreshToken]);

  useEffect(() => {
    if (!accessToken) return;

    const spotifyAPI = createSpotifyAPI(accessToken, refreshToken);

    requestHandler({
      requestFn: () => spotifyAPI.get(`/me/tracks`),
      onSuccess: async res => {
        const album = {
          id: 'liked-songs',
          tracks: { items: res.data.items }
        }
        dispatch(setLikedSongAlbum(album))

      },
      onError: err => {
        console.log(err.response?.data || err.message);
      },
    });

  }, [accessToken, refreshToken, isFocused]);

  useEffect(() => {
    if (!accessToken) return;

    const spotifyAPI = createSpotifyAPI(accessToken, refreshToken);

    requestHandler({
      requestFn: () => spotifyAPI.get(`/me/tracks`),
      onSuccess: async res => {
        const album = {
          id: 'liked-songs',
          tracks: { items: res.data.items }
        }
        dispatch(setLikedSongAlbum(album))

      },
      onError: err => {
        console.log(err.response?.data || err.message);
      },
    });

  }, [accessToken, refreshToken, handleAddToLikedSongs]);

  const extractItems = () => {
    const allPlaylists = playlists.map(item => ({ ...item, type: 'Playlists' }));
    const allAlbums = albums.map(album => ({ ...album.album, type: 'Albums' }));
    const allArtists = artists.map(artist => ({ ...artist, type: 'Artists' }));
    return [...allPlaylists, ...allAlbums, ...allArtists];
  };

  useEffect(() => {
    const allItems = extractItems();

    for (let i = allItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
    }

    if (tab.length === 0) {
      setResults(allItems);
    } else {
      const filtered = allItems.filter(item => tab.includes(item.type));
      setResults(filtered);
    }
  }, [albums, playlists, artists, tab]);


  return (
    <View style={[s.container, { paddingBottom: playingObj?.id && verticalScale(60) }]}>
      <View style={s.tabContainer}>
        {playlists.length !== 0 && <Tab title="Playlists" />}
        {artists.length !== 0 && <Tab title="Artists" />}
        {albums.length !== 0 && <Tab title="Albums" />}
      </View>

      <View style={s.title}>
        <View style={s.row}>
          <View style={s.row}>
            <FontAwesome
              name="long-arrow-up"
              color={'white'}
              size={moderateScale(15)}
            />
            <FontAwesome
              name="long-arrow-down"
              color={'white'}
              size={moderateScale(15)}
            />
          </View>
          <View style={s.heading}>
            <TextCmp size={15}>Recently played</TextCmp>
          </View>
        </View>
        <Octicons name="apps" color={'white'} size={moderateScale(20)} />
      </View>

      <View style={s.listStyle}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={results}
          keyExtractor={(item, index) =>
            item.item?.id || `${item.type}-${index}`
          }
          renderItem={({ item }) => <LibraryCard item={item} />}
          ListHeaderComponent={() => {
            return (
              <>
                {likedSongAlbum?.tracks?.items?.length !== 0 &&
                  <TouchableOpacity style={s.card} onPress={() => navigation.navigate('LikedSongs')}>
                    <LinearGradient
                      locations={[0.12, 0.56, 0.99]}
                      colors={['#4A39EA', '#868AE1', '#B9D4DB']}
                      style={s.likedSongs}>
                      <FontAwesome
                        name="heart"
                        color={'white'}
                        size={moderateScale(25)}
                      />
                    </LinearGradient>
                    <View style={s.itemText}>
                      <View style={s.playlistTitleHead}>
                        <TextCmp weight="bold" size={16}>
                          Liked Songs
                        </TextCmp>
                      </View>

                      <View style={s.row}>
                        <MaterialIcons
                          name="push-pin"
                          color={Colors.green300}
                          size={15}
                        />
                        <TextCmp size={15} color={Colors.text400}>
                          Playlist
                          <Entypo
                            name="dot-single"
                            color={'white'}
                            size={moderateScale(15)}
                          />
                          {`${likedSongAlbum?.tracks?.items?.length} Song${likedSongAlbum?.tracks?.items?.length > 1 ? 's' : ''}`}
                        </TextCmp>
                      </View>
                    </View>
                  </TouchableOpacity>
                }


                <View style={s.card}>
                  <View style={[s.likedSongs, s.newEpi]}>
                    <MaterialIcons
                      name="notifications"
                      color={Colors.green300}
                      size={moderateScale(30)}
                    />
                  </View>
                  <View style={s.itemText}>
                    <View style={s.playlistTitleHead}>
                      <TextCmp weight="bold" size={16}>
                        New Episodes
                      </TextCmp>
                    </View>

                    <View style={s.row}>
                      <MaterialIcons
                        name="push-pin"
                        color={Colors.green300}
                        size={moderateScale(15)}
                      />
                      <TextCmp size={15} color={Colors.text400}>
                        Updated 2 days ago{' '}
                      </TextCmp>
                    </View>
                  </View>
                </View>
              </>
            );
          }}
        />
      </View>
    </View>
  );
};

export default Library;

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: verticalScale(20),
  },
  tabContainer: {
    flexDirection: 'row',
    gap: scale(10),
    paddingHorizontal: scale(10),
    alignItems: 'center',
    width: '100%',
  },
  tab: {
    borderWidth: 1,
    borderColor: '#7F7F7F',
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(15),
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    marginTop: verticalScale(10),
  },
  itemText: {
    justifyContent: 'center',
    paddingHorizontal: scale(10),
  },
  heading: {
    marginLeft: scale(5),
  },
  title: {
    marginTop: verticalScale(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scale(10),
  },

  playlistTitleHead: {
    marginBottom: moderateScale(5),
  },
  likedSongs: {
    width: scale(70),
    height: scale(70),
    justifyContent: 'center',
    alignItems: 'center',
  },
  newEpi: {
    backgroundColor: '#5E3B7A',
    borderRadius: moderateScale(10),
  },
  image: {
    height: '100%',
    width: '100%',
  },
  grayBox: {
    backgroundColor: '#C4C4C4',
    width: scale(18),
    height: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(5),
    marginRight: moderateScale(8),
  },
  listStyle: {
    flex: 1,
    marginHorizontal: scale(10),
  },
});
