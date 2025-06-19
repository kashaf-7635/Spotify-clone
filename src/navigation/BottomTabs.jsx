import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Search from '../screens/Search';
import Library from '../screens/Library';
import Foundation from '@react-native-vector-icons/foundation';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Colors from '../utils/constants/colors';
import Fonts from '../utils/constants/fonts';
import SearchHeader from '../components/Headers/SearchHeader';
import LibraryHeader from '../components/Headers/LibraryHeader';
import CurrentlyPlaying from '../components/CurrentlyPlaying';
import HomeHeader from '../components/Headers/HomeHeader';
import Album from '../screens/Album';
import Playlist from '../screens/Playlist';
import Artist from '../screens/Artist';
import UserFeaturedItem from '../screens/UserFeaturedItem';
import { useSelector } from 'react-redux';
import LikedSongs from '../screens/LikedSongs';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const playingObj = useSelector(state => state.player.playingObj);

  useEffect(() => {
    console.log(playingObj, 'playingObj');
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          sceneStyle: { backgroundColor: Colors.bg800 },
          tabBarStyle: {
            backgroundColor: Colors.bg800,
            borderTopWidth: 0,
            height: 100,
            paddingTop: 10,
          },
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: Colors.bg500,
          tabBarLabelStyle: {
            fontSize: 16,
            fontFamily: Fonts.regular,
          },
        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Foundation name="home" color={color} size={size} />
            ),
            header: () => <HomeHeader />,
          }}
        />
        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="search" color={color} size={size} />
            ),
            header: () => <SearchHeader />,
          }}
        />
        <Tab.Screen
          name="Library"
          component={Library}
          options={{
            title: 'Your Library',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome6
                name="lines-leaning"
                color={color}
                size={size}
                iconStyle="solid"
              />
            ),
            header: () => <LibraryHeader />,
          }}
        />
        <Tab.Screen
          name="Album"
          component={Album}
          options={{
            tabBarButton: () => null,
            tabBarItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Playlist"
          component={Playlist}
          options={{
            tabBarButton: () => null,
            tabBarItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Artist"
          component={Artist}
          options={{
            tabBarButton: () => null,
            tabBarItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        <Tab.Screen
          name="UserFeaturedItem"
          component={UserFeaturedItem}
          options={{
            tabBarButton: () => null,
            tabBarItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="LikedSongs"
          component={LikedSongs}
          options={{
            tabBarButton: () => null,
            tabBarItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />
      </Tab.Navigator>

      {playingObj && <CurrentlyPlaying style={s.playerOverlay} />}
    </View>
  );
};

export default BottomTabs;

const s = StyleSheet.create({
  playerOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});
