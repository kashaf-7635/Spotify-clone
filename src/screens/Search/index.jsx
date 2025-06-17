import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Image,
  SectionList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Fonts from '../../utils/constants/fonts';
import Colors from '../../utils/constants/colors';
import Categories from '../../data/Categories';
import SearchModal from '../../components/SearchModal';
import {useRequest} from '../../hooks/useRequest';
import {useSelector} from 'react-redux';
import {createSpotifyAPI} from '../../utils/axios/axiosInstance';
import {FlatList} from 'react-native-gesture-handler';
import Loading from '../../components/Loading';
import TextCmp from '../../components/Styled/TextCmp';
import ImageCmp from '../../components/Styled/ImageCmp';

const Search = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const {requestHandler, isLoading} = useRequest();
  const accessToken = useSelector(state => state.auth.accessToken);
  const refreshToken = useSelector(state => state.auth.refreshToken);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    if (!accessToken) return;

    const spotifyAPI = createSpotifyAPI(accessToken, refreshToken);
    requestHandler({
      requestFn: () => spotifyAPI.get(`/browse/categories`),
      onSuccess: async res => {
        console.log(res?.data?.categories?.items);

        setAllCategories(res?.data?.categories?.items);
      },
      onError: err => {
        console.log(err.response?.data || err.message);
      },
    });
  }, [accessToken]);

  function getRandomDarkColor() {
    const h = Math.floor(Math.random() * 360);
    const s = 50 + Math.floor(Math.random() * 50);
    const l = 10 + Math.floor(Math.random() * 20);
    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  // const groupIntoRows = (data, itemsPerRow = 2) => {
  //   const rows = [];
  //   for (let i = 0; i < data.length; i += itemsPerRow) {
  //     rows.push(data.slice(i, i + itemsPerRow));
  //   }
  //   return rows;
  // };

  // const groupedCategories = Categories.map(section => ({
  //   ...section,
  //   data: groupIntoRows(section.data),
  // }));

  const renderItem = ({item}) => (
    <View style={s.row}>
      <View style={[s.box, {backgroundColor: getRandomDarkColor()}]}>
        <View style={{zIndex: 1}}>
          <TextCmp weight="bold" size={16}>
            {item.name}
          </TextCmp>
        </View>

        <View style={s.imageContainer}>
          <ImageCmp size={65} source={item?.icons?.[0].url} />
        </View>
      </View>
    </View>
  );

  return (
    <>
      <View style={s.main}>
        <TouchableOpacity
          style={s.searchContainer}
          onPress={() => setModalVisible(true)}>
          <FontAwesome
            name="search"
            color={Colors.textdark}
            size={moderateScale(25)}
          />

          <TextInput
            style={s.input}
            placeholder="Artists, songs, or podcasts"
            placeholderTextColor={Colors.textdark}
            editable={false}
            autoFocus
          />
        </TouchableOpacity>
        <View style={s.listStyle}>
          <View style={s.sectionTitle}>
            <TextCmp weight="bold" size={18}>
              Browse All
            </TextCmp>
          </View>

          {isLoading ? (
            <Loading />
          ) : (
            <FlatList
              data={allCategories}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              numColumns={2}
              columnWrapperStyle={{
                gap: scale(10),
                marginHorizontal: scale(5),
                marginVertical: verticalScale(5),
              }}
            />
          )}
        </View>

        {/* <SectionList
          sections={groupedCategories}
          keyExtractor={(item, index) => `row-${index}`}
          renderItem={renderItem}
          renderSectionHeader={({section: {title}}) => (
            <Text style={s.sectionTitle}>{title}</Text>
          )}
          contentContainerStyle={{
            paddingTop: moderateScale(10),
            paddingBottom: moderateScale(60),
          }}
        /> */}
        {modalVisible && (
          <View style={s.inlineModalWrapper}>
            <SearchModal
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
            />
          </View>
        )}
      </View>
    </>
  );
};

export default Search;

const s = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: verticalScale(30),
    paddingHorizontal: scale(10),
    alignItems: 'center',
  },
  searchContainer: {
    borderRadius: moderateScale(10),
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: scale(10),
  },
  input: {
    fontFamily: Fonts.regular,
    fontSize: moderateScale(16),
    color: Colors.textdark,
    flex: 1,
    marginLeft: scale(10),
  },
  sectionTitle: {
    paddingHorizontal: scale(10),
  },
  listStyle: {
    flex: 1,
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(60),
  },
  box: {
    backgroundColor: '#9854B2',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
    width: scale(150),
    height: verticalScale(75),
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    transform: [{rotate: '25deg'}],
  },
  placeholderText: {
    color: 'white',
    fontFamily: Fonts.bold,
  },
  inlineModalWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.bg800,
    zIndex: 10,
  },
});
