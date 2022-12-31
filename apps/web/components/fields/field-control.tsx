import type { ICreateOptionSchema } from '@egodb/core'
import { OptionId } from '@egodb/core'
import {
  useListState,
  Stack,
  Group,
  ActionIcon,
  IconGripVertical,
  TextInput,
  Button,
  IconSelect,
  FocusTrap,
} from '@egodb/ui'
import useDeepCompareEffect from 'use-deep-compare-effect'

interface ISelectFieldControlProps {
  onChange: (options: ICreateOptionSchema[]) => void
}

export const SelectFieldControl: React.FC<ISelectFieldControlProps> = ({ onChange }) => {
  const [options, handlers] = useListState<ICreateOptionSchema>()
  useDeepCompareEffect(() => {
    onChange(options)
  }, [options])

  return (
    <>
      <Stack spacing={0}>
        {options.map((o, index) => (
          <Group key={o.id} spacing="xs">
            <ActionIcon>
              <IconGripVertical size={14} color="gray" />
            </ActionIcon>
            <FocusTrap>
              <TextInput
                variant="unstyled"
                value={o.name}
                onChange={(e) => handlers.setItemProp(index, 'name', e.target.value)}
              />
            </FocusTrap>
          </Group>
        ))}
        <Button
          leftIcon={<IconSelect size={14} />}
          size="xs"
          variant="subtle"
          onClick={() => handlers.append({ id: OptionId.create().value, name: '' })}
        >
          Add new option
        </Button>
      </Stack>
    </>
  )
}
