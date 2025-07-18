import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import Colors from '../../utils/constants/colors';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {authenticate} from '../../store/authSlice';
import {createSpotifyAPI} from '../../utils/axios/axiosInstance';
import {useRequest} from '../../hooks/useRequest';
import Loading from '../../components/Loading';
import TextCmp from '../../components/Styled/TextCmp';
import ImageCmp from '../../components/Styled/ImageCmp';
import {handleOpenInAppBrowser} from '../../utils/auth/AuthService';

export default function Login({}) {
  const dispatch = useDispatch();
  const {requestHandler, isLoading} = useRequest();
  const userData = useSelector(state => state.auth.userData);

  useEffect(() => {
    console.log(userData);
  }, [userData]);
  const handleLogin = async () => {
    requestHandler({
      requestFn: () => handleOpenInAppBrowser(),
      onSuccess: async authResult => {
        console.log(authResult);

        const accessToken = authResult?.access_token;
        const refreshToken = authResult?.refresh_token;
        const spotifyAPI = createSpotifyAPI(accessToken, refreshToken);

        requestHandler({
          requestFn: () => spotifyAPI.get('/me'),
          onSuccess: userResponse => {
            const userData = userResponse?.data;
            console.log({userData, accessToken, refreshToken});

            dispatch(authenticate({userData, accessToken, refreshToken}));
            Alert.alert('Welcome!', `Welcome ${userData.display_name}!`);
          },
          onError: err => {
            console.log(err.response.data, 'user data api');
          },
        });
      },
      onError: err => {
        console.log(err, 'login api');
      },
    });
  };

  return (
    <View style={[s.main]}>
      <ImageBackground
        resizeMode="cover"
        source={require('../../assets/images/login-bg.png')}
        style={s.bg}>
        <ImageCmp
          source={require('../../assets/images/white-logo.png')}
          size={50}
        />
      </ImageBackground>

      <View style={s.content}>
        <View style={s.heading}>
          <TextCmp size={30} weight="bold" align="center">
            Millions of Songs.
          </TextCmp>
          <TextCmp size={30} weight="bold" align="center">
            Free on Spotify.
          </TextCmp>
        </View>

        <View style={s.btns}>
          {isLoading ? (
            <Loading />
          ) : (
            <TouchableOpacity style={s.greenBtn} onPress={handleLogin}>
              <TextCmp color="#000000" weight="bold" align="center" size={18}>
                Sign up free
              </TextCmp>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111111',
  },
  bg: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    paddingVertical: verticalScale(20),
  },

  content: {
    width: '100%',
    paddingHorizontal: scale(35),
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  heading: {
    marginTop: verticalScale(20),
  },
  imageContainer: {
    width: scale(50),
    height: verticalScale(50),
  },

  btns: {
    width: '100%',
    marginTop: verticalScale(20),
  },
  greenBtn: {
    backgroundColor: Colors.green200,
    borderRadius: moderateScale(20),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
    width: '100%',
  },
});
