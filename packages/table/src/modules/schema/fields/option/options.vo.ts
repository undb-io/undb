import { ValueObject } from "@undb/domain"
import { Option, type IOption } from "./option.vo"

export class Options extends ValueObject<Option[]> {
  static fromArray(options: IOption[]): Options {
    return new Options(options.map((o) => new Option(o)))
  }

  toJSON() {
    return this.props.map((o) => o.toJSON())
  }
}
