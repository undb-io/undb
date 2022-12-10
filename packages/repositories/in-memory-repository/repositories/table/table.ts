import type { IFilters } from '@egodb/core'

type NumberFieldInMemory = {
  id: string
  type: 'text'
  name: string
}

type TextFieldInMemory = {
  id: string
  type: 'number'
  name: string
}

type FieldInMemory = TextFieldInMemory | NumberFieldInMemory

type ViewInMemory = {
  name: string
  displayType: 'grid' | 'kanban'
  filters?: IFilters
}

export type TableInMemory = {
  id: string
  name: string
  schema: FieldInMemory[]
  views: ViewInMemory[]
}
