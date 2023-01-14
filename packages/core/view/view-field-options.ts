import { ValueObject } from '@egodb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { z } from 'zod'
import type { Field } from '../field'

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

  public getOption(fieldKey: string): IViewFieldOption {
    return this.props.get(fieldKey) ?? ViewFieldOptions.DEFAULT_OPTION
  }

  public getOrCreateOption(fieldKey: string): IViewFieldOption {
    const option = this.props.get(fieldKey)
    if (option) return option

    this.props.set(fieldKey, ViewFieldOptions.DEFAULT_OPTION)
    return this.getOption(fieldKey)
  }

  public getHidden(fieldKey: string): boolean {
    return this.getOption(fieldKey).hidden ?? false
  }

  public getWidth(fieldKey: string): number {
    return this.getOption(fieldKey).width ?? DEFAULT_WIDTH
  }

  public toObject(): Option<Record<string, IViewFieldOption>> {
    if (!this.value.size) return None
    const obj = Object.fromEntries(this.value)
    return Some(obj)
  }

  public removeField(field: Field): Option<ViewFieldOptions> {
    if (this.value.has(field.id.value)) {
      const options = new ViewFieldOptions(new Map([...this.value.entries()].filter(([k]) => k !== field.id.value)))

      return Some(options)
    }
    return None
  }
}
