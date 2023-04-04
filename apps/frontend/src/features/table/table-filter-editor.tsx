import type { IFilter } from '@egodb/core'
import { useSetFilterMutation } from '@egodb/store'
import { Button, IconFilter, Popover, useDisclosure, Badge } from '@egodb/ui'
import { useTranslation } from 'react-i18next'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { FiltersEditor } from '../filters-editor/filters-editor'

export const TableFilterEditor: React.FC = () => {
  const table = useCurrentTable()
  const view = useCurrentView()
  const filters = view.filterList as IFilter[]
  const hasFilter = !!filters.length
  const [opened, handler] = useDisclosure(false)
  const { t } = useTranslation()

  const [setFilter, { isLoading }] = useSetFilterMutation()

  return (
    <Popover
      position="bottom-start"
      opened={opened}
      onChange={handler.toggle}
      closeOnEscape
      closeOnClickOutside
      shadow="md"
    >
      <Popover.Target>
        <Button
          compact
          size="xs"
          variant={hasFilter ? 'light' : 'subtle'}
          loading={isLoading}
          leftIcon={<IconFilter size={18} />}
          onClick={handler.toggle}
          rightIcon={
            hasFilter ? (
              <Badge variant="filled" size="xs">
                {filters.length}
              </Badge>
            ) : null
          }
          sx={(theme) => ({
            backgroundColor: opened || hasFilter ? theme.colors[theme.primaryColor][0] : 'initial',
          })}
        >
          {t('Filter')}
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <FiltersEditor
          onApply={(filter) => {
            setFilter({ tableId: table.id.value, viewId: view.id.value, filter }).then(() => handler.close())
          }}
          onCancel={handler.close}
        />
      </Popover.Dropdown>
    </Popover>
  )
}
