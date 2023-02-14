import { useContext } from 'react'
import { CurrentTableContext } from '../context/current-table'

export const useCurrentTable = () => {
  const table = useContext(CurrentTableContext)

  if (!table) {
    throw new Error('no current table')
  }

  return table
}
