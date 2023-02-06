import { configureStore } from '@reduxjs/toolkit'

import { rootReducer } from '../reducers'
import { api } from '../services/api'

export const createStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat().concat(api.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  })

  return store
}

export type AppStore = ReturnType<typeof createStore>

export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
