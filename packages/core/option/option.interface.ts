import type { OptionColor } from './option-color'
import type { OptionId } from './option-id.vo'
import type { OptionName } from './option-name.vo'

export interface IOption {
  id: OptionId
  name: OptionName
  color: OptionColor
}
