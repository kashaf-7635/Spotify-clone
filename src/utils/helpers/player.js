import TrackPlayer, { State } from 'react-native-track-player';
import Track from '../../models/track';

export const setupPlayer = async () => {
  const isSetup = await TrackPlayer.getActiveTrackIndex().catch(() => null);
  if (isSetup === null) {
    await TrackPlayer.setupPlayer();
  }
};

export const loadAndPlayAlbum = async album => {
  const formattedTracks = album.tracks.items.map(item => {
    return new Track(
      item.id,
      item.name,
      item?.artists[0]?.name,
      album?.images?.[0]?.url,
      item.duration_ms ? item.duration_ms / 1000 : 30,
      album?.id,

    );
  });
  console.log(formattedTracks);

  await TrackPlayer.reset();
  await TrackPlayer.add(formattedTracks);
  await TrackPlayer.play();
};

export const loadAndPlayPlaylist = async playlist => {
  const formattedTracks = playlist.tracks.items.map(item => {
    return new Track(
      item.track.id,
      item.track.name,
      item.track?.artists[0]?.name,
      playlist?.images?.[0]?.url,
      item.track?.duration_ms ? item.track?.duration_ms / 1000 : 30,
      playlist?.id,

    );
  });
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

export const playAlbumFromIndex = async (album, startIndex = 0) => {
  const formattedTracks = album.tracks.items.map(
    item =>
      new Track(
        item.id,
        item.name,
        item.artists?.[0]?.name,
        album.images?.[0]?.url,
        item.duration_ms ? item.duration_ms / 1000 : 30,
        album.id,
      ),
  );

  await TrackPlayer.reset();
  await TrackPlayer.add(formattedTracks);
  await TrackPlayer.skip(startIndex);
  await TrackPlayer.play();
};

export const playPlaylistFromIndex = async (playlist, startIndex = 0) => {
  const formattedTracks = playlist.tracks.items.map(item => {
    return new Track(
      item.track.id,
      item.track.name,
      item.track?.artists[0]?.name,
      playlist?.images?.[0]?.url,
      item.track?.duration_ms ? item.track?.duration_ms / 1000 : 30,
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
    item.duration_ms ? item.duration_ms / 1000 : 30, item.album?.id);

  await TrackPlayer.reset();
  await TrackPlayer.add([formattedTrack]);
  await TrackPlayer.play();
};
