<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import type { FormVO } from "@undb/table"
  import FieldIcon from "../field-icon/field-icon.svelte"
  import { Switch } from "$lib/components/ui/switch"
  import CreateFieldButton from "../create-field/create-field-button.svelte"
  import { GripVerticalIcon } from "lucide-svelte"
  import { queryParam } from "sveltekit-search-params"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { tick } from "svelte"
  import { EyeClosed, EyeOpen } from "svelte-radix"

  const selectedFieldId = queryParam("formField")

  const table = getTable()

  $: schema = $table.schema.fieldMapById

  export let form: FormVO

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

<div class="h-full w-full space-y-3 px-8 py-6">
  <div class="divide-y rounded-sm border">
    {#each form.fields.props as formField}
      {@const field = schema.get(formField.fieldId)}
      {#if field}
        {@const disabled = formField.getRequired(field)}
        <button
          class="flex w-full items-center justify-between text-pretty p-2 text-sm"
          on:click={(e) => {
            if (formField.hidden) {
              return
            }

            e.stopPropagation()
            if ($selectedFieldId === field.id.value) {
              $selectedFieldId = null
            } else {
              $selectedFieldId = field.id.value
            }
          }}
        >
          <div class="flex items-center gap-2">
            <GripVerticalIcon class="h-3 w-3" />
            <FieldIcon class="text-muted-foreground h-4 w-4" type={field.type} />
            <span>{field.name.value}</span>
            {#if formField.getRequired(field)}
              <span class="text-red-500">*</span>
            {/if}
          </div>

          <div class="flex items-center gap-2">
            <Switch bind:checked={formField.required} on:click={setForm} disabled={field.required} />
            <label class="cursor-pointer">
              <input
                type="checkbox"
                class="hidden"
                bind:checked={formField.hidden}
                disabled={formField.required}
                on:change={setForm}
              />
              {#if formField.hidden}
                <EyeClosed class="h-4 w-4" />
              {:else}
                <EyeOpen class="h-4 w-4" />
              {/if}
            </label>
          </div>
        </button>
      {/if}
    {/each}
  </div>

  <CreateFieldButton class="w-full" />
</div>
