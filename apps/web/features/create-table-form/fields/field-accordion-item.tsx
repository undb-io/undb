import { useSortable } from '@dnd-kit/sortable'
import {
  Accordion,
  Group,
  Text,
  Select,
  TextInput,
  Space,
  ActionIcon,
  IconGripVertical,
  Stack,
  Button,
  IconPlus,
  useDisclosure,
} from '@egodb/ui'
import React from 'react'
import { CSS } from '@dnd-kit/utilities'
import { FieldCommonControl } from './field-common-control'
import { FieldInputLabel } from '../../field-inputs/field-input-label'
import { FIELD_SELECT_ITEMS } from '../../../constants/field.constants'
import { FieldVariantControl } from './field-variant-control'
import { FieldIcon } from '../../field-inputs/field-Icon'
import { FieldItem } from '../../field-inputs/field-item'
import { Controller, useFormContext } from 'react-hook-form'
import type { ICreateTableInput } from '@egodb/cqrs'
import { useTranslation } from 'react-i18next'

interface IProps {
  id: number
  index: number
  isNew?: boolean
}

export type Props = {
  children?: React.ReactNode
}

export const FieldAccordionItem: React.FC<IProps> = ({ index, id }) => {
  const form = useFormContext<ICreateTableInput>()
  const name = form.watch(`schema.${index}.name`)
  const type = form.watch(`schema.${index}.type`)

  const { attributes, listeners, isDragging, setNodeRef, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const { t } = useTranslation()
  const [display, handler] = useDisclosure()

  return (
    <Accordion.Item id={String(id)} opacity={isDragging ? 0.5 : 1} value={String(id)}>
      <Accordion.Control icon={<FieldIcon type={form.watch(`schema.${index}.type`)} />} ref={setNodeRef} style={style}>
        <Group>
          <ActionIcon {...attributes} {...listeners} component="a">
            <IconGripVertical size={12} />
          </ActionIcon>
          <Text fz="sm" fw={500}>
            {name || `${t('Field')} ${index + 1}`}
          </Text>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Stack>
          <Group grow={true}>
            <Controller
              name={`schema.${index}.type`}
              render={(f) => (
                <Select
                  {...f.field}
                  withinPortal
                  searchable
                  onChange={(value) => f.field.onChange(value)}
                  label={<FieldInputLabel>{t('Name', { ns: 'common' })}</FieldInputLabel>}
                  defaultValue="string"
                  variant="filled"
                  required={true}
                  data={FIELD_SELECT_ITEMS.map((item) => ({
                    value: item.value,
                    label: t(item.label!) as string,
                    group: t(item.group!, { ns: 'common' }) as string,
                  }))}
                  itemComponent={FieldItem}
                  icon={<FieldIcon type={type} />}
                />
              )}
            />

            <TextInput
              {...form.register(`schema.${index}.name`)}
              label={<FieldInputLabel>{t('Name', { ns: 'common' })}</FieldInputLabel>}
              variant="filled"
              required={true}
              autoFocus
              placeholder={t('Field Name') as string}
            />
          </Group>
          <FieldVariantControl index={index} />

          {display && (
            <TextInput
              {...form.register(`schema.${index}.description`)}
              autoFocus
              variant="filled"
              label={<FieldInputLabel>{t('Description', { ns: 'common' })}</FieldInputLabel>}
              placeholder={t('Description', { ns: 'common' }) as string}
            />
          )}
        </Stack>
        <Space h="lg" />
        <Group position="apart">
          <Button compact size="xs" leftIcon={<IconPlus size={14} />} variant="subtle" onClick={handler.open}>
            {t('Add Description')}
          </Button>
          <FieldCommonControl index={index} />
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  )
}
