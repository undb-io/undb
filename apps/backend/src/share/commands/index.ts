import { NestCreateShareCommandHandler } from './create-share.command-handler.js'
import { NestUpdateShareCommandHandler } from './update-share.command-handler.js'

export const commands = [NestCreateShareCommandHandler, NestUpdateShareCommandHandler]
