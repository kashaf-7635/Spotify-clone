import {ActivityIndicator, StyleSheet, View} from 'react-native';
import React from 'react';
import Colors from '../../utils/constants/colors';

const Loading = () => {
  return (
    <View style={s.container}>
      <ActivityIndicator size={'large'} color={Colors.green300} />
    </View>
  );
};

export default Loading;

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
