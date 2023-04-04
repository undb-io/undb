import { createStore, PersistGate } from '@egodb/store'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { EgoUIProvider } from '@egodb/ui'
import { I18n } from './i18n/i18n'

function App() {
  const { store, persist } = createStore()

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persist}>
        <I18n>
          <EgoUIProvider theme={{ primaryColor: 'indigo' }} withGlobalStyles withNormalizeCSS>
            <RouterProvider router={router} />
          </EgoUIProvider>
        </I18n>
      </PersistGate>
    </Provider>
  )
}

export default App
