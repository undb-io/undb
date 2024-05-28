<script lang="ts">
  import Check from "svelte-radix/Check.svelte"
  import CaretSort from "svelte-radix/CaretSort.svelte"
  import { tick } from "svelte"
  import * as Command from "$lib/components/ui/command/index.js"
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import { cn } from "$lib/utils.js"
  import type { Field, IOpType } from "@undb/table"

  export let field: Field | undefined
  $: conditionOps = field?.conditionOps ?? []
  $: ops = conditionOps.map((op) => ({ value: op, label: op })) ?? []

  $: if (field && !!value && !conditionOps.includes(value)) {
    value = ops[0]?.value
  }

  let open = false
  export let value: IOpType | undefined = undefined

  $: selectedValue = ops.find((f) => f.value === value)?.label ?? "op..."

  $: hasValue = selectedValue ? field?.isOpHasValue(selectedValue) ?? false : false

  function closeAndFocusTrigger(triggerId: string) {
    open = false
    tick().then(() => {
      document.getElementById(triggerId)?.focus()
    })
  }
</script>

<Popover.Root bind:open let:ids>
  <Popover.Trigger asChild let:builder>
    <Button
      builders={[builder]}
      size="sm"
      variant="outline"
      role="combobox"
      aria-expanded={open}
      class={cn("justify-between", "rounded-r-none", !hasValue && "rounded-r-md", $$restProps.class)}
    >
      <span class="overflow-hidden text-ellipsis" title={selectedValue}>
        {selectedValue}
      </span>
      <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <Command.Input placeholder="Search framework..." class="h-9" />
      <Command.Empty>No framework found.</Command.Empty>
      <Command.Group>
        {#each ops as framework}
          <Command.Item
            value={framework.value}
            onSelect={(currentValue) => {
              value = currentValue
              closeAndFocusTrigger(ids.trigger)
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
