<script lang="ts">
  import { TableDo, isMaybeFieldFilter, isMaybeGroup, type MaybeFieldFilter, type MaybeFilterGroup } from "@undb/table"
  import FilterField from "./filter-field.svelte"
  import OpPicker from "./op-picker.svelte"
  import FilterValue from "./filter-value.svelte"
  import Button from "$lib/components/ui/button/button.svelte"
  import { FieldIdVo } from "@undb/table/src/modules/schema/fields/field-id.vo"
  import { cn } from "$lib/utils"
  import { GripVertical, PlusIcon, Trash2Icon } from "lucide-svelte"
  import { SortableList } from "@jhubbardsf/svelte-sortablejs"
  import ConjunctionPicker from "./conjunction-picker.svelte"
  import { uid } from "radash"

  export let table: TableDo
  export let value: MaybeFilterGroup | undefined = undefined
  export let level = 1

  $: isEven = level % 2 === 0

  function addFilter() {
    const filter: MaybeFieldFilter = {
      id: uid(10),
      fieldId: table.schema.fields.at(0)?.id.value,
      op: undefined,
      value: undefined,
    }
    if (!value) {
      value = { children: [filter], conjunction: "and", id: uid(10) }
    } else {
      value.children = [...value.children, filter]
    }
  }

  function addFilterGroup() {
    const filterGroup: MaybeFilterGroup = {
      id: uid(10),
      conjunction: "and",
      children: [],
    }
    if (!value) {
      value = { children: [filterGroup], conjunction: "and", id: uid(10) }
    } else {
      value.children = [...value.children, filterGroup]
    }
  }

  function removeFilter(index: number) {
    if (value) {
      value.children.splice(index, 1)
      value.children = [...value.children]
    }
  }

  function swapFilter(oldIndex: number, newIndex: number) {
    if (value) {
      const filters = [...value.children]
      const [removed] = filters.splice(oldIndex, 1)
      filters.splice(newIndex, 0, removed)
      value.children = [...filters]
    }
  }
</script>

<div class={cn("space-y-2", isEven ? "bg-muted" : "bg-popover")} data-level={level}>
  {#if value?.children.length}
    <SortableList
      class={cn("space-y-1.5", level > 1 ? "p-4 pb-2" : "px-4 py-2")}
      animation={200}
      onEnd={(event) => {
        if (event.oldIndex && event.newIndex) {
          swapFilter(event.oldIndex - 1, event.newIndex - 1)
        }
      }}
    >
      {#each value.children as child, i (child.id)}
        {#if isMaybeFieldFilter(child)}
          {@const field = child.fieldId
            ? table.schema.getFieldById(new FieldIdVo(child.fieldId)).into(undefined)
            : undefined}
          <div class="grid grid-cols-12 items-center gap-2">
            {#if i === 0}
              <div class="col-span-2 text-center text-xs">Where</div>
            {:else}
              <ConjunctionPicker
                disabled={i !== 1}
                class="col-span-2 bg-white text-center text-xs"
                bind:value={value.conjunction}
              />
            {/if}
            <div class="col-span-9 grid grid-cols-12 items-center">
              <FilterField
                bind:value={child.fieldId}
                class={cn(!!child.fieldId && "col-span-4 rounded-r-none border-r-0")}
              />
              <OpPicker {field} bind:value={child.op} class="col-span-3 rounded-l-none" />
              <FilterValue
                {field}
                bind:value={child.value}
                bind:op={child.op}
                class="col-span-5 bg-white text-xs font-medium"
              />
            </div>
            <div class="col-span-1 flex items-center gap-2">
              <button on:click={() => removeFilter(i)}>
                <Trash2Icon class="text-muted-foreground h-3 w-3" />
              </button>
              <button class="handler">
                <GripVertical class="text-muted-foreground h-3 w-3" />
              </button>
            </div>
          </div>
        {:else if isMaybeGroup(child)}
          <div class="space-y-2">
            <div class="grid grid-cols-12 gap-2">
              <ConjunctionPicker
                disabled={i !== 1}
                class="col-span-2 bg-white text-center text-xs"
                bind:value={value.conjunction}
              />
              <div class="col-span-9"></div>
              <div class="col-span-1 flex items-center gap-2">
                <button on:click={() => removeFilter(i)}>
                  <Trash2Icon class="text-muted-foreground h-3 w-3" />
                </button>
                <button class="handler">
                  <GripVertical class="text-muted-foreground h-3 w-3" />
                </button>
              </div>
            </div>
            <svelte:self bind:value={child} {table} level={level + 1} />
          </div>
        {/if}
      {/each}
    </SortableList>
  {/if}
  <div class={cn("flex justify-between border-t px-4", value?.children.length ? "py-2" : "py-4")}>
    <div class="flex items-center gap-2">
      <Button variant="ghost" size="xs" on:click={addFilter}>
        <PlusIcon class="mr-2 h-3 w-3" />
        Add Filter
      </Button>
      {#if level < 3}
        <Button variant="ghost" class="text-muted-foreground" size="xs" on:click={addFilterGroup}>
          <PlusIcon class="mr-2 h-3 w-3" />
          Add Filter Group
        </Button>
      {/if}
    </div>

    <slot name="footer" />
  </div>
</div>
