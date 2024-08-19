import { injectBaseRepository, type IBaseRepository } from "@undb/base"
import { DeleteBaseCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type ICommandHandler } from "@undb/domain"

@commandHandler(DeleteBaseCommand)
@singleton()
export class DeleteBaseCommandHandler implements ICommandHandler<DeleteBaseCommand, any> {
  constructor(
    @injectBaseRepository()
    private readonly repository: IBaseRepository,
  ) {}

  async execute(command: DeleteBaseCommand): Promise<any> {
    const base = (await this.repository.findOneById(command.id)).expect("base not found")

    await this.repository.deleteOneById(base.id.value)

    return base.id.value
  }
}
