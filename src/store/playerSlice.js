import {createSlice} from '@reduxjs/toolkit';

const playerSlice = createSlice({
  name: 'player',
  initialState: {
    currentTrack: null,
    playingObj: null,
    recentSearches: [],
  },
  reducers: {
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload;
    },
    setPlayingObj: (state, action) => {
      state.playingObj = action.payload;
    },

    addRecentSearch: (state, action) => {
      const query = action.payload?.trim();
      if (!query) return;

      const filtered = (state.recentSearches || []).filter(q => q !== query);
      state.recentSearches = [query, ...filtered].slice(0, 10);
    },
    removeRecentSearch: (state, action) => {
      const query = action.payload;
      state.recentSearches = state.recentSearches.filter(q => q !== query);
    },

    clearRecentSearches: state => {
      state.recentSearches = [];
    },
  },
});

export const {
  setCurrentTrack,
  setPlayingObj,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} = playerSlice.actions;

export default playerSlice.reducer;
