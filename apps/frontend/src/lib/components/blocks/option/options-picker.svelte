<script lang="ts">
  import Check from "lucide-svelte/icons/check"
  import * as Command from "$lib/components/ui/command"
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { cn } from "$lib/utils.js"
  import { Button } from "$lib/components/ui/button"
  import type { IOption } from "@undb/table"
  import Option from "./option.svelte"
  import { LL } from "@undb/i18n/client"

  export let options: IOption[] = []
  export let disabled = false

  export let open = false
  let search = ""
  export let value: string[] | null = []
  export let onValueChange: (value: string[] | null) => void = () => {}
  export let placeholder: string | undefined = undefined

  $: selectedValue =
    ((Array.isArray(value) || value === null) &&
      value?.map((v) => options.find((o) => o.id === v)).filter((v) => !!v)) ||
    []
  $: filteredOptions = options.filter((option) => option.name.toLowerCase().includes(search.toLowerCase()))

  export let sameWidth = false
</script>

<Popover.Root bind:open let:ids portal="body">
  <Popover.Trigger asChild let:builder>
    <slot>
      <Button
        builders={[builder]}
        variant="outline"
        role="combobox"
        aria-expanded={open}
        {disabled}
        {...$$restProps}
        class={cn("w-full justify-between  overflow-hidden", $$restProps.class)}
      >
        <div class="flex flex-1 items-center gap-1">
          {#if selectedValue.length}
            {#each selectedValue as option}
              <Option {option} />
            {/each}
          {:else if placeholder}
            <span class="text-muted-foreground">
              {placeholder}
            </span>
          {/if}
        </div>
      </Button>
    </slot>
  </Popover.Trigger>
  <Popover.Content class="p-0" {sameWidth}>
    <Command.Root shouldFilter={false}>
      <Command.Input bind:value={search} placeholder={$LL.table.field.select.option.search()} />
      <Command.Empty>{$LL.table.field.select.option.noOptionFound()}</Command.Empty>
      <Command.Group class="max-h-[300px] overflow-y-auto">
        {#each filteredOptions as option}
          <Command.Item
            value={option.id}
            onSelect={(currentValue) => {
              const v = value?.includes(currentValue)
                ? value?.filter((v) => v !== currentValue)
                : [...(value ?? []), currentValue]
              value = v
              onValueChange(v ?? [])
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
