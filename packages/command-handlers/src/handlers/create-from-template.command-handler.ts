import { checkPermission, injectSpaceMemberService, type ISpaceMemberService } from "@undb/authz"
import { BaseId, injectBaseRepository, WithBaseId, WithBaseSpaceId, type IBaseRepository } from "@undb/base"
import { CreateFromTemplateCommand } from "@undb/commands"
import { getCurrentUserId, mustGetCurrentSpaceId } from "@undb/context/server"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { injectShareRepository, WithShareId, type IShareRepository } from "@undb/share"
import { injectTableService, type ITableService } from "@undb/table"

@commandHandler(CreateFromTemplateCommand)
@singleton()
export class CreateFromTemplateCommandHandler implements ICommandHandler<CreateFromTemplateCommand, any> {
  private readonly logger = createLogger(CreateFromTemplateCommandHandler.name)

  constructor(
    @injectBaseRepository()
    private readonly baseRepository: IBaseRepository,
    @injectTableService()
    private readonly tableService: ITableService,
    @injectSpaceMemberService()
    private readonly spaceMemberService: ISpaceMemberService,
    @injectShareRepository()
    private readonly shareRepository: IShareRepository,
  ) {}

  async execute(command: CreateFromTemplateCommand): Promise<any> {
    this.logger.debug("CreateFromTemplateCommandHandler execute command", command)
    const share = (await this.shareRepository.findOne(WithShareId.fromString(command.shareId))).expect(
      "Share not found",
    )

    if (share.target.type !== "base") {
      throw new Error("Share target is not base")
    }

    const baseId = share.target.id
    const spaceId = share.spaceId

    const userId = getCurrentUserId()
    const targetSpaceId = command.targetSpaceId ?? mustGetCurrentSpaceId()

    const member = (await this.spaceMemberService.getSpaceMember(userId, targetSpaceId)).expect("Member not found")
    checkPermission(member.props.role, ["base:create"])

    const spec = new WithBaseId(new BaseId(baseId)).and(new WithBaseSpaceId(spaceId))
    const base = (await this.baseRepository.findOne(spec)).expect("Base not found")

    const duplicatedBase = await this.tableService.duplicateBase(base, spaceId, targetSpaceId, {
      id: baseId,
      name: command.name,
      includeData: command.includeData,
    })

    return duplicatedBase.id.value
  }
}
