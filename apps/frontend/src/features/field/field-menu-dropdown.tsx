import type { Field } from '@undb/core'
import {
  useDeleteFieldMutation,
  useResetFieldSortMutation,
  useSetFieldSortMutation,
  useSetVisibilityMutation,
} from '@undb/store'
import { IconPinnedOff } from '@undb/ui'
import { IconPinned } from '@undb/ui'
import { IconRowInsertBottom, IconRowInsertTop } from '@undb/ui'
import { IconColumnInsertRight } from '@undb/ui'
import { IconColumnInsertLeft } from '@undb/ui'
import { IconSortAscending } from '@undb/ui'
import { IconSortDescending } from '@undb/ui'
import { IconEyeOff } from '@undb/ui'
import { Portal } from '@undb/ui'
import { openContextModal } from '@undb/ui'
import { IconPencil, IconTrash, Menu } from '@undb/ui'
import { useTranslation } from 'react-i18next'
import { confirmModal } from '../../hooks'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { CREATE_FIELD_MODAL_ID, UPDATE_FIELD_MODAL_ID } from '../../modals'
import { FieldMenuItemVariant } from './field-menu-item-variants'
import { useMenuStyle } from './menu-item'

interface IProps {
  field: Field
  orientation: 'vertial' | 'horizontal'
  index: number
  pinned?: boolean
  pinLeft?: () => void
}

export const FieldMenuDropdown: React.FC<IProps> = ({ field, orientation, index, pinned, pinLeft }) => {
  const table = useCurrentTable()
  const view = useCurrentView()
  const direction = view.getFieldSort(field.id.value).into()
  const [deleteField] = useDeleteFieldMutation()

  const [setVisibility] = useSetVisibilityMutation()
  const [setFieldSort] = useSetFieldSortMutation()
  const [resetFieldSort] = useResetFieldSortMutation()

  const confirm = confirmModal({
    onConfirm() {
      deleteField({
        tableId: table.id.value,
        id: field.id.value,
      })
    },
  })

  const { t } = useTranslation()

  const insertAt = (at: number) => () =>
    openContextModal({
      title: t('Create New Field'),
      modal: CREATE_FIELD_MODAL_ID,
      innerProps: { at: Math.max(0, at) },
    })

  const fieldMenu = <FieldMenuItemVariant field={field} />

  const { classes } = useMenuStyle({})

  return (
    <Portal>
      <Menu.Dropdown>
        <Menu.Item
          icon={<IconPencil size={14} />}
          className={classes.menu}
          onClick={() =>
            openContextModal({
              title: t('Update Field'),
              modal: UPDATE_FIELD_MODAL_ID,
              innerProps: { field },
            })
          }
        >
          {t('Update Field')}
        </Menu.Item>

        {/* <Menu.Divider /> */}

        {fieldMenu ? (
          <>
            {fieldMenu}
            <Menu.Divider />
          </>
        ) : null}

        {orientation === 'vertial' ? (
          <>
            <Menu.Item className={classes.menu} onClick={insertAt(index - 1)} icon={<IconRowInsertTop size={14} />}>
              {t('Insert Field Before')}
            </Menu.Item>
            <Menu.Item className={classes.menu} onClick={insertAt(index + 1)} icon={<IconRowInsertBottom size={14} />}>
              {t('Insert Field After')}
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item className={classes.menu} onClick={insertAt(index - 1)} icon={<IconColumnInsertLeft size={14} />}>
              {t('Insert Field Left')}
            </Menu.Item>
            <Menu.Item
              className={classes.menu}
              onClick={insertAt(index + 1)}
              icon={<IconColumnInsertRight size={14} />}
            >
              {t('Insert Field Right')}{' '}
            </Menu.Item>
          </>
        )}

        {pinLeft && (
          <Menu.Item
            className={classes.menu}
            onClick={pinLeft}
            icon={pinned ? <IconPinnedOff size={14} /> : <IconPinned size={14} />}
            sx={(theme) => ({
              backgroundColor: pinned ? theme.colors.gray[0] : 'inherit',
            })}
          >
            {pinned ? t('Unset Pin Field') : t('Pin Field')}
          </Menu.Item>
        )}

        <Menu.Divider />

        {field.sortable && (
          <>
            <Menu.Item
              icon={<IconSortAscending size={14} />}
              className={classes.menu}
              sx={(theme) => ({ backgroundColor: direction === 'asc' ? theme.colors.gray[0] : 'inherit' })}
              onClick={() => {
                if (direction === 'asc') {
                  resetFieldSort({
                    tableId: table.id.value,
                    viewId: view.id.value,
                    fieldId: field.id.value,
                  })
                } else {
                  setFieldSort({
                    tableId: table.id.value,
                    viewId: view.id.value,
                    fieldId: field.id.value,
                    direction: 'asc',
                  })
                }
              }}
            >
              {direction === 'asc' ? t('Delete Sort Ascending') : t('Sort Ascending')}
            </Menu.Item>
            <Menu.Item
              icon={<IconSortDescending size={14} />}
              className={classes.menu}
              sx={(theme) => ({ backgroundColor: direction === 'desc' ? theme.colors.gray[0] : 'inherit' })}
              onClick={() => {
                if (direction === 'desc') {
                  resetFieldSort({
                    tableId: table.id.value,
                    viewId: view.id.value,
                    fieldId: field.id.value,
                  })
                } else {
                  setFieldSort({
                    tableId: table.id.value,
                    viewId: view.id.value,
                    fieldId: field.id.value,
                    direction: 'desc',
                  })
                }
              }}
            >
              {direction === 'desc' ? t('Delete Sort Desending') : t('Sort Desending')}
            </Menu.Item>
          </>
        )}

        <Menu.Item
          icon={<IconEyeOff size={14} />}
          className={classes.menu}
          onClick={() =>
            setVisibility({ tableId: table.id.value, viewId: view.id.value, fieldId: field.id.value, hidden: true })
          }
        >
          {t('Hide Field')}
        </Menu.Item>

        {!field.system && (
          <Menu.Item icon={<IconTrash size={14} />} className={classes.menu} color="red" onClick={confirm}>
            {t('Delete Field')}
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Portal>
  )
}
