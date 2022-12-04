import { v4 } from 'uuid'

export type CommandProps<T> = Omit<T, 'correlationId' | 'commandId'> & Partial<Command>

export abstract class Command {
  /**
   * Command id, in case if we want to save it
   * for auditing purposes and create a correlation/causation chain
   */
  public readonly commandId: string

  /** ID for correlation purposes (for commands that
   *  arrive from other microservices,logs correlation, etc). */
  public readonly correlationId: string

  /**
   * Causation id to reconstruct execution order if needed
   */
  public readonly causationId?: string

  constructor(props: CommandProps<unknown>) {
    this.correlationId = props.correlationId ?? v4()
    this.commandId = props.commandId ?? v4()
  }
}
