import './gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import setupTrackPlayerService from './service';
import {persistor} from './src/store';

AppRegistry.registerComponent(appName, () => App);

persistor.subscribe(() => {
  const state = persistor.getState();
  if (state.bootstrapped) {
    TrackPlayer.registerPlaybackService(() => setupTrackPlayerService);
  }
});
