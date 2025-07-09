import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../utils/constants/colors';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import Fonts from '../../utils/constants/fonts';
import { useRequest } from '../../hooks/useRequest';
import { useDispatch, useSelector } from 'react-redux';
import { createSpotifyAPI } from '../../utils/axios/axiosInstance';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import LibraryCard from '../Cards/LibraryCard';
import {
  addRecentSearch,
  clearRecentSearches,
  removeRecentSearch,
} from '../../store/playerSlice';
import TextCmp from '../Styled/TextCmp';


const SearchModal = ({ modalVisible, setModalVisible }) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState(false);
  const { requestHandler, isLoading } = useRequest();
  const accessToken = useSelector(state => state.auth.accessToken);
  const refreshToken = useSelector(state => state.auth.refreshToken);
  const recentSearches = useSelector(state => state.player.recentSearches);

  const [results, setResults] = useState([]);

  const debouncedSearch = useDebouncedValue(searchQuery, 500);

  useEffect(() => {
    if (!accessToken || !debouncedSearch) return;

    const spotifyAPI = createSpotifyAPI(accessToken, refreshToken);

    requestHandler({
      requestFn: () =>
        spotifyAPI.get(
          `/search?q=${encodeURIComponent(
            debouncedSearch,
          )}&type=album,artist,playlist,track,show&limit=5`,
        ),
      onSuccess: res => {
        dispatch(addRecentSearch(debouncedSearch.trim()));
        const safeMap = items => (items || []).filter(item => item && item.id);

        const combined = [
          ...safeMap(res.data?.albums?.items),
          ...safeMap(res.data?.artists?.items),
          ...safeMap(res.data?.playlists?.items),
          ...safeMap(res.data?.tracks?.items),
        ];

        // Shuffle
        for (let i = combined.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [combined[i], combined[j]] = [combined[j], combined[i]];
        }
        console.log(combined);

        setResults(combined);
      },
      onError: err => {
        console.log(err.response?.data || err.message);
      },
    });
  }, [debouncedSearch, accessToken]);

  useEffect(() => {
    if (!modalVisible) {
      setSearchQuery('');
    }
  }, [modalVisible]);

  useEffect(() => {
    console.log(recentSearches);
  }, [recentSearches]);

  return (
    <View style={[s.centeredView]}>
      <View style={s.header}>
        <TouchableOpacity style={s.searchContainer}>
          <FontAwesome name="search" color={'white'} size={moderateScale(20)} />
          <TextInput
            style={s.input}
            placeholder="Search"
            placeholderTextColor={'white'}
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={s.cancelBtn}
          onPress={() => setModalVisible(false)}>
          <TextCmp size={18}>Cancel</TextCmp>
        </TouchableOpacity>
      </View>

      <View style={s.searchResult}>
        {debouncedSearch.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={(item, index) =>
              item.item?.id || `${item.type}-${index}`
            }
            renderItem={({ item }) => <LibraryCard item={item} />}
          />
        ) : (
          <>
            <View style={s.row}>
              <TextCmp size={20} weight="bold">
                Recent searches
              </TextCmp>
              <TouchableOpacity onPress={() => dispatch(clearRecentSearches())}>
                <TextCmp size={15}>Clear History</TextCmp>
              </TouchableOpacity>
            </View>

            <FlatList
              data={recentSearches}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <View
                  style={{
                    width: '100%',
                    marginVertical: verticalScale(10),
                    borderBottomColor: Colors.text400,
                    borderBottomWidth: 2,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity onPress={() => setSearchQuery(item)}>
                    <TextCmp size={14}>{item}</TextCmp>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => dispatch(removeRecentSearch(item))}>
                    <MaterialIcons
                      name="close"
                      size={moderateScale(18)}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default SearchModal;

const s = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: Colors.bg800,
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(15),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    borderRadius: moderateScale(10),
    flexDirection: 'row',
    backgroundColor: '#282828',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    flex: 0.8,
    paddingVertical: Platform.OS === 'ios' ? verticalScale(10) : 0,
  },
  input: {
    fontFamily: Fonts.regular,
    fontSize: moderateScale(18),
    color: 'white',
    flex: 1,
    marginLeft: scale(10),
  },
  cancelBtn: {
    flex: 0.2,
    alignItems: 'flex-end',
  },
  heading: {
    fontFamily: Fonts.bold,
    fontSize: moderateScale(20),
    color: 'white',
  },
  searchResult: {
    paddingVertical: verticalScale(10),
  },
});
