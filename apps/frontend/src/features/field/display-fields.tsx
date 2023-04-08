import { Group, Badge, Text } from '@undb/ui'
import { useTranslation } from 'react-i18next'

export const DisplayFields: React.FC<{ displayFields: { name: string }[] }> = ({ displayFields }) => {
  const { t } = useTranslation()
  return (
    <Group>
      <Text size="xs" fs="xs" color="gray">{`${t('Display', { ns: 'common' })}: `}</Text>
      <Group spacing="xs">
        {displayFields.map((f, index) => (
          <Badge sx={{ textTransform: 'unset' }} key={index}>
            {f.name || `${t('Field')} ${index + 1}`}
          </Badge>
        ))}
      </Group>
    </Group>
  )
}
