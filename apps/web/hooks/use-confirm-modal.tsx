import type { OpenConfirmModal } from '@egodb/ui'
import { Text } from '@egodb/ui'
import { openConfirmModal, useEgoUITheme } from '@egodb/ui'

export const useConfirmModal = (props: OpenConfirmModal) => {
  const theme = useEgoUITheme()
  const open = () =>
    openConfirmModal({
      ...props,
      target: 'body',
      title: 'Please confirm your action',
      children: <Text size="sm">You have unsaved changes. Do you really want to close the panel?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      overlayColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
      overlayOpacity: 0.55,
      overlayBlur: 3,
      centered: true,
    })

  return open
}
