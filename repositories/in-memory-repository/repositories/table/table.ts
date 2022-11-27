type NumberColumnInMemory = {
  type: 'text'
  name: string
}

type TextColumnInMemory = {
  type: 'number'
  name: string
}

type ColumnInMemory = TextColumnInMemory | NumberColumnInMemory

export type TableInMemory = {
  id: string
  name: string
  columns: ColumnInMemory[]
}
