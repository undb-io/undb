import { ValueObject } from '@egodb/domain'
import arrayMove from 'array-move'
import { Option as O } from 'oxide.ts'
import { Option } from './option'
import { OptionColor } from './option-color'
import type { OptionId } from './option-id.vo'
import type { ICreateOptionSchema, ICreateOptionsSchema } from './option.schema'
import { createOptionsSchema } from './option.schema'

export class Options extends ValueObject<Option[]> {
  public get options(): Option[] {
    return this.props
  }

  public get lastOption(): O<Option> {
    return O(this.options[this.options.length - 1])
  }

  public remove(id: OptionId): Options {
    return new Options(this.options.filter((option) => !option.id.equals(id)))
  }

  public get ids() {
    return this.options.map((o) => o.id.value)
  }

  public reorder(from: string, to: string): Options {
    const formIndex = this.options.findIndex((o) => o.id.value === from)
    const toIndex = this.options.findIndex((o) => o.id.value === to)
    const moved = arrayMove(this.options, formIndex, toIndex)
    return new Options(moved)
  }

  public createOption(input: ICreateOptionSchema): Option {
    return Option.create(input)
  }

  public getById(id: string): O<Option> {
    return O(this.options.find((o) => o.id.value === id))
  }

  static create(inputs: ICreateOptionsSchema) {
    inputs = createOptionsSchema.parse(inputs)

    const colors = OptionColor.createColors(inputs.map((i) => i.color))
    const options = inputs.map((input, index) => Option.create({ ...input, color: colors[index] }))

    return new this(options)
  }

  static unsafeCreate(inputs: ICreateOptionsSchema) {
    const options = inputs.map((i) => Option.unsafeCrete(i))
    return new this(options)
  }
}
