import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './authSlice';
import playerReducer from './playerSlice';

const appReducer = combineReducers({
  auth: authReducer,
  player: playerReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_STORE') {
    AsyncStorage.removeItem('persist:root'); 
    state = {
      auth: undefined,
      player: undefined,
    };
  }

  return appReducer(state, action);
};

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PURGE',
        ],
      },
    }),
});

// Step 5: Setup persistor
export const persistor = persistStore(store);
