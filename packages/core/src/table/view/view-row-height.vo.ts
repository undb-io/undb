import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const viewRowHeightSchema = z.enum(['short', 'medium', 'tall'])
export type IViewRowHeight = z.infer<typeof viewRowHeightSchema>

export const viewRowHeights: IViewRowHeight[] = ['short', 'medium', 'tall']

export class ViewRowHeight extends ValueObject<IViewRowHeight> {
  static from(rowHeight: IViewRowHeight) {
    return new this({ value: rowHeight })
  }
}
