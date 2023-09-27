import { NestCreateBaseCommandHandler } from './create-base.command-handler.js'
import { NestDeleteBaseCommandHandler } from './delete-base.command-handler.js'
import { NestMoveToBaseCommandHandler } from './move-to-base.command-handler.js'
import { NestUpdateBaseCommandHandler } from './update-base.command-handler.js'

export const commands = [
  NestCreateBaseCommandHandler,
  NestMoveToBaseCommandHandler,
  NestUpdateBaseCommandHandler,
  NestDeleteBaseCommandHandler,
]
