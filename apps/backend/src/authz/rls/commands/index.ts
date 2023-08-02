import { CreateRLSCommandHandler } from './create-rls.command.handler.js'
import { DeleteRLSCommandHandler } from './delete-rls.command.handler.js'
import { UpdateRLSCommandHandler } from './update-rls.command.handler.js'

export const commandHandlers = [CreateRLSCommandHandler, DeleteRLSCommandHandler, UpdateRLSCommandHandler]
