type NumberColumnInMemory = {
  name: string
}

type TextColumnInMemory = {
  name: string
}

type ColumnInMemory = TextColumnInMemory | NumberColumnInMemory

export type TableInMemory = {
  id: string
  name: string
  columns: ColumnInMemory[]
}
