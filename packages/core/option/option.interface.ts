import type { OptionColor } from './option-color'
import type { OptionKey } from './option-key.vo'
import type { OptionName } from './option-name.vo'

export interface IOption {
  key: OptionKey
  name: OptionName
  color: OptionColor
}
