import type { RecordAllValues } from '@egodb/core'
import { Tooltip, Group, Text } from '@egodb/ui'
import { FieldIcon } from '../field-inputs/field-Icon'
import { FieldValueFactory } from '../field-value/field-value.factory'
import { useCurrentTable } from '../../hooks/use-current-table'

export const RecordValues: React.FC<{ values: RecordAllValues }> = ({ values }) => {
  const table = useCurrentTable()
  const schema = table.schema.toIdMap()

  return (
    <>
      {Object.entries(values).map(([fieldId, value]) => {
        const field = schema.get(fieldId)
        if (!field) return null

        return (
          <Tooltip
            key={fieldId}
            label={
              <Group spacing="xs">
                <FieldIcon type={field.type} />
                <Text>{field.name.value}</Text>
              </Group>
            }
          >
            <Group spacing="xs" data-field-id={field.id.value} noWrap>
              <FieldIcon color="gray" type={field.type} />
              <FieldValueFactory field={field} value={value} displayValues={values.display_values} />
            </Group>
          </Tooltip>
        )
      })}
    </>
  )
}
