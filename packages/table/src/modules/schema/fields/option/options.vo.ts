import { Option as O, ValueObject } from "@undb/domain"
import { getNextName } from "@undb/utils"
import { COLORS, ColorsVO } from "../../../colors"
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
    return new Options(
      strings.map((name, i) => {
        return new Option({
          id: OptionIdVo.create().value,
          name: getNextName(strings.slice(0, i), name),
          color: COLORS[i % COLORS.length],
        })
      }),
    )
  }

  static getDeletedOptions(prev: IOption[], newOptions: IOption[]) {
    const prevIds = prev.map((o) => o.id)
    const newIds = newOptions.map((o) => o.id)
    return prevIds.filter((id) => !newIds.includes(id))
  }

  getOptionById(id: string) {
    return O(this.props.find((o) => o.value.id === id))
  }

  toJSON() {
    return this.props.map((o) => o.toJSON())
  }

  getNextColor() {
    return new ColorsVO().next(this.props[this.props.length - 1]?.value.color)
  }
}
