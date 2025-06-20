import TrackPlayer, { AppKilledPlaybackBehavior, Capability, State } from 'react-native-track-player';
import Track from '../../models/track';

export async function setupPlayer() {
  let isSetup = false;
  try {
    await TrackPlayer.getActiveTrack();
    isSetup = true;
  }
  catch {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      progressUpdateEventInterval: 2,
    });

    isSetup = true;
  }
  finally {
    return isSetup;
  }
}
function isValidBase64(str) {
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
  return base64Regex.test(str);
}
export const loadAndPlayAlbum = async album => {
  const formattedTracks = album.tracks.items.map(item => {
    return new Track(
      item.id,
      item.name,
      item?.artists[0]?.name,
      album?.images?.[0]?.url || item?.album?.images?.[0]?.url,
      item.duration_ms ? item.duration_ms / 1000 : 30,
      isValidBase64(album?.id) ? album?.id : item?.album?.id,
      album?.id,
    );
  });
  console.log(formattedTracks);

  await TrackPlayer.reset();
  await TrackPlayer.add(formattedTracks);
  await TrackPlayer.play();
};
export const playAlbumFromIndex = async (album, startIndex = 0) => {
  const formattedTracks = album.tracks.items.map(
    item =>
      new Track(
        item.id,
        item.name,
        item.artists?.[0]?.name,
        album?.images?.[0]?.url || item?.album?.images?.[0]?.url,
        item.duration_ms ? item.duration_ms / 1000 : 30,
        isValidBase64(album?.id) ? album?.id : item?.album?.id,
        album?.id
      ),
  );

  await TrackPlayer.reset();
  await TrackPlayer.add(formattedTracks);
  await TrackPlayer.skip(startIndex);
  await TrackPlayer.play();
};


export const loadAndPlayPlaylist = async playlist => {
  const formattedTracks = playlist.tracks.items.map(item => {
    return new Track(
      item.track.id,
      item.track.name,
      item.track?.artists[0]?.name,
      playlist?.images?.[0]?.url || item?.track?.album?.images?.[0]?.url,
      item.track?.duration_ms ? item.track?.duration_ms / 1000 : 30,
      item?.track?.album?.id,
      playlist?.id,

    );
  });
  console.log(formattedTracks);

  await TrackPlayer.reset();
  await TrackPlayer.add(formattedTracks);
  await TrackPlayer.play();
};

export const togglePlayPause = async (album = null, playlist = null) => {
  const state = (await TrackPlayer.getPlaybackState()).state;

  if (state === State.Playing) {
    await TrackPlayer.pause();
  } else if (state === State.Paused || state === State.Ready) {
    const queue = await TrackPlayer.getQueue();
    if (queue.length > 0) {
      await TrackPlayer.play();
    }
  } else if (state === State.Stopped || state === State.Idle) {
    if (album) {
      await loadAndPlayAlbum(album);
    }
    if (playlist) {
      await loadAndPlayPlaylist(playlist);
    }
  }
};

export const getCurrentTrack = async () => {
  const index = await TrackPlayer.getActiveTrackIndex();
  if (index == null) return null;
  return await TrackPlayer.getTrack(index);
};



export const playPlaylistFromIndex = async (playlist, startIndex = 0) => {
  const formattedTracks = playlist.tracks.items.map(item => {
    return new Track(
      item.track.id,
      item.track.name,
      item.track?.artists[0]?.name,
      playlist?.images?.[0]?.url || item?.track?.album?.images?.[0]?.url,
      item.track?.duration_ms ? item.track?.duration_ms / 1000 : 30,
      item.track?.album?.id,
      playlist?.id,

    );
  });

  await TrackPlayer.reset();
  await TrackPlayer.add(formattedTracks);
  await TrackPlayer.skip(startIndex);
  await TrackPlayer.play();
};

export const loadAndPlaySingleTrack = async item => {
  const formattedTrack = new Track(
    item.id,
    item.name,
    item?.artists[0]?.name,
    item.album?.images?.[0]?.url,
    item.duration_ms ? item.duration_ms / 1000 : 30, item.album?.id, null);

  await TrackPlayer.reset();
  await TrackPlayer.add([formattedTrack]);
  await TrackPlayer.play();
};
