import { Command } from "@undb/domain"
import { z } from "@undb/zod"

export const deleteSpaceCommand = z.object({})

export type IDeleteSpaceCommand = z.infer<typeof deleteSpaceCommand>

export class DeleteSpaceCommand extends Command implements IDeleteSpaceCommand {}
