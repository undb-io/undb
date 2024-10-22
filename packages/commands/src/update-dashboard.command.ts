import { uniqueDashboardDTO,updateDashboardDTO } from "@undb/dashboard"
import { Command,type CommandProps } from "@undb/domain"
import { z } from "@undb/zod"

export const updateDashboardCommand = updateDashboardDTO.merge(uniqueDashboardDTO)

export type IUpdateDashboardCommand = z.infer<typeof updateDashboardCommand>

export class UpdateDashboardCommand extends Command implements IUpdateDashboardCommand {
  public readonly dashboardId: string | undefined
  public readonly dashboardName: string | undefined
  public readonly name: string | undefined
  public readonly baseName: string | undefined
  public readonly description: string | undefined

  constructor(props: CommandProps<IUpdateDashboardCommand>) {
    super(props)
    this.dashboardId = props.dashboardId
    this.dashboardName = props.dashboardName
    this.name = props.name
    this.baseName = props.baseName
    this.description = props.description
  }
}
