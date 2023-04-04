import { useContext } from 'react'
import { CurrentViewContext } from '../context/current-view'

export const useCurrentView = () => {
  const view = useContext(CurrentViewContext)

  if (!view) {
    throw new Error('no current view')
  }

  return view
}
