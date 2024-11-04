<script lang="ts">
  import * as Select from "$lib/components/ui/select"
  import { cn } from "$lib/utils"
  import { type IDateRangeFieldConditionItemScope } from "@undb/table"

  export let value: IDateRangeFieldConditionItemScope = "start"

  $: selectedRole = value
    ? {
        label: value,
        value,
      }
    : undefined
</script>

<Select.Root
  selected={selectedRole}
  onSelectedChange={(v) => {
    if (v) {
      value = v.value
    }
  }}
  portal="body"
>
  <Select.Trigger class={cn("rounded-none border-r-0 text-xs", $$restProps.class)}>
    <Select.Value asChild placeholder="Scope">
      {#key selectedRole}
        {#if selectedRole}
          {value}
        {/if}
      {/key}
    </Select.Value>
  </Select.Trigger>
  <Select.Content sameWidth>
    <Select.Item value="start" class="text-xs">start</Select.Item>
    <Select.Item value="end" class="text-xs">end</Select.Item>
  </Select.Content>
</Select.Root>
