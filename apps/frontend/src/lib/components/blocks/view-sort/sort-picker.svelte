<script lang="ts">
  import * as Select from "$lib/components/ui/select"
  import { ArrowDownAzIcon, ArrowUpZaIcon } from "lucide-svelte"
  import { LL } from "@undb/i18n/client"
  import { cn } from "$lib/utils"

  export let value: "asc" | "desc" = "asc"
  export let disabled = false
  export let onChange: (direction: "asc" | "desc") => void | undefined = undefined
</script>

<Select.Root
  portal="body"
  {disabled}
  selected={{ value, label: $LL.table.common.sorts.direction[value]() }}
  onSelectedChange={(selected) => {
    if (selected) {
      value = selected.value
      onChange?.(value)
    }
  }}
>
  <Select.Trigger class={cn("h-8 rounded-l-none", $$restProps.class)}>
    <Select.Value asChild let:label>
      <div class="flex items-center gap-2 text-xs">
        {#if value === "asc"}
          <ArrowDownAzIcon class="mr-1 h-3 w-3" />
        {:else}
          <ArrowUpZaIcon class="mr-1 h-4 w-4" />
        {/if}
        <span>{label}</span>
      </div>
    </Select.Value>
  </Select.Trigger>

  <Select.Content class="text-sm">
    <Select.Item value="asc" class="text-xs">
      <ArrowDownAzIcon class="mr-2 size-3" />
      {$LL.table.common.sorts.direction.asc()}
    </Select.Item>
    <Select.Item value="desc" class="text-xs">
      <ArrowUpZaIcon class="mr-2 size-3" />
      {$LL.table.common.sorts.direction.desc()}
    </Select.Item>
  </Select.Content>
</Select.Root>
