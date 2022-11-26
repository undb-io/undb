import type { Column } from './column'
import type { ICreateColumnSchema } from './create-column-schema'
import { NumberColumn } from './number.column'
import { TextColumn } from './text.column'

export class ColumnFactory {
  static create(input: ICreateColumnSchema): Column {
    switch (input.type) {
      case 'text': {
        return new TextColumn(input)
      }
      case 'number': {
        return new NumberColumn(input)
      }

      default:
        throw new Error('invalid text column type')
    }
  }
}
