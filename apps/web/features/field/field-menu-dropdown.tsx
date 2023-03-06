import type { Field } from '@egodb/core'
import {
  useDeleteFieldMutation,
  useResetFieldSortMutation,
  useSetFieldSortMutation,
  useSetVisibilityMutation,
} from '@egodb/store'
import type { MenuItemProps } from '@egodb/ui'
import { IconRowInsertBottom, IconRowInsertTop } from '@egodb/ui'
import { IconColumnInsertRight } from '@egodb/ui'
import { IconColumnInsertLeft } from '@egodb/ui'
import { IconSortAscending } from '@egodb/ui'
import { IconSortDescending } from '@egodb/ui'
import { IconEyeOff } from '@egodb/ui'
import { Portal } from '@egodb/ui'
import { openContextModal } from '@egodb/ui'
import { IconPencil, IconTrash, Menu } from '@egodb/ui'
import { useTranslation } from 'react-i18next'
import { useConfirmModal } from '../../hooks'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { CREATE_FIELD_MODAL_ID, UPDATE_FIELD_MODAL_ID } from '../../modals'

interface IProps {
  field: Field
  orientation: 'vertial' | 'horizontal'
  index: number
}

export const FieldMenuDropdown: React.FC<IProps> = ({ field, orientation, index }) => {
  const table = useCurrentTable()
  const view = useCurrentView()
  const direction = view.getFieldSort(field.id.value).into()
  const [deleteField] = useDeleteFieldMutation()

  const [setVisibility] = useSetVisibilityMutation()
  const [setFieldSort] = useSetFieldSortMutation()
  const [resetFieldSort] = useResetFieldSortMutation()

  const confirm = useConfirmModal({
    onConfirm() {
      deleteField({
        tableId: table.id.value,
        id: field.id.value,
      })
    },
  })

  const menuProps: MenuItemProps = {
    p: 'xs',
    h: 35,
    fz: 'xs',
  }

  const { t } = useTranslation()

  const insertAt = (at: number) => () =>
    openContextModal({
      title: t('Create New Field'),
      modal: CREATE_FIELD_MODAL_ID,
      innerProps: { at: Math.max(0, at) },
    })

  return (
    <Portal>
      <Menu.Dropdown>
        <Menu.Item
          icon={<IconPencil size={14} />}
          {...menuProps}
          onClick={() =>
            openContextModal({
              title: 'Update Field',
              modal: UPDATE_FIELD_MODAL_ID,
              innerProps: { field },
            })
          }
        >
          Update Field
        </Menu.Item>

        <Menu.Divider />

        {orientation === 'vertial' ? (
          <>
            <Menu.Item onClick={insertAt(index - 1)} icon={<IconRowInsertTop size={14} />}>
              Insert Before
            </Menu.Item>
            <Menu.Item onClick={insertAt(index + 1)} icon={<IconRowInsertBottom size={14} />}>
              Insert After
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item onClick={insertAt(index - 1)} icon={<IconColumnInsertLeft size={14} />}>
              Insert Left
            </Menu.Item>
            <Menu.Item onClick={insertAt(index + 1)} icon={<IconColumnInsertRight size={14} />}>
              Insert Right
            </Menu.Item>
          </>
        )}

        <Menu.Divider />

        <Menu.Item
          icon={<IconSortDescending size={14} />}
          {...menuProps}
          sx={(theme) => ({ backgroundColor: direction === 'desc' ? theme.colors.gray[2] : 'inherit' })}
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
          {direction === 'desc' ? 'Remove sort: Descending' : 'Sort: Descending'}
        </Menu.Item>
        <Menu.Item
          icon={<IconSortAscending size={14} />}
          {...menuProps}
          sx={(theme) => ({ backgroundColor: direction === 'asc' ? theme.colors.gray[2] : 'inherit' })}
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
          {direction === 'asc' ? 'Remove sort: Ascending' : 'Sort: Ascending'}
        </Menu.Item>

        <Menu.Item
          icon={<IconEyeOff size={14} />}
          {...menuProps}
          onClick={() =>
            setVisibility({ tableId: table.id.value, viewId: view.id.value, fieldId: field.id.value, hidden: true })
          }
        >
          Hide Field
        </Menu.Item>

        {!field.system && (
          <Menu.Item icon={<IconTrash size={14} />} {...menuProps} color="red" onClick={confirm}>
            Delete Field
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Portal>
  )
}
