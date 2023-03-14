import { Button, IconMenu2, Tooltip } from '@egodb/ui'
import { useAtom } from 'jotai'
import { unstable_batchedUpdates } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useCloseAllDrawers } from '../../hooks/use-close-all-drawers'
import { useCurrentTable } from '../../hooks/use-current-table'
import { viewsOpenedAtom } from '../views/views-opened.atom'

export const ViewsButton: React.FC = () => {
  const [opened, setOpened] = useAtom(viewsOpenedAtom)
  const close = useCloseAllDrawers()
  const table = useCurrentTable()
  const { t } = useTranslation()

  const viewsCount = table.views.count

  return (
    <Tooltip label={viewsCount > 1 ? `${viewsCount} views` : `${viewsCount} view`}>
      <Button
        compact
        size="xs"
        leftIcon={<IconMenu2 size={14} />}
        variant="subtle"
        onClick={() => {
          unstable_batchedUpdates(() => {
            close()
            setOpened(true)
          })
        }}
        sx={(theme) => ({
          backgroundColor: opened ? theme.colors[theme.primaryColor][0] : 'initial',
        })}
      >
        {t('Views')}
      </Button>
    </Tooltip>
  )
}
