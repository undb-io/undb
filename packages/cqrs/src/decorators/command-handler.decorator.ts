import "reflect-metadata"

import type { Command } from "@undb/domain"
import type { Class } from "type-fest"
import { v4 } from "uuid"
import { COMMAND_HANDLER_METADATA, COMMAND_METADATA } from "./constants"

export const commandHandler = (command: Class<Command>): ClassDecorator => {
  return (target: object) => {
    if (!Reflect.hasOwnMetadata(COMMAND_METADATA, command)) {
      Reflect.defineMetadata(COMMAND_METADATA, { id: v4() }, command)
    }
    Reflect.defineMetadata(COMMAND_HANDLER_METADATA, command, target)
  }
}
