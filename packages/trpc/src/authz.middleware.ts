import { getHasPermission, type ISpaceAction } from "@undb/authz"
import { executionContext } from "@undb/context/server"
import { middleware } from "./trpc"

export const authz = (...actions: ISpaceAction[]) =>
  middleware(({ next }) => {
    const member = executionContext.getStore()?.member
    const role = member?.role
    if (!role) {
      throw new Error("Role not found")
    }
    for (const action of actions) {
      const hasPermission = getHasPermission({ role, action })
      if (!hasPermission) {
        throw new Error("Permission denied")
      }
    }
    return next()
  })
