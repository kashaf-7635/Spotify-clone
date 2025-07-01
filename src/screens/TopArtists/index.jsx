import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import SimpleLineIcons from '@react-native-vector-icons/simple-line-icons';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import Fonts from '../../utils/constants/fonts';
import {useRequest} from '../../hooks/useRequest';
import {useSelector} from 'react-redux';
import {createSpotifyAPI} from '../../utils/axios/axiosInstance';
import Loading from '../../components/Loading';
import Colors from '../../utils/constants/colors';
import LibraryCard from '../../components/Cards/LibraryCard';
import TextCmp from '../../components/Styled/TextCmp';
import ImageCmp from '../../components/Styled/ImageCmp';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused} from '@react-navigation/native';

const TopArtists = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const {requestHandler, isLoading} = useRequest();
  const accessToken = useSelector(state => state.auth.accessToken);
  const refreshToken = useSelector(state => state.auth.refreshToken);
  const userData = useSelector(state => state.auth.userData);
  const [topArtists, setTopArtists] = useState([]);
  const playingObj = useSelector(state => state.player.playingObj);
  const isFocused = useIsFocused();
  const scrollY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (isFocused) {
      scrollY.setValue(0);
    }
  }, [isFocused]);
  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {
      useNativeDriver: false,
    },
  );

  const imageSize = scrollY.interpolate({
    inputRange: [verticalScale(0), verticalScale(100)],
    outputRange: [verticalScale(200), verticalScale(70)],
    extrapolate: 'clamp',
  });
  const titleOpacity = scrollY.interpolate({
    inputRange: [verticalScale(150), verticalScale(180)],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (!accessToken) return;

    const spotifyAPI = createSpotifyAPI(accessToken, refreshToken);
    requestHandler({
      requestFn: () =>
        spotifyAPI.get(`/me/top/artists?limit=10&time_range=short_term`),
      onSuccess: async res => {
        console.log(res.data, 'top artists data');
        setTopArtists(res.data.items);
      },
      onError: err => {
        console.log(err.response?.data || err.message);
      },
    });
  }, [accessToken]);

  return (
    <LinearGradient
      colors={['#962419', '#661710', '#430E09']}
      locations={[0, 0.45, 1]}
      style={[
        s.container,
        {paddingBottom: playingObj ? verticalScale(60) : 0},
      ]}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <View style={[s.main, {paddingTop: insets.top + verticalScale(20)}]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <SimpleLineIcons
                name="arrow-left"
                color={'white'}
                size={moderateScale(15)}
              />
            </TouchableOpacity>

            <View style={s.inner}>
              <Animated.FlatList
                onScroll={handleScroll}
                showsVerticalScrollIndicator={false}
                data={topArtists}
                ListHeaderComponent={
                  <>
                    <View style={s.imageView}>
                      <ImageCmp
                        animated={true}
                        size={imageSize}
                        source={require('../../assets/images/album/2.png')}
                      />
                    </View>

                    <View style={s.panel}>
                      <View style={s.row}>
                        <View style={s.titleView}>
                          <View style={s.row}>
                            <View style={s.avatar}>
                              <ImageCmp
                                source={
                                  userData?.images?.[0]?.url ||
                                  'https://cdn-icons-png.flaticon.com/128/15735/15735374.png'
                                }
                                size={30}
                                borderRadius={15}
                              />
                            </View>
                            <TextCmp weight="bold" size={20}>
                              Your Top Artists
                            </TextCmp>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                }
                renderItem={({item, index}) => {
                  return (
                    <>
                      <LibraryCard item={item} />
                    </>
                  );
                }}
              />
            </View>
          </View>
        </>
      )}
    </LinearGradient>
  );
};

export default TopArtists;

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(10),
  },
  main: {
    flex: 1,
    paddingHorizontal: moderateScale(10),
    paddingBottom: moderateScale(30),
  },
  inner: {
    paddingHorizontal: moderateScale(10),
  },
  row: {
    flexDirection: 'row',
  },
  imageView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(20),
  },
  title: {
    color: 'white',
    fontFamily: Fonts.regular,
    fontSize: 16,
  },
  titleView: {
    flex: 1,
  },
  playPauseView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  avatar: {
    marginRight: moderateScale(10),
  },
  subtitle: {
    color: 'white',
    fontFamily: Fonts.bold,
    fontSize: 17,
    marginTop: moderateScale(8),
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
  iconCircleBig: {
    height: scale(50),
    width: scale(50),
    borderRadius: scale(25),
  },
  panel: {
    marginTop: moderateScale(30),
  },
  row: {
    flexDirection: 'row',
  },
});
