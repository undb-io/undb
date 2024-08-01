<script lang="ts">
  import { cn } from "$lib/utils"
  import type { IWorkspaceMemberRole } from "@undb/authz"
  import { getRoleBgColor } from "./get-role-bg-color"

  export let role: IWorkspaceMemberRole
</script>

<span
  class={cn(
    "text-background inline-flex items-center  rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10",
    getRoleBgColor(role),
  )}
>
  {role}
</span>
