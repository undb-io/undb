import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'

import { rootReducer } from '../reducers'
import rootSaga from '../sagas/table'
import type { SagaContext } from './context'
import { context } from './context'

export const createStore = () => {
  const sagaMiddleware = createSagaMiddleware<SagaContext>({ context })

  const store = configureStore({
    reducer: rootReducer,
    middleware: [sagaMiddleware, logger],
    devTools: process.env.NODE_ENV !== 'production',
  })

  sagaMiddleware.run(rootSaga)

  return store
}
