import TrackPlayer, {Event, State} from 'react-native-track-player';
import {store} from './src/store';
import {setPlayingObj} from './src/store/playerSlice';

let wasPausedByDuck = false;

const setupTrackPlayerService = async () => {
  TrackPlayer.addEventListener(Event.RemotePause, async () => {
    await TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    await TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    await TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    await TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, async () => {
    await TrackPlayer.stop();
  });

  TrackPlayer.addEventListener(
    Event.RemoteDuck,
    async ({permanent, paused}) => {
      if (permanent) {
        await TrackPlayer.pause();
        return;
      }
      if (paused) {
        const playerState = await TrackPlayer.getPlaybackState().state;
        wasPausedByDuck = playerState !== State.Paused;
        await TrackPlayer.pause();
      } else {
        if (wasPausedByDuck) {
          await TrackPlayer.play();
          wasPausedByDuck = false;
        }
      }
    },
  );

  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async event => {
    console.log('Queue ended', event);
    store.dispatch(setPlayingObj(null));
  });

  TrackPlayer.addEventListener(
    Event.PlaybackActiveTrackChanged,
    async event => {
      console.log('Active track changed', event);
      const current = event.track;
      if (current) {
        store.dispatch(setPlayingObj(current));
      }
    },
  );
};

export default setupTrackPlayerService;
