<script lang="ts">
  import Check from "lucide-svelte/icons/check"
  import * as Command from "$lib/components/ui/command"
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { cn } from "$lib/utils.js"
  import { Button } from "$lib/components/ui/button"
  import type { IOptionId, SelectField } from "@undb/table"
  import Option from "./option.svelte"
  import { tick } from "svelte"

  export let field: SelectField
  $: options = field.options

  export let open = false
  let search = ""
  export let value: IOptionId | null = null
  export let onValueChange: (value: IOptionId | null) => void = () => {}

  $: selectedValue = options.find((option) => option.id === value)
  $: filteredOptions = options.filter((option) => option.name.toLowerCase().includes(search.toLowerCase()))

  function closeAndFocusTrigger(triggerId: string) {
    open = false
    tick().then(() => {
      document.getElementById(triggerId)?.focus()
    })
  }

  export let sameWidth = false
</script>

<Popover.Root bind:open let:ids>
  <Popover.Trigger asChild let:builder>
    <Button
      builders={[builder]}
      variant="outline"
      role="combobox"
      aria-expanded={open}
      class={cn("w-full justify-between overflow-hidden", $$restProps.class)}
    >
      {#if selectedValue}
        <Option option={selectedValue} />
      {/if}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="p-0" {sameWidth}>
    <Command.Root shouldFilter={false}>
      <Command.Input bind:value={search} placeholder="Search option..." />
      <Command.Empty>No Option found.</Command.Empty>
      <Command.Group>
        {#each filteredOptions as option}
          <Command.Item
            value={option.id}
            onSelect={(currentValue) => {
              value = value === currentValue ? null : currentValue
              onValueChange(value)
              closeAndFocusTrigger(ids.trigger)
            }}
          >
            <Check class={cn("text-primary mr-2 h-4 w-4", !value?.includes(option.id) && "text-transparent")} />
            <Option {option} />
          </Command.Item>
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
