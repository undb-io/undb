import { configureStore } from '@reduxjs/toolkit'
import { persistStore } from 'redux-persist'
import { rootReducder } from '../reducers'

import { attachment, authApi } from '../services'
import { api } from '../services/api'

export const createStore = () => {
  const store = configureStore({
    reducer: rootReducder,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false })
        .concat(api.middleware)
        .concat(attachment.middleware)
        .concat(authApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  })

  const persist = persistStore(store)

  return { store, persist }
}

export type AppStore = ReturnType<typeof createStore>['store']

export { PersistGate } from 'redux-persist/integration/react'

export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
