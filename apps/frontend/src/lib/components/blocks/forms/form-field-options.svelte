<script lang="ts">
  import type { FormFieldVO, Field } from "@undb/table"
  import { Switch } from "$lib/components/ui/switch"
  import { Label } from "$lib/components/ui/label"

  export let formField: FormFieldVO
  export let field: Field
</script>

<div class="flex h-12 items-center justify-between rounded-b-md border-t bg-zinc-100 px-4">
  <div></div>

  <div>
    <Label class="flex items-center gap-2">
      <Switch class="text-sm" bind:checked={formField.required} disabled={field.required} />
      <span>required</span>
    </Label>
  </div>
</div>
