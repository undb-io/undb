import type { IViewPinnedFields } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ISetPinnedFieldsCommandInput } from './set-pinned-fields.command.interface.js'

export class SetPinnedFieldsCommand extends Command implements ISetPinnedFieldsCommandInput {
  public readonly tableId: string
  public readonly viewId?: string
  public readonly pinnedFields: IViewPinnedFields

  constructor(props: CommandProps<ISetPinnedFieldsCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.pinnedFields = props.pinnedFields
  }
}
