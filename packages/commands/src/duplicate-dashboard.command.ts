import { duplicateDashboardDTO } from "@undb/dashboard"
import { Command, type CommandProps } from "@undb/domain"
import { z } from "@undb/zod"

export const duplicateDashboardCommand = duplicateDashboardDTO

export type IDuplicateDashboardCommand = z.infer<typeof duplicateDashboardCommand>

export class DuplicateDashboardCommand extends Command implements IDuplicateDashboardCommand {
  public readonly id: string

  constructor(props: CommandProps<IDuplicateDashboardCommand>) {
    super(props)
    this.id = props.id
  }
}
