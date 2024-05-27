<script lang="ts">
  import type { FormFieldVO, Field, FormVO } from "@undb/table"
  import { Switch } from "$lib/components/ui/switch"
  import { Label } from "$lib/components/ui/label"
  import { Trash2Icon } from "lucide-svelte"
  import FieldIcon from "../field-icon/field-icon.svelte"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { getTable } from "$lib/store/table.store"
  import { tick } from "svelte"
  import { EyeClosed, EyeOpen } from "svelte-radix"

  const table = getTable()

  export let formField: FormFieldVO
  export let form: FormVO
  export let field: Field

  const setFormMutation = createMutation({
    mutationFn: trpc.table.form.set.mutate,
  })

  const setForm = async () => {
    await tick()
    $setFormMutation.mutate({
      tableId: $table.id.value,
      form: form.toJSON(),
    })
  }
</script>

<div class="flex items-center justify-between rounded-b-md border-t bg-neutral-50 px-4 py-2 text-xs">
  <div class="text-muted-foreground flex items-center gap-2 text-xs">
    <FieldIcon type={field.type} class="h-3 w-3" />
    <span>
      {field.name.value}
    </span>
  </div>

  <div class="flex items-center gap-3">
    <Label class="flex items-center gap-2 text-xs">
      <Switch class="text-sm" bind:checked={formField.required} disabled={field.required} on:click={() => setForm()} />
      <span>required</span>
    </Label>

    <label class="cursor-pointer">
      <input
        type="checkbox"
        class="hidden"
        bind:checked={formField.hidden}
        disabled={formField.required}
        on:change={setForm}
      />
      {#if formField.hidden}
        <EyeOpen class="h-4 w-4" />
      {:else}
        <EyeClosed class="h-4 w-4" />
      {/if}
    </label>
  </div>
</div>
