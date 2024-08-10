import type { ISpaceMemberRole } from "@undb/authz"

export const getRoleBgColor = (role: ISpaceMemberRole) => {
  switch (role) {
    case "owner":
      return "bg-blue-500"
    case "admin":
      return "bg-yellow-500"
    case "editor":
      return "bg-slate-500"
    case "viewer":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}
