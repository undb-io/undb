<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { FormFieldsVO, type FormVO } from "@undb/table"
  import FieldIcon from "../field-icon/field-icon.svelte"
  import { Switch } from "$lib/components/ui/switch"
  import CreateFieldButton from "../create-field/create-field-button.svelte"
  import { GripVerticalIcon } from "lucide-svelte"
  import { queryParam } from "sveltekit-search-params"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { tick } from "svelte"
  import { cn } from "$lib/utils"
  import { EyeClosed, EyeOpen } from "svelte-radix"
  import { SortableList } from "@jhubbardsf/svelte-sortablejs"
  import { isNumber } from "radash"

  const selectedFieldId = queryParam("formField")

  const table = getTable()

  $: schema = $table.schema.fieldMapById

  export let form: FormVO

  const setFormMutation = createMutation({
    mutationKey: ["table", $table.id.value, "setForm"],
    mutationFn: trpc.table.form.set.mutate,
  })

  const setForm = async () => {
    await tick()
    $setFormMutation.mutate({
      tableId: $table.id.value,
      form: form.toJSON(),
    })
  }

  function swapFormFields(oldIndex: number, newIndex: number) {
    const fields = [...form.fields.props]
    const [removed] = fields.splice(oldIndex, 1)
    fields.splice(newIndex, 0, removed)
    form.fields = new FormFieldsVO(fields)
    setForm()
  }
</script>

<div class="h-full w-full space-y-3 px-8 py-6">
  <div class="divide-y rounded-sm border">
    <SortableList
      class=""
      animation={200}
      onEnd={(event) => {
        if (isNumber(event.oldIndex) && isNumber(event.newIndex)) {
          swapFormFields(event.oldIndex, event.newIndex)
        }
      }}
    >
      {#each form.fields.props as formField (formField.fieldId)}
        {@const field = schema.get(formField.fieldId)}
        {#if field}
          {@const disabled = formField.getRequired(field)}
          <button
            class={cn("flex w-full items-center justify-between text-pretty p-2 text-sm transition-all", {
              "bg-gray-50 shadow-inner": formField.fieldId === $selectedFieldId,
            })}
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
              <label class={cn(disabled ? "cursor-not-allowed" : "cursor-pointer")}>
                <input type="checkbox" class="hidden" bind:checked={formField.hidden} {disabled} on:change={setForm} />
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
    </SortableList>
  </div>

  <CreateFieldButton class="w-full" />
</div>
