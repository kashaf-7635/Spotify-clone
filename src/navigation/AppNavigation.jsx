import {StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabs from './BottomTabs';
import Login from '../screens/Login';
import {useSelector} from 'react-redux';
import Track from '../screens/Album';
import TrackView from '../screens/TrackView';

const Stack = createStackNavigator();

const AppNavigation = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  // useEffect(() => {
  //   console.log(isAuthenticated, 'isAuthenticated');
  // }, [isAuthenticated]);
  return (
    <>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={Login} />
        ) : (
          <>
            <Stack.Screen name="BottomTabs" component={BottomTabs} />
            <Stack.Screen
              options={{presentation: 'modal'}}
              name="TrackView"
              component={TrackView}
            />
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

export default AppNavigation;

const s = StyleSheet.create({});
