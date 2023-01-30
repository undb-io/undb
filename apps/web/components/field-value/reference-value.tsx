import { Badge } from '@egodb/ui'

export const ReferenceValue: React.FC<{ value: string | undefined }> = ({ value }) => {
  if (!value) return null

  return (
    <Badge color="gray" size="xs" sx={{ textTransform: 'unset' }}>
      {value}
    </Badge>
  )
}
