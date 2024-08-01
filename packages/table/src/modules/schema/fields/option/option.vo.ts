import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { colors } from "../../../colors"
import { optionId } from "./option-id.vo"

export const optionName = z.string().min(1)

export type IOptionName = z.infer<typeof optionName>

export const option = z.object({
  id: optionId,
  name: optionName,
  color: colors,
})

export type IOption = z.infer<typeof option>

export class Option extends ValueObject<IOption> {
  toJSON() {
    return {
      id: this.value.id,
      name: this.value.name,
      color: this.value.color,
    }
  }
}
