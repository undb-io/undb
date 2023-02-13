import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { ISetTreeViewFieldCommandInput } from './set-tree-view-field.command.interface.js'

export class SetTreeViewFieldCommand extends Command implements ISetTreeViewFieldCommandInput {
  readonly tableId: string
  readonly viewId?: string
  readonly field: string

  constructor(props: CommandProps<ISetTreeViewFieldCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.field = props.field
  }
}
