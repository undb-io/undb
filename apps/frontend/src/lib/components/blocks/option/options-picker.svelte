<script lang="ts">
  import Check from "lucide-svelte/icons/check"
  import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down"
  import * as Command from "$lib/components/ui/command"
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { cn } from "$lib/utils.js"
  import { Button } from "$lib/components/ui/button"
  import type { SelectField } from "@undb/table"
  import Option from "./option.svelte"

  export let field: SelectField
  $: options = field.options

  export let open = false
  let search = ""
  export let value: string[] | null = []
  export let onValueChange: (value: string[] | null) => void = () => {}

  $: selectedValue =
    ((Array.isArray(value) || value === null) &&
      value?.map((v) => options.find((o) => o.id === v)).filter((v) => !!v)) ||
    []
  $: filteredOptions = options.filter((option) => option.name.toLowerCase().includes(search.toLowerCase()))
</script>

<Popover.Root bind:open let:ids>
  <Popover.Trigger asChild let:builder>
    <Button
      builders={[builder]}
      variant="outline"
      role="combobox"
      aria-expanded={open}
      class={cn("w-full justify-between  overflow-hidden", $$restProps.class)}
    >
      <div class="flex flex-1 items-center gap-1">
        {#each selectedValue as option}
          <Option {option} />
        {/each}
      </div>
    </Button>
  </Popover.Trigger>
  <Popover.Content class="p-0">
    <Command.Root shouldFilter={false}>
      <Command.Input bind:value={search} placeholder="Search option..." />
      <Command.Empty>No option found.</Command.Empty>
      <Command.Group>
        {#each filteredOptions as option}
          <Command.Item
            value={option.id}
            onSelect={(currentValue) => {
              value = value?.includes(currentValue)
                ? value?.filter((v) => v !== currentValue)
                : [...(value ?? []), currentValue]
              onValueChange(value ?? [])
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
