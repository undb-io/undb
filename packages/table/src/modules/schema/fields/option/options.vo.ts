import { ValueObject } from "@undb/domain"
import { ColorsVO } from "../../../colors"
import { OptionIdVo } from "./option-id.vo"
import { Option, type IOption } from "./option.vo"

export class Options extends ValueObject<Option[]> {
  static fromArray(options: IOption[]): Options {
    return new Options(options.map((o) => new Option(o)))
  }

  static fromStrings(strings: string[]): Options {
    if (strings.length === 0) {
      return new Options([])
    }
    const color = new ColorsVO()
    return new Options(
      strings.map(
        (name, i) =>
          new Option({
            id: OptionIdVo.create().value,
            name,
            color: i == 0 ? "red" : color.next(),
          }),
      ),
    )
  }

  toJSON() {
    return this.props.map((o) => o.toJSON())
  }
}
