import { createSlice } from '@reduxjs/toolkit';

const playerSlice = createSlice({
  name: 'player',
  initialState: {
    playingObj: null,
    recentSearches: [],
    isShuffled: false,
  },
  reducers: {
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
    setIsShuffled: (state, action) => {
      state.isShuffled = action.payload;
    },
  },
});

export const {
  setPlayingObj,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
  setIsShuffled
} = playerSlice.actions;

export default playerSlice.reducer;
