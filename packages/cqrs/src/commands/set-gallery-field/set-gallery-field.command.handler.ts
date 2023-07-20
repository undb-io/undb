import type { ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { SetGalleryFieldCommand } from './set-gallery-field.command.js'

type ISetGalleryFieldCommandHandler = ICommandHandler<SetGalleryFieldCommand, void>

export class SetGalleryFieldCommandHandler implements ISetGalleryFieldCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: SetGalleryFieldCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()

    const spec = table.setGalleryField(command)

    await this.repo.updateOneById(table.id.value, spec)
  }
}
