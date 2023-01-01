import type { OpenConfirmModal } from '@egodb/ui'
import { modalStyles } from '@egodb/ui'
import { Text } from '@egodb/ui'
import { openConfirmModal } from '@egodb/ui'

export const useConfirmModal = (props: OpenConfirmModal) => {
  const open = () =>
    openConfirmModal({
      ...props,
      target: 'body',
      title: 'Please confirm your action',
      children: <Text size="sm">You have unsaved changes. Do you really want to close the panel?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      centered: true,
      styles: modalStyles,
    })

  return open
}
