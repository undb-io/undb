import { ValueObject } from "@undb/domain"
import { series } from "radash"
import { COLORS, type IColors } from "./colors"

export class ColorsVO extends ValueObject<ReturnType<typeof series<string>>> {
  constructor() {
    super(series(COLORS as string[]))
  }

  next(color: IColors = "red") {
    return this.value.next(color)
  }
}
