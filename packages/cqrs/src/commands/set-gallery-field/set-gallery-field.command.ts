import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ISetGalleryFieldCommandInput } from './set-gallery-field.command.interface.js'

export class SetGalleryFieldCommand extends Command implements ISetGalleryFieldCommandInput {
  readonly tableId: string
  readonly viewId?: string
  readonly field: string

  constructor(props: CommandProps<ISetGalleryFieldCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.field = props.field
  }
}
