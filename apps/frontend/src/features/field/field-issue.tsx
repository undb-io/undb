import type { Field } from '@undb/core'
import type { ActionIconProps } from '@undb/ui'
import { Tooltip, ActionIcon, IconExclamationCircle } from '@undb/ui'
import { t } from 'i18next'

interface IProps extends ActionIconProps {
  field: Field
}
export const FieldIssue: React.FC<IProps> = ({ field, ...rest }) => {
  return (
    <Tooltip label={field.issues.map((issue) => t(issue.unpack()))} withinPortal>
      <ActionIcon size="sm" color="red.5" variant="light" {...rest}>
        <IconExclamationCircle />
      </ActionIcon>
    </Tooltip>
  )
}
