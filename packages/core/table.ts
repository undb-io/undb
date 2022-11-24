import { TableName } from './value-objects/table-name.vo'

export class Table {
  readonly id!: string
  public name!: TableName

  private constructor(name: TableName) {
    this.id = 'hello'
    this.name = name
  }

  static create(name: TableName): Table {
    return new Table(name)
  }
}
