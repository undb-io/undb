import type { ICreateOptionSchema } from '@egodb/core'
import { OptionId } from '@egodb/core/option/option-id.vo'
import { ActionIcon, Button, Group, IconGripVertical, Stack, TextInput, useListState } from '@egodb/ui'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { useCreateTableFormContext } from '../create-table-form-context'

interface IProps {
  index: number
}

interface ISelectFieldControlProps {
  onChange: (options: ICreateOptionSchema[]) => void
}

const SelectFieldControl: React.FC<ISelectFieldControlProps> = ({ onChange }) => {
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
            <TextInput
              variant="unstyled"
              value={o.name}
              onChange={(e) => handlers.setItemProp(index, 'name', e.target.value)}
            />
          </Group>
        ))}
      </Stack>
      <Button compact variant="outline" onClick={() => handlers.append({ id: OptionId.create().value, name: '' })}>
        Add new option
      </Button>
    </>
  )
}

export const FieldVariantControl: React.FC<IProps> = ({ index }) => {
  const form = useCreateTableFormContext()
  const field = form.values.schema[index]

  if (field.type === 'select') {
    return <SelectFieldControl onChange={(options) => form.setFieldValue(`schema.${index}.options`, options)} />
  }

  return null
}
