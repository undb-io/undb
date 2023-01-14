import type { MantineTheme } from '@mantine/core'

export { Modal } from '@mantine/core'
export { closeModal, ModalsProvider, openConfirmModal, openContextModal, openModal } from '@mantine/modals'
export type { ContextModalProps } from '@mantine/modals'
export type { OpenConfirmModal } from '@mantine/modals/lib/context'

export const modalStyles = (theme: MantineTheme) => ({
  root: {
    backdropFilter: 'blur(3px) !important',
  },
  overlay: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2] + ' !important',
    opacity: '0.55 !important',
  },
})
