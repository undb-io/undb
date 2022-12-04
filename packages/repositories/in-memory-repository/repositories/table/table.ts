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

export type TableInMemory = {
  id: string
  name: string
  schema: FieldInMemory[]
}
