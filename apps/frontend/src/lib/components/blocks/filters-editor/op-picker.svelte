<script lang="ts">
  import Check from "svelte-radix/Check.svelte"
  import CaretSort from "svelte-radix/CaretSort.svelte"
  import { tick } from "svelte"
  import * as Command from "$lib/components/ui/command/index.js"
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import { cn } from "$lib/utils.js"
  import type { Field, IOpType } from "@undb/table"
  import { LL } from "@undb/i18n/client"

  export let field: Field | undefined
  $: conditionOps = field?.conditionOps ?? []
  $: ops = conditionOps.map((op) => ({ value: op, label: $LL.table.ops[op]() })) ?? []
  export let disabled = false

  export let onValueChange: ((value: IOpType) => void) | undefined = undefined

  let open = false
  export let value: IOpType | undefined = undefined

  $: selectedValue = ops.find((f) => f.value === value)?.label

  function closeAndFocusTrigger(triggerId: string) {
    open = false
    tick().then(() => {
      document.getElementById(triggerId)?.focus()
    })
  }
</script>

<Popover.Root bind:open let:ids portal="body">
  <Popover.Trigger asChild let:builder>
    <Button
      {disabled}
      builders={[builder]}
      size="sm"
      variant="outline"
      role="combobox"
      aria-expanded={open}
      class={cn("justify-between", "rounded-r-none", $$restProps.class)}
      {...$$restProps}
    >
      <span class="overflow-hidden text-ellipsis text-xs text-gray-700" title={selectedValue}>
        {selectedValue ?? "op..."}
      </span>
      <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <Command.Input placeholder={$LL.table.common.searchOp()} class="h-9" />
      <Command.Empty>No oprator found.</Command.Empty>
      <Command.Group>
        {#each ops as framework}
          <Command.Item
            class="text-xs text-gray-700"
            value={framework.value}
            onSelect={(currentValue) => {
              value = currentValue
              closeAndFocusTrigger(ids.trigger)
              onValueChange?.(currentValue)
            }}
          >
            <Check class={cn("mr-2 h-4 w-4", value !== framework.value && "text-transparent")} />
            {framework.label}
          </Command.Item>
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
