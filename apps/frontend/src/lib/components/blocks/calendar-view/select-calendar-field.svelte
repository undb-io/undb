<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js"
  import type { CalendarView } from "@undb/table"
  import SelectCalendarFieldForm from "./select-calendar-field-form.svelte"
  import { LL } from "@undb/i18n/client"

  export let view: CalendarView
</script>

<Card.Root class="w-[450px]">
  <Card.Header>
    <Card.Title>{$LL.table.view.calendar.selectField()}</Card.Title>
    <Card.Description>{$LL.table.view.calendar.select()}</Card.Description>
  </Card.Header>
  <Card.Content class="space-y-4">
    <SelectCalendarFieldForm bind:view />
  </Card.Content>
</Card.Root>
