import { createContext, useContext } from 'react'
import type { IProps } from './interface'

export const EgoTableContext = createContext<IProps>({
  table: null,
  records: [],
})

export const useEgoTableContext = () => useContext(EgoTableContext)
