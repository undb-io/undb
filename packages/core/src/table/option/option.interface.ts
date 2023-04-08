import type { OptionColor } from './option-color.js'
import type { OptionKey } from './option-key.vo.js'
import type { OptionName } from './option-name.vo.js'

export interface IOption {
  key: OptionKey
  name: OptionName
  color: OptionColor
}
