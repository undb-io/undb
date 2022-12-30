import type { IRootFilter, IViewFieldOption } from '@egodb/core'
import type { ICurrencySymbol } from '@egodb/core/field/currency'

type NumberFieldInMemory = {
  id: string
  type: 'number'
  name: string
  required?: boolean
  currency?: ICurrency
}

interface ICurrency {
  symbol: ICurrencySymbol
}

type StringFieldInMemory = {
  id: string
  type: 'string'
  name: string
  required?: boolean
}

type DateFieldInMemory = {
  id: string
  type: 'date'
  name: string
  required?: boolean
}

type OptionInMemory = {
  id: string
  name: string
}

type SelectFieldInMemory = {
  id: string
  type: 'select'
  name: string
  required?: boolean
  options: OptionInMemory[]
}

export type SchemaInMemory = FieldInMemory[]

export type FieldInMemory = StringFieldInMemory | NumberFieldInMemory | DateFieldInMemory | SelectFieldInMemory

export type ViewInMemory = {
  name: string
  displayType: 'grid' | 'kanban'
  filter?: IRootFilter
  fieldOptions: Record<string, IViewFieldOption>
  fieldsOrder?: string[]
}

export type ViewsInMemory = ViewInMemory[]

export type TableInMemory = {
  id: string
  name: string
  schema: FieldInMemory[]
  views: ViewInMemory[]
}
