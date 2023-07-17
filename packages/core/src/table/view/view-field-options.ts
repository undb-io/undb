import { ValueObject } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { z } from 'zod'
import type { FieldId } from '../field/index.js'

export const DEFAULT_WIDTH = 200

export const fieldHiddenSchema = z.boolean().optional()
export const fieldWidthSchema = z.number().positive()

export const viewFieldOption = z.object({
  hidden: fieldHiddenSchema,
  width: fieldWidthSchema.optional(),
})

export type IViewFieldOption = z.infer<typeof viewFieldOption>

export class ViewFieldOptions extends ValueObject<Map<string, IViewFieldOption>> {
  public static readonly DEFAULT_OPTION: IViewFieldOption = {
    hidden: false,
    width: DEFAULT_WIDTH,
  }

  static default() {
    return new this(new Map())
  }

  static from(input?: Record<string, IViewFieldOption>) {
    return input ? new this(new Map(Object.entries(input))) : this.default()
  }

  public get value() {
    return this.props
  }

  public get hiddenCount(): number {
    return [...this.value.values()].filter((v) => v.hidden).length
  }

  public getOption(fieldId: string): IViewFieldOption {
    return this.props.get(fieldId) ?? ViewFieldOptions.DEFAULT_OPTION
  }

  public getOrCreateOption(fieldId: string): IViewFieldOption {
    const option = this.props.get(fieldId)
    if (option) return option

    this.props.set(fieldId, ViewFieldOptions.DEFAULT_OPTION)
    return this.getOption(fieldId)
  }

  public getHidden(fieldId: string): boolean {
    return this.getOption(fieldId).hidden ?? false
  }

  public getWidth(fieldId: string): number {
    return this.getOption(fieldId).width ?? DEFAULT_WIDTH
  }

  public toObject(): Option<Record<string, IViewFieldOption>> {
    if (!this.value.size) return None
    const obj = Object.fromEntries(this.value)
    return Some(obj)
  }

  *[Symbol.iterator]() {
    yield* this.value
  }

  public toJSON() {
    return Object.fromEntries(this.value)
  }

  public removeField(fieldId: FieldId): Option<ViewFieldOptions> {
    if (this.value.has(fieldId.value)) {
      const options = new ViewFieldOptions(new Map([...this.value.entries()].filter(([k]) => k !== fieldId.value)))

      return Some(options)
    }
    return None
  }
}
