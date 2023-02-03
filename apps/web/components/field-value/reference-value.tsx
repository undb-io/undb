import { Badge, Group } from '@egodb/ui'

export const ReferenceValue: React.FC<{ values?: (string | undefined | null)[] }> = ({ values }) => {
  const visibleValues = values?.filter(Boolean)
  if (!visibleValues?.length) return null

  return (
    <Group spacing="xs">
      {visibleValues.map((value) => (
        <Badge key={value} color="gray" size="xs" sx={{ textTransform: 'unset' }}>
          {value}
        </Badge>
      ))}
    </Group>
  )
}
