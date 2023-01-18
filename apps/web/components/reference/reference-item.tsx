import { Badge } from '@egodb/ui'

export const ReferenceItem: React.FC<{ value: string }> = ({ value }) => {
  return (
    <Badge color="gray" size="xs" sx={{ textTransform: 'unset' }}>
      {value}
    </Badge>
  )
}
