import { Command, type CommandProps } from "@undb/domain"
import { disableShareDTO, type IShareTarget } from "@undb/share"
import { z } from "@undb/zod"

export const disableShareCommand = disableShareDTO

export type IDisableShareCommand = z.infer<typeof disableShareCommand>

export class DisableShareCommand extends Command implements IDisableShareCommand {
  public readonly target: IShareTarget

  constructor(props: CommandProps<IDisableShareCommand>) {
    super(props)
    this.target = props.target
  }
}
