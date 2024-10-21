import { deleteDashboardDTO } from "@undb/dashboard"
import { Command, type CommandProps } from "@undb/domain"
import { z } from "@undb/zod"

export const deleteDashboardCommand = deleteDashboardDTO

export type IDeleteDashboardCommand = z.infer<typeof deleteDashboardCommand>

export class DeleteDashboardCommand extends Command implements IDeleteDashboardCommand {
  public readonly id: string

  constructor(props: CommandProps<IDeleteDashboardCommand>) {
    super(props)
    this.id = props.id
  }
}
