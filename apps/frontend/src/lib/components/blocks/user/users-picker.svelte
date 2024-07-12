<script lang="ts">
  import Check from "svelte-radix/Check.svelte"
  import CaretSort from "svelte-radix/CaretSort.svelte"
  import * as Command from "$lib/components/ui/command/index.js"
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import { cn } from "$lib/utils.js"
  import { GetUsersStore } from "$houdini"
  import { Skeleton } from "$lib/components/ui/skeleton"
  import * as Avatar from "$lib/components/ui/avatar"
  import type { IMultipleUserFieldValue } from "@undb/table"

  let q = ""
  $: store = new GetUsersStore()
  $: open && store.fetch({ variables: { q } })
  $: users = $store.data?.members ?? []

  export let open = false
  export let value: IMultipleUserFieldValue
  export let onValueChange: (value: IMultipleUserFieldValue) => void = () => {}

  $: selectedValue = value?.map((v) => users.find((f) => f?.user.id === v)).filter((v) => !!v) ?? []
</script>

<Popover.Root bind:open let:ids>
  <Popover.Trigger asChild let:builder>
    <slot name="trigger" {builder} selected={selectedValue}>
      <Button
        builders={[builder]}
        variant="outline"
        role="combobox"
        aria-expanded={open}
        class={cn("w-full justify-between", $$restProps.class)}
        {...$$restProps}
      >
        <div class="flex flex-1 items-center gap-1 overflow-hidden">
          {#each selectedValue as user}
            {user?.user.username}
          {/each}
        </div>
        <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </slot>
  </Popover.Trigger>
  <Popover.Content class="max-h-[400px] p-0">
    <Command.Root shouldFilter={false}>
      <Command.Input bind:value={q} placeholder="Search user by email or username..." class="h-9" />
      {#if !$store.fetching}
        <Command.Empty>No User found.</Command.Empty>
      {/if}
      <Command.Group>
        {#if $store.fetching}
          <div class="space-y-2">
            <Skeleton class="h-[20px]" />
            <Skeleton class="h-[20px]" />
            <Skeleton class="h-[20px]" />
            <Skeleton class="h-[20px]" />
            <Skeleton class="h-[20px]" />
            <Skeleton class="h-[20px]" />
          </div>
        {/if}
        {#each users as user}
          <Command.Item
            value={user?.user.id}
            onSelect={(currentValue) => {
              value = value?.includes(currentValue)
                ? value?.filter((v) => v !== currentValue)
                : [...(value ?? []), currentValue]

              onValueChange(value ?? [])
            }}
          >
            <Check class={cn("mr-2 h-4 w-4", !value?.includes(user?.user.id ?? "") && "text-transparent")} />
            <div class="flex items-center gap-1">
              <Avatar.Root>
                <Avatar.Image src="" alt={user?.user.username} />
                <Avatar.Fallback>{user?.user.username?.slice(0, 2)}</Avatar.Fallback>
              </Avatar.Root>
              <div>
                <div class="font-semibold">
                  {user?.user.username}
                </div>
                <div class="text-muted-foreground text-xs">
                  {user?.user.email}
                </div>
              </div>
            </div>
          </Command.Item>
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
