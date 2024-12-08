<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox"
  import { trpc } from "$lib/trpc/client"
  import { cn } from "$lib/utils"
  import { createMutation } from "@tanstack/svelte-query"
  import type { CheckboxField } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { getIsLocal, getDataService } from "$lib/store/data-service.store"
  import { getIsPlayground } from "$lib/store/playground.svelte"
  import { type IUpdateRecordCommand } from "@undb/commands"

  export let tableId: string
  export let field: CheckboxField
  export let value: boolean = false
  export let recordId: string
  export let readonly = false
  export let onValueChange: (value: boolean) => void

  const isLocal = getIsLocal()
  const isPlayground = getIsPlayground()

  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: async (command: IUpdateRecordCommand) => {
      const dataService = await getDataService(isLocal, isPlayground)
      return dataService.records.updateRecord(command)
    },
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
