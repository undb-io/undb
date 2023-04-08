import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { PersistGate, createStore } from '@egodb/store'
import { EgoUIProvider } from '@egodb/ui'
import { Provider } from 'react-redux'
import { I18n } from './i18n/i18n'

const { store, persist } = createStore()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persist}>
        <I18n>
          <EgoUIProvider theme={{ primaryColor: 'indigo' }} withGlobalStyles withNormalizeCSS>
            <App />
          </EgoUIProvider>
        </I18n>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
