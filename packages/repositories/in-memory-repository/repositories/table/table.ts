import type { IRootFilter } from '@egodb/core'

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
  filter?: IRootFilter
}

export type TableInMemory = {
  id: string
  name: string
  schema: FieldInMemory[]
  views: ViewInMemory[]
}
