import { useEgoUITheme } from '@egodb/ui'
import { useMemo } from 'react'

export const useColors = () => {
  const theme = useEgoUITheme()

  return useMemo(() => Object.values(theme.colors).flatMap((color) => color), [])
}
