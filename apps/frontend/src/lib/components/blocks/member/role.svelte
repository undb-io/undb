<script lang="ts">
  import { cn } from "$lib/utils"
  import type { ISpaceMemberRole } from "@undb/authz"
  import { getRoleBgColor } from "./get-role-bg-color"
  import { LL } from "@undb/i18n/client"

  export let role: ISpaceMemberRole
</script>

<span
  class={cn(
    "inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium text-background ring-1 ring-inset ring-gray-500/10",
    getRoleBgColor(role),
  )}
>
  {$LL.roles[role]()}
</span>
