<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import type { FormVO } from "@undb/table"
  import FieldIcon from "../field-icon/field-icon.svelte"
  import { Switch } from "$lib/components/ui/switch"

  const table = getTable()

  $: schema = $table.schema.fieldMapById

  export let form: FormVO
</script>

<div class="h-full w-full px-8 py-6">
  <div class="divide-y rounded-sm border">
    {#each form.fields.props as formField}
      {@const field = schema.get(formField.fieldId)}
      {#if field}
        {@const disabled = formField.getRequired(field)}
        <div class="flex items-center justify-between p-2">
          <div class="flex items-center gap-2">
            <FieldIcon class="text-muted-foreground h-4 w-4" type={field.type} />
            <span>{field.name.value}</span>
            {#if formField.getRequired(field)}
              <span class="text-red-500">*</span>
            {/if}
          </div>

          <div class="flex items-center gap-2">
            <Switch checked={!formField.hidden} {disabled} />
          </div>
        </div>
      {/if}
    {/each}
  </div>
</div>
