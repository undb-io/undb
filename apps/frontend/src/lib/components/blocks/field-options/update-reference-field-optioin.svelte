<script lang="ts">
  import {
    getIsFilterableFieldType,
    parseValidViewFilter,
    TableFactory,
    toMaybeConditionGroup,
    type IReferenceFieldConstraint,
    type IUpdateReferenceFieldDTO,
    type IViewFilterOptionSchema,
    type MaybeConditionGroup,
  } from "@undb/table"
  import NumberInput from "$lib/components/ui/input/number-input.svelte"
  import { Label } from "$lib/components/ui/label/index.js"
  import ForeignTablePicker from "../reference/foreign-table-picker.svelte"
  import { ExternalLinkIcon } from "lucide-svelte"
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte"
  import { Separator } from "$lib/components/ui/separator"
  import FiltersEditor from "../filters-editor/filters-editor.svelte"
  import { writable } from "svelte/store"
  import autoAnimate from "@formkit/auto-animate"
  import { onMount } from "svelte"
  import { isEqual } from "radash"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"
  import { createQuery } from "@tanstack/svelte-query"

  export let constraint: IReferenceFieldConstraint | undefined = {
    required: false,
  }
  export let option: Partial<IUpdateReferenceFieldDTO["option"]> = {
    foreignTableId: undefined,
    symmetricFieldId: undefined,
    condition: undefined,
  }
  export let disabled: boolean = false

  let allowCondition: boolean = !!option.condition

  const dataService = getDataService()

  const getForeignTable = createQuery({
    queryFn: async () => {
      return dataService.table.getTable({ tableId: option.foreignTableId! })
    },
    queryKey: ["getForeignTable", option.foreignTableId],
    enabled: !!option.foreignTableId,
  })

  $: if (option.foreignTableId) $getForeignTable.refetch()

  $: ft = $getForeignTable.data

  // @ts-ignore
  $: foreignTable = ft ? new TableFactory().fromJSON(ft) : undefined

  const value = writable<MaybeConditionGroup<IViewFilterOptionSchema> | undefined>()
  onMount(() => {
    if (option.condition) {
      value.set(toMaybeConditionGroup(option.condition))
    }
  })
  $: if ($value && foreignTable) {
    const validValue = parseValidViewFilter(foreignTable.schema, $value)
    if (!isEqual(validValue, option.condition)) {
      option.condition = validValue
    }
  }
</script>

<div class="space-y-2">
  {#if option}
    <div class="space-y-1">
      <Label class="text-muted-foreground flex items-center text-xs font-normal">
        <ExternalLinkIcon class="mr-2 h-3 w-3" />
        {$LL.table.field.reference.foreignTable()}
      </Label>
      <ForeignTablePicker disabled bind:value={option.foreignTableId} class="text-xs" />
    </div>
  {/if}
  {#if constraint}
    <div class="grid grid-cols-2 gap-2">
      <div class="space-y-1">
        <Label for="min" class="text-xs font-normal">
          {$LL.table.field.reference.min()}
        </Label>
        <NumberInput
          {disabled}
          id="min"
          min={0}
          max={constraint.max}
          step={1}
          bind:value={constraint.min}
          placeholder={$LL.table.field.reference.minPlaceholder()}
          class="bg-background text-xs"
        />
      </div>
      <div class="space-y-1">
        <Label for="max" class="text-xs font-normal">
          {$LL.table.field.reference.max()}
        </Label>
        <NumberInput
          {disabled}
          id="max"
          min={constraint.min || 0}
          step={1}
          bind:value={constraint.max}
          placeholder={$LL.table.field.reference.maxPlaceholder()}
          class="bg-background text-xs"
        />
      </div>
    </div>

    <div class="pt-2">
      <Separator />
    </div>
    <div class="flex items-center space-x-2">
      <Checkbox {disabled} id="required" bind:checked={constraint.required} />
      <Label for="required" class="text-xs font-normal">
        {$LL.table.field.defaultValue.markAsRequired()}
      </Label>
    </div>
  {/if}

  <div class="space-y-2">
    <div class="flex items-center space-x-2">
      <Checkbox
        {disabled}
        id="condition"
        bind:checked={allowCondition}
        onCheckedChange={(checked) => {
          if (!checked) {
            option.condition = undefined
            value.set(undefined)
          }
        }}
      />
      <Label for="condition" class="text-xs font-normal">
        {$LL.table.field.reference.limitRecordSelectionToCondition()}
      </Label>
    </div>

    <div use:autoAnimate>
      {#if allowCondition && foreignTable}
        <FiltersEditor
          {disabled}
          bind:value={$value}
          class="rounded-sm border"
          sameWidth={false}
          table={foreignTable}
          filter={(field) => getIsFilterableFieldType(field.type)}
        />
      {/if}
    </div>
  </div>
</div>
