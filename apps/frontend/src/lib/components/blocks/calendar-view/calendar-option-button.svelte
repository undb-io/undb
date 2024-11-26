<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { CalendarIcon } from "lucide-svelte"
  import * as Dropdown from "$lib/components/ui/dropdown-menu"
  import { FieldIdVo, type CalendarView } from "@undb/table"
  import CalendarFieldForm from "./calendar-field-form.svelte"
  import { getTable } from "$lib/store/table.store"
  import FieldIcon from "../field-icon/field-icon.svelte"
  import { LL } from "@undb/i18n/client"

  const table = getTable()
  export let view: CalendarView
  export let readonly = false

  let fieldId = view.field.into(undefined)

  let field = fieldId ? $table.schema.getFieldById(new FieldIdVo(fieldId)).into(undefined) : undefined
</script>

<Dropdown.Root>
  <Dropdown.Trigger asChild let:builder>
    <Button variant="ghost" size="sm" class="group gap-1" builders={[builder]} {...$$restProps}>
      <CalendarIcon class="text-muted-foreground mr-2 h-4 w-4 font-semibold" />
      {$LL.table.view.calendar.calendar()}
      {#if field}
        <span class="inline-flex items-center gap-1 rounded-sm bg-gray-100 px-1.5 py-0.5 group-hover:bg-gray-200">
          <FieldIcon type={field.type} {field} class="size-3 text-gray-700" />
          {field.name.value}
        </span>
      {/if}
    </Button>
  </Dropdown.Trigger>
  <Dropdown.Content class="w-[400px] p-2">
    <Dropdown.Label>
      {#if !readonly}
        {$LL.table.view.calendar.update()}
      {:else}
        {$LL.table.view.calendar.view()}
      {/if}
    </Dropdown.Label>
    <CalendarFieldForm bind:view {readonly} />
  </Dropdown.Content>
</Dropdown.Root>
