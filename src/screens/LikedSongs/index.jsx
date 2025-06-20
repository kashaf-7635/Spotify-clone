import {
    Image,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import SimpleLineIcons from '@react-native-vector-icons/simple-line-icons';
import Entypo from '@react-native-vector-icons/entypo';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Fonts from '../../utils/constants/fonts';
import { useRequest } from '../../hooks/useRequest';
import { useDispatch, useSelector } from 'react-redux';
import { createSpotifyAPI } from '../../utils/axios/axiosInstance';
import Loading from '../../components/Loading';
import Colors from '../../utils/constants/colors';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Foundation from '@react-native-vector-icons/foundation';
import TrackCard from '../../components/Cards/TrackCard';
import LibraryCard from '../../components/Cards/LibraryCard';
import TrackPlayer, { State, usePlaybackState } from 'react-native-track-player';
import TextCmp from '../../components/Styled/TextCmp';
import ImageCmp from '../../components/Styled/ImageCmp';
import { loadAndPlayAlbum, loadAndPlayPlaylist, playAlbumFromIndex, playPlaylistFromIndex, togglePlayPause } from '../../utils/helpers/player';
import { useIsFocused } from '@react-navigation/native';
import { setLikedSongAlbum } from '../../store/playerSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LikedSongs = ({ navigation }) => {
    const dispatch = useDispatch()
    const insets = useSafeAreaInsets();
    const playbackState = usePlaybackState().state;
    const isPlaying = playbackState === State.Playing;
    const { requestHandler, isLoading } = useRequest();
    const accessToken = useSelector(state => state.auth.accessToken);
    const refreshToken = useSelector(state => state.auth.refreshToken);
    const isFocused = useIsFocused();
    const userData = useSelector(state => state.auth.userData);


    const playingObj = useSelector(state => state.player.playingObj);
    const likedSongAlbum = useSelector(state => state.player.likedSongAlbum);
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


    const handlePlayPause = async () => {
        const isSameAlbum = playingObj?.parentId === likedSongAlbum?.id;
        if (!isSameAlbum || !playingObj) {
            await loadAndPlayPlaylist(likedSongAlbum);
        } else {
            await togglePlayPause();
        }
    };

    const handleTrackSelect = async index => {
        await playPlaylistFromIndex(likedSongAlbum, index);
    };

    return (
        <LinearGradient
            colors={['#962419', '#661710', '#430E09']}
            locations={[0, 0.45, 1]}
            style={[s.container, { paddingBottom: playingObj ? verticalScale(60) : 0 }]}>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <View style={[s.main,
                    { paddingTop: insets.top+ 20 }
                    ]}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <SimpleLineIcons
                                name="arrow-left"
                                color={'white'}
                                size={moderateScale(15)}
                            />
                        </TouchableOpacity>

                        <View style={s.inner}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={likedSongAlbum?.tracks?.items}
                                ListHeaderComponent={
                                    <>
                                        <View style={s.imageView}>
                                            <View style={s.imageContainer}>
                                                <LinearGradient
                                                    locations={[0.12, 0.56, 0.99]}
                                                    colors={['#4A39EA', '#868AE1', '#B9D4DB']}
                                                    style={s.likedSongs}>
                                                    <FontAwesome
                                                        name="heart"
                                                        color={'white'}
                                                        size={moderateScale(70)}
                                                    />
                                                </LinearGradient>
                                            </View>
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
                                                            {`${userData?.display_name?.split(' ')[0]
                                                                }'s Liked Songs`}
                                                        </TextCmp>
                                                    </View>



                                                    <View
                                                        style={[
                                                            s.row,
                                                            {
                                                                marginTop: verticalScale(10),
                                                                gap: scale(20),
                                                            },
                                                        ]}>
                                                        <FontAwesome
                                                            name="heart-o"
                                                            color={'#CBB7B5'}
                                                            size={moderateScale(25)}
                                                        />

                                                        <TouchableOpacity style={s.iconCircle}>
                                                            <FontAwesome
                                                                name="long-arrow-down"
                                                                color={'#000000'}
                                                                size={moderateScale(15)}
                                                            />
                                                        </TouchableOpacity>
                                                        <Entypo
                                                            name="dots-three-horizontal"
                                                            color={'white'}
                                                            size={moderateScale(20)}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={s.playPauseView}>
                                                    <TouchableOpacity
                                                        onPress={handlePlayPause}
                                                        style={[s.iconCircle, s.iconCircleBig]}>
                                                        <Foundation
                                                            name={
                                                                isPlaying && playingObj?.parentId === likedSongAlbum.id
                                                                    ? 'pause'
                                                                    : 'play'
                                                            }
                                                            color="#000000"
                                                            size={moderateScale(35)}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                }
                                renderItem={({ item, index }) => {
                                    return (
                                        <>

                                            <TouchableOpacity onPress={() => handleTrackSelect(index)}>
                                                <TrackCard item={item.track} />
                                            </TouchableOpacity>

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

export default LikedSongs;

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
        height: moderateScale(15),
        width: moderateScale(15),
        borderRadius: moderateScale(7.5),
    },
    iconCircle: {
        height: moderateScale(20),
        width: moderateScale(20),
        borderRadius: moderateScale(10),
        backgroundColor: Colors.green300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircleBig: {
        height: moderateScale(50),
        width: moderateScale(50),
        borderRadius: moderateScale(25),
    },
    panel: {
        marginTop: moderateScale(30),
    },
    row: {
        flexDirection: 'row',
    },
    likedSongs: {
        width: scale(200),
        height: scale(200),
        justifyContent: 'center',
        alignItems: 'center',
    },
});
