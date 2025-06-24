import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import RecentlyPlayedCard from '../../components/Cards/RecentlyPlayedCard';
import Colors from '../../utils/constants/colors';
import {useRequest} from '../../hooks/useRequest';
import {useSelector} from 'react-redux';
import {createSpotifyAPI} from '../../utils/axios/axiosInstance';
import NewReleaseAlbum from '../../components/Cards/NewReleaseAlbum';
import Loading from '../../components/Loading';
import {scale, verticalScale} from 'react-native-size-matters';
import TextCmp from '../../components/Styled/TextCmp';
import ImageCmp from '../../components/Styled/ImageCmp';
import {authConfig} from '../../utils/auth/authConfig';
import {refresh} from 'react-native-app-auth';

const Home = ({navigation}) => {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [results, setResults] = useState([]);
  const [newReleases, setNewRelease] = useState([]);
  const [tracks, setTracks] = useState([]);

  const {requestHandler, isLoading} = useRequest();
  const accessToken = useSelector(state => state.auth.accessToken);
  const refreshToken = useSelector(state => state.auth.refreshToken);
  const playingObj = useSelector(state => state.player.playingObj);

  useEffect(() => {
    if (!accessToken) return;

    const spotifyAPI = createSpotifyAPI(accessToken, refreshToken);

    requestHandler({
      requestFn: () => spotifyAPI.get(`/browse/new-releases`),
      onSuccess: async res => {
        setNewRelease(res?.data?.albums?.items);
      },
      onError: err => {
        console.log(err.response?.data || err.message);
      },
    });

    requestHandler({
      requestFn: () => spotifyAPI.get('/me/player/recently-played'),
      onSuccess: async res => {
        const items = res.data.items;

        const trackMap = {};
        items.forEach(item => {
          const track = item.track;
          if (track && track.id && !trackMap[track.id]) {
            trackMap[track.id] = track;
          }
        });
        const allTracks = Object.values(trackMap);

        setTracks(allTracks);

        const allArtists = items.flatMap(item => item.track.artists);
        const artistMap = {};
        allArtists.forEach(artist => {
          artistMap[artist.id] = artist;
        });

        const uniqueArtists = Object.values(artistMap);
        const ids = uniqueArtists.map(artist => artist.id).slice(0, 10);

        const artistDetailsRes = await spotifyAPI.get(
          `/artists?ids=${ids.join(',')}`,
        );
        const detailedArtists = artistDetailsRes.data.artists;
        setArtists(detailedArtists);

        const albumPromises = ids.map(id =>
          spotifyAPI.get(
            `/artists/${id}/albums?include_groups=album,single&limit=2`,
          ),
        );

        const albumResponses = await Promise.all(albumPromises);
        const allAlbums = albumResponses.flatMap(res => res.data.items);

        setAlbums(allAlbums);
      },
      onError: async err => {
        console.log('recently played api:', err.response.data);

        const staticArtistIds = [
          '1Xyo4u8uXC1ZmMpatF05PJ',
          '66CXWjxzNUsdJxJ2JdwvnR',
          '3TVXtAsR1Inumwj472S9r4',
          '6eUKZXaKkcviH0Ku9w2n3V',
          '0du5cEVh5yTK9QJze8zA0C',
        ];

        try {
          const artistDetailsRes = await spotifyAPI.get(
            `/artists?ids=${staticArtistIds.join(',')}`,
          );
          const detailedArtists = artistDetailsRes.data.artists;
          setArtists(detailedArtists);

          const albumPromises = staticArtistIds.map(id =>
            spotifyAPI.get(
              `/artists/${id}/albums?include_groups=album,single&limit=2`,
            ),
          );

          const albumResponses = await Promise.all(albumPromises);
          const allAlbums = albumResponses.flatMap(res => res.data.items);
          setAlbums(allAlbums);
        } catch (fallbackErr) {
          console.log('Fallback failed:', fallbackErr.message);
        }
      },
    });
  }, [accessToken]);

  useEffect(() => {
    const extractItems = () => {
      const albumItems = (albums || []).filter(item => item && item.id);

      const artistsItems = (artists || []).filter(item => item && item.id);

      return [...albumItems, ...artistsItems];
    };

    const combined = extractItems();

    // Shuffle
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    setResults(combined);
  }, [albums, artists]);

  return (
    <View style={s.main}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
            <View
              style={{
                flexGrow: 1,
                paddingTop: verticalScale(15),
                paddingBottom: playingObj?.id && verticalScale(60),
              }}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                data={results}
                keyExtractor={item => item.id}
                renderItem={({item}) => {
                  return <RecentlyPlayedCard item={item} />;
                }}
              />

              <View style={[s.row, {marginVertical: verticalScale(10)}]}>
                <ImageCmp
                  size={60}
                  borderRadius={10}
                  source={require('../../assets/images/wrapped.png')}
                />

                <View style={s.textContainer}>
                  <TextCmp color={Colors.text500} size={13}>
                    #SPOTIFYWRAPPED
                  </TextCmp>

                  <TextCmp weight="bold" size={26}>
                    Your 2021 in review
                  </TextCmp>
                </View>
              </View>

              <View style={[s.row, s.featuredItems]}>
                <TouchableOpacity
                  style={s.album}
                  onPress={() => navigation.navigate('TopSongs')}>
                  <ImageCmp
                    source={require('../../assets/images/album/1.png')}
                    size={150}
                    borderRadius={8}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.album}
                  onPress={() => navigation.navigate('TopArtists')}>
                  <ImageCmp
                    source={require('../../assets/images/album/2.png')}
                    size={150}
                    borderRadius={8}
                  />
                </TouchableOpacity>
              </View>
              {tracks.length !== 0 && (
                <View style={{marginTop: verticalScale(15)}}>
                  <View style={{marginBottom: verticalScale(10)}}>
                    <TextCmp weight="bold" size={20}>
                      Editor's Picks
                    </TextCmp>
                  </View>

                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={tracks}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => {
                      return <NewReleaseAlbum item={item} />;
                    }}
                  />
                </View>
              )}
              {newReleases.length !== 0 && (
                <View style={{marginTop: verticalScale(15)}}>
                  <View style={{marginBottom: verticalScale(10)}}>
                    <TextCmp weight="bold" size={20}>
                      Hand-picked new releases
                    </TextCmp>
                  </View>

                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={newReleases}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => {
                      return <NewReleaseAlbum item={item} />;
                    }}
                  />
                </View>
              )}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default Home;

const s = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: scale(10),
    alignItems: 'center',
    backgroundColor: Colors.bg800,
  },
  row: {
    flexDirection: 'row',
  },
  featuredItems: {
    gap: scale(15),
    marginVertical: verticalScale(10),
  },
  textContainer: {
    flex: 4,
    justifyContent: 'center',
    marginLeft: scale(10),
  },
});
