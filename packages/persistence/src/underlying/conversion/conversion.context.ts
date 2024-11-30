import type { Field } from "@undb/table"
import type { UnderlyingConversionStrategy } from "./conversion.interface"

export class ConversionContext {
  constructor(private readonly strategy: UnderlyingConversionStrategy) {}

  convert(field: Field, previousField: Field) {
    this.strategy.convert(field, previousField)
    return this.strategy.getSql()
  }
}
