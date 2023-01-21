import type { MantineTheme } from '@mantine/core'

export { Modal } from '@mantine/core'
export {
  closeAllModals,
  closeModal,
  ModalsProvider,
  openConfirmModal,
  openContextModal,
  openModal,
} from '@mantine/modals'
export type { ContextModalProps, ModalsProviderProps } from '@mantine/modals'
export type { OpenConfirmModal } from '@mantine/modals/lib/context'

export const modalStyles = (theme: MantineTheme) => ({})
