<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { Switch } from "$lib/components/ui/switch"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import * as Popover from "$lib/components/ui/popover"
  import { getTable } from "$lib/store/table.store"
  import { FieldIdVo } from "@undb/table"
  import { ListIcon, GripVerticalIcon } from "lucide-svelte"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { tick } from "svelte"
  import { invalidate } from "$app/navigation"

  const table = getTable()
  $: viewFields = $table.getViewFields().props

  let open = false

  const client = useQueryClient()
  const setViewFieldsMutation = createMutation({
    mutationFn: trpc.table.view.setFields.mutate,
    mutationKey: ["table", $table.id.value, "setFields"],
    onSuccess(data, variables, context) {
      invalidate(`table:${$table.id.value}`)
      client.invalidateQueries({ queryKey: ["records", $table.id.value] })
    },
  })

  const setViewFields = async () => {
    await tick()
    $setViewFieldsMutation.mutate({
      tableId: $table.id.value,
      viewId: $table.views.getViewById().id.value,
      fields: viewFields,
    })
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger asChild let:builder>
    <Button variant={open ? "secondary" : "ghost"} builders={[builder]} size="sm">
      <ListIcon class="mr-2 h-4 w-4" />
      Fields
    </Button>
  </Popover.Trigger>
  <Popover.Content class="p-2">
    {#each viewFields as viewField}
      {@const field = $table.schema.getFieldById(new FieldIdVo(viewField.fieldId)).into(undefined)}
      {#if field}
        <div class="hover:bg-muted flex items-center justify-between rounded-sm p-2 transition-colors">
          <div class="flex items-center gap-2">
            <Switch
              checked={!viewField.hidden}
              onCheckedChange={(checked) => {
                viewField.hidden = !checked
                setViewFields()
              }}
            />
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <FieldIcon type={field.type} class="h-3 w-3" />
              {field.name.value}
            </div>
          </div>
          <button class="text-muted-foreground">
            <GripVerticalIcon class="h-3 w-3" />
          </button>
        </div>
      {/if}
    {/each}
  </Popover.Content>
</Popover.Root>
