<script lang="ts">
  import Check from "svelte-radix/Check.svelte"
  import CaretSort from "svelte-radix/CaretSort.svelte"
  import { tick } from "svelte"
  import * as Command from "$lib/components/ui/command/index.js"
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import { cn } from "$lib/utils.js"
  import { GetUsersStore } from "$houdini"
  import { Skeleton } from "$lib/components/ui/skeleton"
  import * as Avatar from "$lib/components/ui/avatar"
  import { isUserFieldMacro, userFieldMacros, type ISingleUserFieldValue } from "@undb/table"
  import { UserIcon } from "lucide-svelte"
  import UserMacro from "./user-macro.svelte"

  let q = ""
  $: store = new GetUsersStore()
  $: open && store.fetch({ variables: { q } })
  $: users = $store.data?.members ?? []

  export let open = false
  export let value: ISingleUserFieldValue
  export let onValueChange: (value: ISingleUserFieldValue) => void = () => {}

  $: selectedValue = users.find((f) => f?.user.id === value)

  function closeAndFocusTrigger(triggerId: string) {
    open = false
    tick().then(() => {
      document.getElementById(triggerId)?.focus()
    })
  }

  export let sameWidth = false
</script>

<Popover.Root bind:open let:ids portal="body">
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
        <div class="flex flex-1 items-center justify-start">
          {#if selectedValue}
            <Avatar.Root class="h-6 w-6 border">
              <Avatar.Image src={selectedValue.user.avatar} alt={selectedValue.user.username} />
              <Avatar.Fallback>{selectedValue.user.username?.slice(0, 2)}</Avatar.Fallback>
            </Avatar.Root>

            <span class="ml-2">
              {selectedValue.user.username}
            </span>
          {/if}
          {#if value && isUserFieldMacro(value)}
            <UserMacro {value} />
          {/if}
        </div>
        <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </slot>
  </Popover.Trigger>
  <Popover.Content class="max-h-[400px] p-0" {sameWidth}>
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
        {#each userFieldMacros as macro}
          <Command.Item
            class="h-8"
            value={macro}
            onSelect={(currentValue) => {
              value = currentValue === value ? null : currentValue
              closeAndFocusTrigger(ids.trigger)
              onValueChange(value)
            }}
          >
            <Check class={cn("mr-2 h-4 w-4", value !== macro && "text-transparent")} />
            <div class="flex items-center gap-1">
              <UserMacro value={macro} />
            </div>
          </Command.Item>
        {/each}
        {#each users as user}
          <Command.Item
            value={user?.user.id}
            onSelect={(currentValue) => {
              value = currentValue === value ? null : currentValue
              closeAndFocusTrigger(ids.trigger)
              onValueChange(value)
            }}
          >
            <Check class={cn("mr-2 h-4 w-4", value !== user?.user.id && "text-transparent")} />
            <div class="flex items-center gap-1">
              <Avatar.Root>
                <Avatar.Image src={user?.user.avatar} alt={user?.user.username} />
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
