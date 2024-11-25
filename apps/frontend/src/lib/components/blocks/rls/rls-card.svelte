<script lang="ts">
  import * as Card from "$lib/components/ui/card"
  import { Label } from "$lib/components/ui/label/index.js"
  import { Switch } from "$lib/components/ui/switch/index.js"
  import { DotsHorizontal } from "svelte-radix"
  import { createMutation } from "@tanstack/svelte-query"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { tick } from "svelte"
  import type { TableRLS } from "@undb/table"
  import ConditionGroup from "../filters-editor/condition-group.svelte"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { PencilIcon, Trash2Icon } from "lucide-svelte"
  import * as Dialog from "$lib/components/ui/dialog"
  import UpdateRls from "./update-rls.svelte"
  import { LL } from "@undb/i18n/client"

  const table = getTable()
  export let rls: TableRLS

  const setRLSMutation = createMutation({
    mutationKey: ["table", $table.id.value, "rls", "set"],
    mutationFn: trpc.table.rls.set.mutate,
  })

  const setTableRLS = async () => {
    await tick()
    $setRLSMutation.mutate({
      tableId: $table.id.value,
      rls: rls.toJSON(),
    })
  }
</script>

<Card.Root>
  <Card.Content class="grid gap-3 py-4">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <span>
          {rls.name}
        </span>
        <span
          class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
        >
          {$LL.table.authz.subject[rls.subject.value]()}
        </span>
        {#if !rls.allow}
          <span
            class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10"
          >
            {$LL.table.authz.notAllow()}
          </span>
        {/if}
        <span
          class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-blue-700/10"
        >
          {$LL.table.authz.actions[rls.action.value]()}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <div class="flex items-center space-x-2">
          <Switch size="sm" id="enabled" bind:checked={rls.enabled} on:click={setTableRLS} />
          <Label for="enabled" class="text-xs">{$LL.common.enabled()}</Label>
        </div>

        <Dialog.Root>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <DotsHorizontal class="text-muted-foreground h-4 w-4" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="w-[200px]">
              <Dialog.Trigger class="w-full">
                <DropdownMenu.Item class="text-xs">
                  <PencilIcon class="mr-2 h-3 w-3" />
                  {$LL.table.authz.policy.update()}
                </DropdownMenu.Item>
              </Dialog.Trigger>

              <DropdownMenu.Item
                class="hover:text-500 flex items-center text-xs text-red-500 transition-colors hover:bg-red-100"
              >
                <Trash2Icon class="mr-2 h-3 w-3" />
                {$LL.table.authz.policy.delete()}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title class="flex items-center">
                <PencilIcon class="mr-2 h-6 w-6" />
                {$LL.table.authz.updateRLS()}
              </Dialog.Title>
            </Dialog.Header>

            <UpdateRls {rls} />
          </Dialog.Content>
        </Dialog.Root>
      </div>
    </div>

    <div class="space-y-2">
      {#if rls.condition.isSome()}
        <div class="rounded-sm bg-gray-50 px-3 py-3 pt-1 shadow-inner">
          <span class="text-sm font-semibold">{$LL.table.authz.matchesConditions()}</span>
          <ConditionGroup table={$table} value={rls.condition.unwrap().props} />
        </div>
      {/if}
      {#if rls.updateCondition.isSome()}
        <div class="rounded-sm bg-gray-50 px-3 py-3 pt-1 shadow-inner">
          <span class="text-sm font-semibold">{$LL.table.authz.updateCondition()}</span>
          <ConditionGroup table={$table} value={rls.updateCondition.unwrap().props} />
        </div>
      {/if}
    </div>
  </Card.Content>
</Card.Root>
