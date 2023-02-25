import { optionColorOrder } from '@egodb/core'
import { ActionIcon, IconCircleChevronDown, Popover, SimpleGrid, UnstyledButton } from '@egodb/ui'
import { OptionColor } from '@egodb/core'
import { Option } from '../option/option'
import { useState } from 'react'
import type { OnColorChange } from './type'
import type { IMutateOptionSchema } from '@egodb/core'

export interface IOptionColorPickerProps {
  option: IMutateOptionSchema
  onChange: OnColorChange
}

export const OptionColorPicker: React.FC<IOptionColorPickerProps> = ({ option, onChange }) => {
  const [opened, setOpened] = useState(false)

  return (
    <Popover position="bottom-start" opened={opened} onChange={setOpened}>
      <Popover.Target>
        <ActionIcon
          size="sm"
          variant="filled"
          onClick={() => setOpened(true)}
          color={`${option.color?.name}.${option.color?.shade}`}
        >
          <IconCircleChevronDown size={14} />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown>
        <SimpleGrid cols={2}>
          {optionColorOrder.map((color) => (
            <UnstyledButton
              onClick={() => {
                onChange({ name: color, shade: option.color?.shade ?? OptionColor.defaultShade })
                setOpened(false)
              }}
            >
              <Option
                name={option.name || 'a'}
                colorName={color}
                shade={option.color?.shade ?? OptionColor.defaultShade}
              />
            </UnstyledButton>
          ))}
        </SimpleGrid>
      </Popover.Dropdown>
    </Popover>
  )
}
