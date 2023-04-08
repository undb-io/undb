import { Badge } from '@undb/ui'

export const RecordValue: React.FC<{ value: string }> = ({ value }) => {
  return (
    <Badge color="gray.6" radius="xl" sx={{ textTransform: 'unset' }}>
      {value}
    </Badge>
  )
}
