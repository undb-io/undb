<script lang="ts">
  import { isUserFieldMacro, type IUserFieldMacro, type IUserFieldValue } from "@undb/table"
  import { LL } from "@undb/i18n/client"
  import { UserIcon } from "lucide-svelte"

  export let value: IUserFieldMacro
</script>

{#if value}
  <div class="flex items-center gap-2">
    <UserIcon class="size-3" />
    <span class="bg-muted rounded-full border px-1.5 text-xs text-gray-700"> {$LL.table.macros[value]()} </span>
  </div>
{/if}
