<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js"
  import { ImagesIcon } from "lucide-svelte"
  import {
    FieldIdVo,
    type RecordDO,
    type AttachmentField,
    AttachmentFieldValue,
    type Field,
    ViewColor,
  } from "@undb/table"
  import { getTable } from "$lib/store/table.store"
  import FieldValue from "../field-value/field-value.svelte"
  import { getBgColor } from "../grid-view/grid-view.util"
  import { cn } from "$lib/utils"
  import type { Writable } from "svelte/store"

  const table = getTable()
  export let record: RecordDO
  export let fields: Field[]
  export let r: Writable<string | null>
  export let readonly: boolean = false

  let values = record.flatten()
  let displayValues = record.displayValues?.toJSON() ?? {}

  export let fieldId: string | undefined

  let field = (fieldId ? $table.schema.getFieldById(new FieldIdVo(fieldId)).into(undefined) : undefined) as
    | AttachmentField
    | undefined
  $: fieldValues = (fieldId ? record.getValue(new FieldIdVo(fieldId)).into(undefined) : undefined) as
    | AttachmentFieldValue
    | undefined
  $: images = fieldValues?.getImages() ?? []

  export let color: ViewColor | undefined
  $: colorSpec = color?.getSpec($table.schema).into(undefined)
  $: isMatch = colorSpec ? record.match(colorSpec) : false
  $: condition = isMatch ? color?.getMatchedFieldConditions($table, record)[0] : undefined
</script>

<div class="group col-span-1 flex flex-col rounded-md border bg-white shadow-sm transition-all hover:shadow-lg">
  {#if field}
    {#if images.length > 0}
      <Carousel.Root class="h-[150px] w-full overflow-hidden border-b bg-gray-100">
        <Carousel.Content>
          {#each images as image}
            <Carousel.Item>
              <img src={image.signedUrl} alt="" class="h-full w-full object-cover" />
            </Carousel.Item>
          {/each}
        </Carousel.Content>
        <Carousel.Previous class="absolute left-2 top-1/2 hidden group-hover:flex" />
        <Carousel.Next class="absolute right-2 top-1/2 hidden group-hover:flex" />
      </Carousel.Root>
    {:else}
      <div class="flex h-[150px] w-full shrink-0 items-center justify-center border-b bg-gray-100">
        <ImagesIcon class="text-muted-foreground/50 h-10 w-10" />
      </div>
    {/if}
  {/if}
  <button
    on:click={() => ($r = record.id.value)}
    class={cn("relative flex flex-1 flex-col space-y-2 px-2 py-3", isMatch && "pl-3")}
  >
    {#if isMatch}
      <div class={cn("absolute left-0 top-0 h-full w-1", condition && getBgColor(condition.option.color))}></div>
    {/if}
    {#each fields.filter((f) => f.id.value !== fieldId) as field, idx}
      <div class="flex w-full">
        <FieldValue
          class={cn(idx === 0 && "font-semibold")}
          {r}
          {field}
          tableId={$table.id.value}
          recordId={record.id.value}
          value={values[field.id.value]}
          type={field.type}
          displayValue={displayValues[field.id.value]}
          {readonly}
        />
      </div>
    {/each}
  </button>
</div>
