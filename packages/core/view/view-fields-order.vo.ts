import { ValueObject } from '@egodb/domain'

export class ViewFieldsOrder extends ValueObject<string[]> {
  public get order() {
    return this.props
  }

  static fromArray(ids: string[]): ViewFieldsOrder {
    return new this(ids)
  }

  public swap(from: string, to: string): ViewFieldsOrder {
    const copied = [...this.order]
    const fromIndex = copied.findIndex((v) => v === from)
    const toIndex = copied.findIndex((v) => v === to)

    ;[copied[toIndex], copied[fromIndex]] = [copied[fromIndex], copied[toIndex]]
    return ViewFieldsOrder.fromArray(copied)
  }
}
