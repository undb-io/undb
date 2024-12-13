<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox"
  import { trpc } from "$lib/trpc/client"
  import { cn } from "$lib/utils"
  import { createMutation } from "@tanstack/svelte-query"
  import type { CheckboxField } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { getDataService } from "$lib/store/data-service.store"

  export let tableId: string
  export let field: CheckboxField
  export let value: boolean = false
  export let recordId: string
  export let readonly = false
  export let onValueChange: (value: boolean) => void

  const dataService = getDataService()

  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: dataService.records.updateRecord,
    onError(error: Error) {
      toast.error(error.message)
    },
  })
</script>

<div class={cn($$restProps.class, "flex items-center justify-center")}>
  <Checkbox
    disabled={readonly}
    bind:checked={value}
    onCheckedChange={(checked) => {
      onValueChange(!!checked)
      $updateCell.mutate({
        tableId,
        id: recordId,
        values: { [field.id.value]: checked },
      })
    }}
  />
</div>
