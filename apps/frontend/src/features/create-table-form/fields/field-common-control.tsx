import { canDisplay, isControlledFieldType } from '@egodb/core'
import type { ICreateTableInput } from '@egodb/cqrs'
import { ActionIcon, Text, Button, Group, IconDots, Menu, Switch } from '@egodb/ui'
import { useResetAtom } from 'jotai/utils'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { activeFieldAtom } from '../create-table-form-schema.atom'

interface IProps {
  index: number
}

export const FieldCommonControl: React.FC<IProps> = ({ index }) => {
  const form = useFormContext<ICreateTableInput>()
  const type = form.watch(`schema.${index}.type`)

  const { remove } = useFieldArray<ICreateTableInput>({
    name: 'schema',
  })
  const { t } = useTranslation()
  const resetActiveField = useResetAtom(activeFieldAtom)
  return (
    <Group position="right">
      {!isControlledFieldType(type) && (
        <Switch {...form.register(`schema.${index}.required`)} size="xs" label={t('Required', { ns: 'common' })} />
      )}
      {canDisplay(type) && (
        <Switch {...form.register(`schema.${index}.display`)} size="xs" label={t('Display', { ns: 'common' })} />
      )}
      <Menu>
        <Menu.Target>
          <ActionIcon variant="subtle">
            <IconDots size={14} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item h={30} color="red" onClick={() => remove(index)}>
            <Text size={14}>{t('Delete', { ns: 'common' })}</Text>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Button size="xs" variant="outline" onClick={resetActiveField}>
        {t('Done', { ns: 'common' })}
      </Button>
    </Group>
  )
}
