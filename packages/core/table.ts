import { TableId } from './value-objects'
import { TableName } from './value-objects/table-name.vo'

export class Table {
  public id: TableId
  public name: TableName

  private constructor(name: TableName) {
    this.id = new TableId()
    this.name = name
  }

  static create(name: string): Table {
    return new Table(new TableName(name))
  }
}
