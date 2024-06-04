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
  import { Trash2Icon } from "lucide-svelte"

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
          {rls.subject.value}
        </span>
        <span
          class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-blue-700/10"
        >
          {rls.action.value}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <div class="flex items-center space-x-2">
          <Switch id="enabled" bind:checked={rls.enabled} on:click={setTableRLS} />
          <Label for="enabled">Enabled</Label>
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <button>
              <DotsHorizontal class="text-muted-foreground h-4 w-4" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content class="w-[200px]">
            <DropdownMenu.Item
              class="hover:text-500 flex items-center text-xs text-red-500 transition-colors hover:bg-red-100"
            >
              <Trash2Icon class="mr-2 h-3 w-3" />
              Delete Policy
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>

    <div class="space-y-2">
      {#if rls.condition.isSome()}
        <div class="rounded-sm bg-gray-50 px-3 py-3 pt-1 shadow-inner">
          <span class="text-sm font-semibold">Condition</span>
          <ConditionGroup table={$table} value={rls.condition.unwrap().props} />
        </div>
      {/if}
      {#if rls.updateCondition.isSome()}
        <div class="rounded-sm bg-gray-50 px-3 py-3 pt-1 shadow-inner">
          <span class="text-sm font-semibold">Update Condition</span>
          <ConditionGroup table={$table} value={rls.updateCondition.unwrap().props} />
        </div>
      {/if}
    </div>
  </Card.Content>
</Card.Root>
