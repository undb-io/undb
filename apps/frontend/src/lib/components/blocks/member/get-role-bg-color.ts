import type { IWorkspaceMemberRole } from "@undb/authz"

export const getRoleBgColor = (role: IWorkspaceMemberRole) => {
  switch (role) {
    case "owner":
      return "bg-blue-500"
    case "admin":
      return "bg-yellow-500"
    case "viewer":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}
