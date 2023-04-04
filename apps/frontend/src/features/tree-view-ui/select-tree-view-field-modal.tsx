import type { ContextModalProps } from '@egodb/ui'
import { SelectTreeViewField } from './select-tree-view-field'
import type { ISelectTreeViewFieldProps } from './select-tree-view-field.props'

export const SelectTreeViewFieldModal = ({ innerProps }: ContextModalProps<ISelectTreeViewFieldProps>) => (
  <SelectTreeViewField {...innerProps} />
)
