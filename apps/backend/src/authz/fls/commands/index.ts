import { CreateFLSCommandHandler } from './create-fls.command.handler.js'
import { DeleteFLSCommandHandler } from './delete-fls.command.handler.js'
import { UpdateFLSCommandHandler } from './update-fls.command.handler.js'

export const commandHandlers = [CreateFLSCommandHandler, UpdateFLSCommandHandler, DeleteFLSCommandHandler]
