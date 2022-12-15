import type { IRootFilter } from '@egodb/core'
import type { ICurrencySymbol } from '@egodb/core/field/currency'

type NumberFieldInMemory = {
  id: string
  type: 'text'
  name: string
}

interface ICurrency {
  symbol: ICurrencySymbol
}

type TextFieldInMemory = {
  id: string
  type: 'number'
  name: string
  currency?: ICurrency
}

type DateFieldInMemory = {
  id: string
  type: 'date'
  name: string
}

type FieldInMemory = TextFieldInMemory | NumberFieldInMemory | DateFieldInMemory

type ViewInMemory = {
  name: string
  displayType: 'grid' | 'kanban'
  filter?: IRootFilter
}

export type TableInMemory = {
  id: string
  name: string
  schema: FieldInMemory[]
  views: ViewInMemory[]
}
