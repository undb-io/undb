<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { Switch } from "$lib/components/ui/switch"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import * as Popover from "$lib/components/ui/popover"
  import { getTable, viewId } from "$lib/store/table.store"
  import { FieldIdVo } from "@undb/table"
  import { ListIcon, GripVerticalIcon } from "lucide-svelte"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { tick } from "svelte"
  import { invalidate } from "$app/navigation"
  import { SortableList } from "@jhubbardsf/svelte-sortablejs"
  import { cn } from "$lib/utils"
  import { isNumber } from "radash"

  const table = getTable()
  $: fields = $table.getOrderedFields(undefined, $viewId)
  $: viewFieldsVo = $table.getViewFields($viewId)
  $: viewFields = viewFieldsVo.props.filter((viewField) => fields.some((field) => field.id.value === viewField.fieldId))
  $: hiddenCount = viewFieldsVo.getHiddenFieldsCount()
  $: visibleCount = viewFieldsVo.getVisibleFieldsCount()

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
      viewId: $viewId,
      fields: [...viewFields],
    })
  }

  function swapFields(oldIndex: number, newIndex: number) {
    const fields = [...viewFields]
    const [removed] = fields.splice(oldIndex, 1)
    fields.splice(newIndex, 0, removed)
    viewFields = [...fields]

    setViewFields()
  }

  $: viewOption = $table.getViewOption()

  const setViewOptionMutation = createMutation({
    mutationFn: trpc.table.view.setOption.mutate,
    mutationKey: ["table", $table.id.value, "setOption"],
    onSuccess(data, variables, context) {
      invalidate(`table:${$table.id.value}`)
      client.invalidateQueries({ queryKey: ["records", $table.id.value] })
    },
  })

  const setViewOption = async () => {
    await tick()
    $setViewOptionMutation.mutate({
      tableId: $table.id.value,
      viewId: $table.views.getViewById($viewId).id.value,
      option: viewOption.toJSON(),
    })
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger asChild let:builder>
    <Button variant={open || !!hiddenCount ? "secondary" : "ghost"} builders={[builder]} size="sm">
      <ListIcon class="mr-2 h-4 w-4" />
      {#if !!hiddenCount}
        {hiddenCount} Fields hidden
      {:else}
        Fields
      {/if}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="p-2">
    <div>
      <SortableList
        class="pb-2"
        animation={200}
        handle=".handler"
        onEnd={(event) => {
          if (isNumber(event.oldIndex) && isNumber(event.newIndex)) {
            swapFields(event.oldIndex, event.newIndex)
          }
        }}
      >
        {#each viewFields as viewField}
          {@const field = $table.schema.getFieldById(new FieldIdVo(viewField.fieldId)).into(undefined)}
          {#if field}
            <div class="hover:bg-muted flex items-center justify-between rounded-sm p-2 transition-colors">
              <div class="flex items-center gap-2">
                <Switch
                  disabled={visibleCount === 1}
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
              <button class="text-muted-foreground handler">
                <GripVerticalIcon class="h-3 w-3" />
              </button>
            </div>
          {/if}
        {/each}
      </SortableList>

      <div class="-mx-2 border-t px-4 pt-2">
        <div class="flex items-center gap-2">
          <Switch bind:checked={viewOption.showSystemFields} on:click={setViewOption} />
          <span class="text-muted-foreground text-xs"> Show system fields </span>
        </div>
      </div>
    </div>
  </Popover.Content>
</Popover.Root>
