import { ValueObject } from '@egodb/domain'
import { z } from 'zod'

export const DEFAULT_WIDTH = 200

const hidden = z.boolean().optional()
export const fieldWidthSchema = z.number().positive()

export const viewFieldOption = z.object({
  hidden,
  width: fieldWidthSchema,
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

  public getOption(fieldName: string): IViewFieldOption {
    return this.props.get(fieldName) ?? ViewFieldOptions.DEFAULT_OPTION
  }

  public getOrCreateOption(fieldName: string): IViewFieldOption {
    const option = this.props.get(fieldName)
    if (option) return option

    this.props.set(fieldName, ViewFieldOptions.DEFAULT_OPTION)
    return this.getOption(fieldName)
  }

  public getHidden(fieldName: string): boolean {
    return this.getOption(fieldName).hidden ?? false
  }

  public getWidth(fieldName: string): number {
    return this.getOption(fieldName).width
  }
}
