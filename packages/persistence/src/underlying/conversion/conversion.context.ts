import type { Field } from "@undb/table"
import type { IConversionStrategy } from "./conversion.interface"

export class ConversionContext {
  constructor(private readonly strategy: IConversionStrategy) {}

  convert(field: Field) {
    return this.strategy.convert(field)
  }
}
