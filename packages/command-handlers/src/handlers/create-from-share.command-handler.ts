import { checkPermission, injectSpaceMemberService, type ISpaceMemberService } from "@undb/authz"
import { BaseId, injectBaseRepository, WithBaseId, WithBaseSpaceId, type IBaseRepository } from "@undb/base"
import { CreateFromShareCommand } from "@undb/commands"
import { injectContext, type IContext } from "@undb/context"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { injectShareRepository, WithShareId, type IShareRepository } from "@undb/share"
import { injectTableService, type ITableService } from "@undb/table"
import { getNextName } from "@undb/utils"

@commandHandler(CreateFromShareCommand)
@singleton()
export class CreateFromShareCommandHandler implements ICommandHandler<CreateFromShareCommand, any> {
  private readonly logger = createLogger(CreateFromShareCommandHandler.name)

  constructor(
    @injectBaseRepository()
    private readonly baseRepository: IBaseRepository,
    @injectTableService()
    private readonly tableService: ITableService,
    @injectSpaceMemberService()
    private readonly spaceMemberService: ISpaceMemberService,
    @injectShareRepository()
    private readonly shareRepository: IShareRepository,
    @injectContext()
    private readonly context: IContext,
  ) {}

  async execute(command: CreateFromShareCommand): Promise<any> {
    this.logger.debug("CreateFromShareCommandHandler execute command", command)
    const share = (await this.shareRepository.findOne(WithShareId.fromString(command.shareId))).expect(
      "Share not found",
    )

    if (share.target.type !== "base") {
      throw new Error("Share target is not base")
    }

    const baseId = share.target.id
    const spaceId = share.spaceId

    const userId = this.context.mustGetCurrentUserId()
    const targetSpaceId = command.targetSpaceId ?? this.context.mustGetCurrentSpaceId()

    const member = (await this.spaceMemberService.getSpaceMember(userId, targetSpaceId)).expect("Member not found")
    checkPermission(member.props.role, ["base:create"])

    const bases = await this.baseRepository.find(new WithBaseSpaceId(spaceId))
    const baseNames = bases.map((base) => base.name.value)

    const spec = new WithBaseId(new BaseId(baseId)).and(new WithBaseSpaceId(spaceId))
    const base = (await this.baseRepository.findOne(spec)).expect("Base not found")

    const duplicatedBase = await this.tableService.duplicateBase(base, spaceId, targetSpaceId, {
      id: baseId,
      name: getNextName(baseNames, command.name),
      includeData: command.includeData,
    })

    return duplicatedBase.id.value
  }
}
