<script lang="ts">
  import { onMount } from "svelte"
  import Sortable from "sortablejs"
  import {
    FieldIdVo,
    type IColors,
    type IUpdateSelectFieldDTO,
    type KanbanView,
    type SelectField,
    OptionIdVo,
  } from "@undb/table"
  import type { Readable } from "svelte/store"
  import { getTable } from "$lib/store/table.store"
  import SelectKanbanLane from "./select-kanban-lane.svelte"
  import { arrayMoveImmutable } from "array-move"
  import { isNumber } from "radash"
  import { createMutation } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import { PlusIcon } from "lucide-svelte"
  import { Button } from "$lib/components/ui/button"
  import * as Popover from "$lib/components/ui/popover"
  import OptionEditor from "../option/option-editor.svelte"
  import { invalidate } from "$app/navigation"
  import type { Writable } from "svelte/store"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"

  const table = getTable()

  export let viewId: Readable<string | undefined>
  export let view: KanbanView
  export let readonly = false
  export let shareId: string | undefined = undefined
  export let disableRecordQuery = false
  export let r: Writable<string | null>

  let fieldId = view.field.unwrapUnchecked()!
  let field = $table.schema.getFieldById(new FieldIdVo(fieldId)).into(undefined) as SelectField

  let lanesContainer: HTMLElement
  $: options = field.options ?? []

  const dataService = getDataService()

  const updateFieldMudation = createMutation({
    mutationFn: dataService.table.field.updateField,
    mutationKey: ["table", $table.id.value, "field", fieldId, "update"],
    async onSuccess(data) {
      await invalidate(`undb:table:${$table.id.value}`)
    },
    onError(e) {
      toast.error(e.message)
    },
  })

  onMount(() => {
    if (!shareId) {
      new Sortable(lanesContainer, {
        animation: 150,
        ghostClass: "bg-gray-100",
        handle: ".lane-handle", // 添加一个句柄类，用于拖拽
        onEnd: (evt) => {
          const { oldIndex, newIndex } = evt
          if (oldIndex !== newIndex && isNumber(oldIndex) && isNumber(newIndex)) {
            options = arrayMoveImmutable(options, oldIndex - 1, newIndex - 1)
            $updateFieldMudation.mutate({
              tableId: $table.id.value,
              field: {
                id: fieldId,
                name: field.name.value,
                type: "select",
                option: {
                  ...field.option,
                  options: options,
                },
              } satisfies IUpdateSelectFieldDTO,
            })
          }
        },
      })
    }
  })

  let name: string
  let color = field.getNextColor()

  const createOption = () => {
    if (shareId) {
      return
    }
    options = [...options, { id: OptionIdVo.create().value, name, color }]
    $updateFieldMudation.mutate({
      tableId: $table.id.value,
      field: {
        id: fieldId,
        name: field.name.value,
        type: "select",
        option: {
          options: options,
        },
      },
    })
  }
</script>

<div class="flex-1 overflow-x-auto overflow-y-hidden p-4">
  <div bind:this={lanesContainer} class="flex h-full space-x-2 overflow-y-hidden pr-2">
    <SelectKanbanLane
      {field}
      {readonly}
      tableId={$table.id.value}
      {viewId}
      {fieldId}
      option={null}
      {shareId}
      {view}
      {disableRecordQuery}
      {r}
    />
    {#each options as option (option.id)}
      <SelectKanbanLane
        {field}
        {readonly}
        tableId={$table.id.value}
        {viewId}
        {fieldId}
        {option}
        {shareId}
        {view}
        {disableRecordQuery}
        {r}
      />
    {/each}
    {#if !shareId && !readonly}
      <div class="flex w-[350px] shrink-0 flex-col space-y-2 rounded-sm px-2 pt-2 transition-all">
        <Popover.Root>
          <Popover.Trigger asChild let:builder>
            <Button variant="outline" size="sm" class="w-full" builders={[builder]}>
              <PlusIcon class="mr-2 h-4 w-4" />
              {$LL.table.field.select.option.create()}
            </Button>
          </Popover.Trigger>
          <Popover.Content sameWidth>
            <OptionEditor bind:name bind:color />
            <Button
              size="sm"
              disabled={!name || !color || $updateFieldMudation.isPending}
              class="mt-2 w-full"
              on:click={createOption}
            >
              {$LL.common.create()}
            </Button>
          </Popover.Content>
        </Popover.Root>
      </div>
    {/if}
  </div>
</div>
