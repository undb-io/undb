<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import type { FormVO } from "@undb/table"
  import FieldControl from "../field-control/field-control.svelte"
  import FormFieldOptions from "./form-field-options.svelte"
  import { cn } from "$lib/utils"

  const table = getTable()

  $: schema = $table.schema.fieldMapById

  let selectedFieldId: string | undefined = undefined

  export let form: FormVO

  $: formFields = form.fields.props
</script>

<div class="h-full w-full p-6">
  <div class="mx-auto max-w-[600px] space-y-2">
    {#each formFields as formField}
      {@const field = schema.get(formField.fieldId)}
      {#if field}
        {@const isSelected = selectedFieldId === field.id.value}
        <label class="block">
          <input type="radio" class="hidden" bind:group={selectedFieldId} value={field.id.value} />
          <div
            class={cn(
              "space-y-2 rounded-md border border-transparent p-0 transition-all",
              isSelected ? "border-primary shadow-md" : "hover:bg-muted/50 hover:shadow-sm",
            )}
          >
            <div class="space-y-2 p-4">
              <div class="flex items-center gap-2 text-xl font-semibold">
                {field.name.value}
                {#if formField.getRequired(field)}
                  <span class="text-red-500">*</span>
                {/if}
              </div>
              <FieldControl {field} value={undefined} class="bg-background" />
            </div>
            {#if isSelected}
              <FormFieldOptions {field} {formField} />
            {/if}
          </div>
        </label>
      {/if}
    {/each}
  </div>
</div>
