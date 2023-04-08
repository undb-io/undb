import { optionColorOrder } from '@undb/core'
import { ActionIcon, IconCircleChevronDown, Popover, SimpleGrid, UnstyledButton, useDisclosure } from '@undb/ui'
import { OptionColor } from '@undb/core'
import { Option } from '../option/option'
import type { OnColorChange } from './type'
import type { IMutateOptionSchema } from '@undb/core'

export interface IOptionColorPickerProps {
  option: IMutateOptionSchema
  onChange: OnColorChange
}

export const OptionColorPicker: React.FC<IOptionColorPickerProps> = ({ option, onChange }) => {
  const [opened, handler] = useDisclosure(false)

  return (
    <Popover withinPortal position="bottom-start" opened={opened} onChange={handler.toggle}>
      <Popover.Target>
        <ActionIcon
          size="sm"
          variant="filled"
          onClick={handler.toggle}
          color={`${option.color?.name}.${option.color?.shade}`}
        >
          <IconCircleChevronDown size={14} />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown>
        <SimpleGrid cols={2}>
          {optionColorOrder.map((color) => (
            <UnstyledButton
              key={color}
              onClick={() => {
                onChange({ name: color, shade: option.color?.shade ?? OptionColor.defaultShade })
                handler.close()
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
