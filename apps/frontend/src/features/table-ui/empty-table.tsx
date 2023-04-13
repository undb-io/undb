import { Button, Center, Code, IconPlus, Stack, Text } from '@undb/ui'
import { useSetAtom } from 'jotai'
import { Trans, useTranslation } from 'react-i18next'
import { createRecordFormDrawerOpened } from '../create-record-form/drawer-opened.atom'

export const EmptyTable: React.FC = () => {
  const { t } = useTranslation()
  const setOpened = useSetAtom(createRecordFormDrawerOpened)

  return (
    <Center h="100%">
      <Stack>
        <Center>
          <Text size="lg" fw={600}>
            {t('Create New Record')}
          </Text>
        </Center>
        <Center>
          <Text size="sm" color="gray">
            <Trans
              i18nKey={'shortcut R'}
              t={t}
              values={{ shortcut: 'R' }}
              components={[<Code fz="md" children={null} />]}
            />
          </Text>
        </Center>
        <Button miw={150} onClick={() => setOpened(true)} leftIcon={<IconPlus size={16} />}>
          {t('Create New Table')}
        </Button>
      </Stack>
    </Center>
  )
}
