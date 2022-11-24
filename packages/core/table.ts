import { TableName } from './value-objects/table-name.vo'

export class Table {
  readonly id!: string
  public name!: TableName

  private constructor(name: TableName) {
    this.id = 'hello'
    this.name = name
  }

  static create(name: string): Table {
    return new Table(new TableName(name))
  }
}
