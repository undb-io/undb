import "reflect-metadata"

import type { Query } from "@undb/domain"
import type { Class } from "type-fest"
import { v4 } from "uuid"
import { QUERY_HANDLER_METADATA, QUERY_METADATA } from "./constants"

export const queryHandler = (query: Class<Query>): ClassDecorator => {
  return (target: object) => {
    if (!Reflect.hasOwnMetadata(QUERY_METADATA, query)) {
      Reflect.defineMetadata(QUERY_METADATA, { id: v4() }, query)
    }
    Reflect.defineMetadata(QUERY_HANDLER_METADATA, query, target)
  }
}
