import type { ICreateColumnSchema } from './column.schema'
import type { Column } from './column.type'
import { NumberColumn } from './number.column'
import { TextColumn } from './text.column'

export class ColumnFactory {
  static create(input: ICreateColumnSchema): Column {
    switch (input.type) {
      case 'text': {
        return TextColumn.create(input)
      }
      case 'number': {
        return NumberColumn.create(input)
      }

      default:
        throw new Error('invalid text column type')
    }
  }

  static unsafeCreate(input: ICreateColumnSchema): Column {
    switch (input.type) {
      case 'text': {
        return TextColumn.unsafeCreate(input)
      }
      case 'number': {
        return NumberColumn.unsafeCreate(input)
      }

      default:
        throw new Error('invalid text column type')
    }
  }
}
