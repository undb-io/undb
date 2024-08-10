import { checkPermission, type ISpaceAction } from "@undb/authz"
import { executionContext } from "@undb/context/server"
import { middleware } from "./trpc"

export const authz = (...actions: ISpaceAction[]) =>
  middleware(({ next }) => {
    const member = executionContext.getStore()?.member
    const role = member?.role

    checkPermission(role, actions)
    return next()
  })
