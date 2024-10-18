import "reflect-metadata"

import type { BaseEvent } from "@undb/domain"
import type { Class } from "type-fest"
import { v4 } from "uuid"
import { EVENT_HANDLER_METADATA, EVENT_METADATA } from "./constants"

export const eventHandler = (event: Class<BaseEvent>): ClassDecorator => {
  return (target: object) => {
    if (!Reflect.hasOwnMetadata(EVENT_METADATA, event)) {
      Reflect.defineMetadata(EVENT_METADATA, { id: v4() }, event)
    }
    Reflect.defineMetadata(EVENT_HANDLER_METADATA, event, target)
  }
}
