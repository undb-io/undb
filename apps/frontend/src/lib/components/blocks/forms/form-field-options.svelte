<script lang="ts">
  import type { FormFieldVO, Field } from "@undb/table"
  import { Switch } from "$lib/components/ui/switch"
  import { Label } from "$lib/components/ui/label"
  import { Trash2Icon } from "lucide-svelte"

  export let formField: FormFieldVO
  export let field: Field
</script>

<div class="flex h-12 items-center justify-between rounded-b-md border-t bg-neutral-50 px-4">
  <div></div>

  <div class="flex items-center gap-3">
    <Label class="flex items-center gap-2">
      <Switch class="text-sm" bind:checked={formField.required} disabled={field.required} />
      <span>required</span>
    </Label>

    <button>
      <Trash2Icon class="text-muted-foreground h-4 w-4" />
    </button>
  </div>
</div>
