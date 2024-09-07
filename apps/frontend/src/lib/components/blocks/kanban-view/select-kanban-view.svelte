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
  import { getTable } from "$lib/store/table.store"
  import SelectKanbanLane from "./select-kanban-lane.svelte"
  import { arrayMoveImmutable } from "array-move"
  import { isNumber } from "radash"
  import Option from "../option/option.svelte"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import { GripVerticalIcon, PlusIcon } from "lucide-svelte"
  import { Button } from "$lib/components/ui/button"
  import * as Popover from "$lib/components/ui/popover"
  import OptionEditor from "../option/option-editor.svelte"

  const table = getTable()
  export let view: KanbanView
  export let readonly = false

  let fieldId = view.field.unwrapUnchecked()!
  let field = $table.schema.getFieldById(new FieldIdVo(fieldId)).into(undefined) as SelectField

  let lanesContainer: HTMLElement
  let options = field.options

  const updateFieldMudation = createMutation({
    mutationFn: trpc.table.field.update.mutate,
    mutationKey: ["table", $table.id.value, "field", fieldId, "update"],
    onError(e) {
      toast.error(e.message)
    },
  })

  onMount(() => {
    new Sortable(lanesContainer, {
      animation: 150,
      ghostClass: "bg-gray-200",
      handle: ".lane-handle", // 添加一个句柄类，用于拖拽
      onEnd: (evt) => {
        const { oldIndex, newIndex } = evt
        if (oldIndex !== newIndex && isNumber(oldIndex) && isNumber(newIndex)) {
          options = arrayMoveImmutable(options, oldIndex, newIndex)
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
  })

  let name: string
  let color: IColors

  const createOption = () => {
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
  <div bind:this={lanesContainer} class="flex h-full overflow-y-hidden pr-4">
    {#each options as option (option.id)}
      <div
        data-option-id={option.id}
        class="kanban-lane flex w-[350px] shrink-0 flex-col space-y-2 rounded-sm px-2 pt-2 transition-all"
      >
        <div class="flex w-full items-center gap-1">
          <div class="lane-handle cursor-move">
            <GripVerticalIcon class="text-muted-foreground h-4 w-4" />
          </div>
          <Option {option} />
        </div>
        <SelectKanbanLane {readonly} tableId={$table.id.value} viewId={view.id.value} {fieldId} {option} />
      </div>
    {/each}
    <div class="flex w-[350px] shrink-0 flex-col space-y-2 rounded-sm px-2 pt-2 transition-all">
      <Popover.Root>
        <Popover.Trigger asChild let:builder>
          <Button variant="outline" size="sm" class="w-full" builders={[builder]}>
            <PlusIcon class="h-4 w-4" />
            Create New Option
          </Button>
        </Popover.Trigger>
        <Popover.Content sameWidth>
          <OptionEditor bind:name bind:color />
          <Button
            disabled={!name || !color || $updateFieldMudation.isPending}
            class="mt-2 w-full"
            on:click={createOption}
          >
            Create
          </Button>
        </Popover.Content>
      </Popover.Root>
    </div>
  </div>
</div>
