import { ValueObject } from '@undb/domain'
import type { ZodArray, ZodString } from 'zod'
import { z } from 'zod'

export type PinnedPosition = 'left' | 'right'

export const viewPinnedFields = z.object<{ [key in PinnedPosition]: ZodArray<ZodString> }>({
  left: z.string().array(),
  right: z.string().array(),
})

export type IViewPinnedFields = z.infer<typeof viewPinnedFields>

export class ViewPinnedFields extends ValueObject<IViewPinnedFields> {
  public get left() {
    return this.props.left
  }

  public get right() {
    return this.props.right
  }

  public getPinnedPosition(fieldId: string): PinnedPosition | undefined {
    if (this.left.find((id) => id === fieldId)) return 'left'
    if (this.right.find((id) => id === fieldId)) return 'right'
  }

  public toJSON() {
    return {
      left: this.left,
      right: this.right,
    }
  }
}
