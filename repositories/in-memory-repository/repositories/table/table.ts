type NumberColumnInMemory = {
  id: string
  type: 'text'
  name: string
}

type TextColumnInMemory = {
  id: string
  type: 'number'
  name: string
}

type ColumnInMemory = TextColumnInMemory | NumberColumnInMemory

export type TableInMemory = {
  id: string
  name: string
  columns: ColumnInMemory[]
}
