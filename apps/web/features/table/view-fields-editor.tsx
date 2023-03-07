import { closestCenter, DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Field } from '@egodb/core'
import { useMoveFieldMutation, useSetShowSystemFieldsMutation, useSetVisibilityMutation } from '@egodb/store'
import type { CheckboxProps } from '@egodb/ui'
import { ScrollArea } from '@egodb/ui'
import { openContextModal } from '@egodb/ui'
import { IconColumnInsertRight } from '@egodb/ui'
import { Divider } from '@egodb/ui'
import { Menu } from '@egodb/ui'
import { IconChevronDown } from '@egodb/ui'
import { Box, useHover } from '@egodb/ui'
import { IconColumns3 } from '@egodb/ui'
import { useListState } from '@egodb/ui'
import { ActionIcon, IconGripVertical } from '@egodb/ui'
import { Tooltip } from '@egodb/ui'
import { Badge, Button, Checkbox, Group, Popover, Stack, useDisclosure } from '@egodb/ui'
import { useTranslation } from 'react-i18next'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { CREATE_FIELD_MODAL_ID } from '../../modals'
import { FieldIcon } from '../field-inputs/field-Icon'
import { FieldMenuDropdown } from '../field/field-menu-dropdown'

type OnVisibleChange = (fieldId: string, visible: boolean) => void

interface IFieldItemProps extends CheckboxProps {
  onVisibleChange: OnVisibleChange
  field: Field
  index: number
}

const FieldItem: React.FC<IFieldItemProps> = ({ field: f, onVisibleChange, index, ...rest }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: f.id.value })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const { hovered, ref } = useHover()

  return (
    <Box ref={ref}>
      <Group spacing="xs" ref={setNodeRef} style={style} position="apart" noWrap>
        <Group spacing="xs">
          <ActionIcon size="xs" {...attributes} {...listeners}>
            <IconGripVertical size={14} />
          </ActionIcon>
          <Checkbox
            lh={1}
            size="xs"
            onChange={(e) => onVisibleChange(f.id.value, e.target.checked)}
            key={f.id.value}
            value={f.id.value}
            label={
              <Group spacing="xs">
                <FieldIcon type={f.type} />
                {f.name.value}
              </Group>
            }
            {...rest}
          />
        </Group>

        <Menu width={200}>
          {hovered && (
            <Menu.Target>
              <ActionIcon size="xs" color="gray.5">
                <IconChevronDown />
              </ActionIcon>
            </Menu.Target>
          )}

          <FieldMenuDropdown field={f} orientation="vertial" index={index} />
        </Menu>
      </Group>
    </Box>
  )
}

export const ViewFieldsEditor: React.FC = () => {
  const table = useCurrentTable()
  const view = useCurrentView()

  const fieldsOrder = table.getFieldsOrder(view)

  const [opened, handler] = useDisclosure(false)

  const [setFieldVisibility, { isLoading }] = useSetVisibilityMutation()
  const [setShowSystemFields] = useSetShowSystemFieldsMutation()

  const visibility = view.getVisibility()
  const schema = table.schema.toIdMap()
  const hiddenCount = view.fieldOptions?.hiddenCount ?? 0

  const [order, handlers] = useListState(fieldsOrder)

  const { t } = useTranslation()

  useDeepCompareEffect(() => {
    handlers.setState(fieldsOrder)
  }, [fieldsOrder])

  const onChange: OnVisibleChange = (fieldId: string, visible: boolean) => {
    setFieldVisibility({ tableId: table.id.value, viewId: view.id.value, fieldId, hidden: !visible })
  }

  const [moveField] = useMoveFieldMutation()

  return (
    <Popover
      width={250}
      position="bottom-start"
      opened={opened}
      onChange={handler.toggle}
      closeOnClickOutside
      shadow="md"
      withinPortal
    >
      <Popover.Target>
        <Tooltip label="reorder or hide fields">
          <Button
            variant={hiddenCount ? 'light' : 'subtle'}
            compact
            size="xs"
            loading={isLoading}
            leftIcon={<IconColumns3 size={18} />}
            onClick={handler.toggle}
            rightIcon={
              hiddenCount ? (
                <Badge variant="filled" size="xs">
                  {hiddenCount}
                </Badge>
              ) : null
            }
          >
            {t('Config Fields')}
          </Button>
        </Tooltip>
      </Popover.Target>

      <Popover.Dropdown>
        <ScrollArea.Autosize mah={300}>
          <Stack>
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={(e) => {
                const { over, active } = e
                if (over) {
                  handlers.reorder({
                    from: active.data.current?.sortable?.index,
                    to: over?.data.current?.sortable?.index,
                  })

                  moveField({
                    tableId: table.id.value,
                    viewId: view.id.value,
                    from: active.id as string,
                    to: over.id as string,
                  })
                }
              }}
            >
              <SortableContext items={order} strategy={verticalListSortingStrategy}>
                {order.map((fieldId, index) => {
                  const field = schema.get(fieldId)
                  if (!field) return null
                  return (
                    <FieldItem
                      key={field.id.value}
                      field={field}
                      onVisibleChange={onChange}
                      defaultChecked={visibility[field.id.value] === undefined || !!visibility[field.id.value]}
                      index={index}
                    />
                  )
                })}
              </SortableContext>
            </DndContext>
          </Stack>
        </ScrollArea.Autosize>

        <Divider my="sm" />

        <Stack>
          <Checkbox
            size="xs"
            color="gray"
            label={t('Show System Fields')}
            defaultChecked={view.showSystemFields}
            onChange={(e) => {
              setShowSystemFields({
                tableId: table.id.value,
                viewId: view.id.value,
                showSystemFields: e.target.checked,
              })
            }}
          />

          <Button
            compact
            size="xs"
            fullWidth
            variant="light"
            color="gray"
            leftIcon={<IconColumnInsertRight size={14} />}
            onClick={() => {
              handler.close()
              openContextModal({
                title: t('Create New Field'),
                modal: CREATE_FIELD_MODAL_ID,
                innerProps: {},
              })
            }}
          >
            {t('Create New Field')}
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
