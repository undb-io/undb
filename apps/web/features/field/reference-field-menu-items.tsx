import type { ParentField, ReferenceField, TreeField } from '@egodb/core'
import { Group, IconChevronRight, IconSearch, Menu, Text } from '@egodb/ui'
import { useTranslation } from 'react-i18next'
import { useMenuStyle } from './menu-item'
import { FieldIcon } from '../field-inputs/field-Icon'

interface IProps {
  field: ReferenceField | TreeField | ParentField
}
export const ReferenceFieldMenuItems: React.FC<IProps> = ({ field }) => {
  const { t } = useTranslation()
  const { classes } = useMenuStyle({})

  return (
    <>
      <Menu.Item className={classes.menu}>
        <Menu trigger="hover" position="right-start" width={180}>
          <Menu.Target>
            <Group position="apart" noWrap p={0}>
              <Group spacing="xs">
                <IconSearch size={14} />
                <Text size="xs">{t('Insert Lookup Fields')}</Text>
              </Group>
              <IconChevronRight color="gray" size={14} />
            </Group>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item icon={<FieldIcon type="lookup" />} className={classes.menu}>
              {t('Insert Lookup Field')}
            </Menu.Item>
            {field.type !== 'parent' && (
              <>
                <Menu.Item icon={<FieldIcon type="count" />} className={classes.menu}>
                  {t('Insert Count Field')}
                </Menu.Item>
                <Menu.Item icon={<FieldIcon type="sum" />} className={classes.menu}>
                  {t('Insert Sum Field')}
                </Menu.Item>
                <Menu.Item icon={<FieldIcon type="average" />} className={classes.menu}>
                  {t('Insert Average Field')}
                </Menu.Item>
              </>
            )}
          </Menu.Dropdown>
        </Menu>
      </Menu.Item>
    </>
  )
}
