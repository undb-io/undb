import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { PersistGate, createStore } from '@undb/store'
import { EgoUIProvider, Notifications } from '@undb/ui'
import { Provider } from 'react-redux'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import { I18n } from './i18n/i18n'
import { BrowserRouter } from 'react-router-dom'

const { store, persist } = createStore()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persist}>
        <I18n>
          <EgoUIProvider theme={{ primaryColor: 'indigo' }} withGlobalStyles withNormalizeCSS>
            <Notifications />
            <BrowserRouter>
              <QueryParamProvider adapter={ReactRouter6Adapter}>
                <App />
              </QueryParamProvider>
            </BrowserRouter>
          </EgoUIProvider>
        </I18n>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
