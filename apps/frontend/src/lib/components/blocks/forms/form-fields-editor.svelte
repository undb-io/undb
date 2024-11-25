<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { FormFieldsVO, type FormVO } from "@undb/table"
  import FieldIcon from "../field-icon/field-icon.svelte"
  import { Switch } from "$lib/components/ui/switch"
  import ShareFormButton from "$lib/components/blocks/share/share-form-button.svelte"
  import CreateFieldButton from "../create-field/create-field-button.svelte"
  import { GripVerticalIcon, SearchIcon } from "lucide-svelte"
  import { queryParam } from "sveltekit-search-params"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { tick } from "svelte"
  import { cn } from "$lib/utils"
  import { EyeClosed, EyeOpen } from "svelte-radix"
  import { SortableList } from "@jhubbardsf/svelte-sortablejs"
  import { isNumber } from "radash"
  import { Label } from "$lib/components/ui/label"
  import { Input } from "$lib/components/ui/input"
  import { invalidate } from "$app/navigation"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { LL } from "@undb/i18n/client"

  const selectedFieldId = queryParam("formField")

  const table = getTable()

  $: schema = $table.schema.fieldMapById

  export let form: FormVO

  const setFormMutation = createMutation({
    mutationKey: ["table", $table.id.value, "setForm"],
    mutationFn: trpc.table.form.set.mutate,
    async onSuccess() {
      await invalidate(`undb:table:${$table.id.value}`)
    },
  })

  const setForm = async () => {
    await tick()
    $setFormMutation.mutate({
      tableId: $table.id.value,
      form: form.toJSON(),
    })
  }

  async function swapFormFields(oldIndex: number, newIndex: number) {
    const fields = [...form.fields.props]
    const [removed] = fields.splice(oldIndex, 1)
    fields.splice(newIndex, 0, removed)
    form.fields = new FormFieldsVO(fields)
    await setForm()
  }

  let selectAll = form.getAllSelected()

  let q = ""

  $: filteredFields = q
    ? form.fields.props.filter((formField) => {
        const field = schema.get(formField.fieldId)
        if (!field) {
          return false
        }

        return field.name.value.toLowerCase().includes(q.toLowerCase())
      })
    : form.fields.props
</script>

<div class="py-a h-full w-full space-y-3 px-4 py-3">
  <div class="text-md flex items-center justify-between gap-2 font-semibold">
    <div>
      <span> {$LL.table.form.formField()}</span>
      <span
        class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
      >
        ({$LL.table.form.fieldsSelected({n: `${form.getVisibleFieldsCount()} / ${form.getFieldsCount()}`})})
      </span>
    </div>
    <ShareFormButton formId={form.id} />
  </div>

  <div class="flex items-center gap-2">
    <SearchIcon class="text-muted-foreground h-4 w-4" />
    <Input class="flex-1" bind:value={q} placeholder={$LL.table.form.searchFormField()} />
  </div>

  <div class="divide-y rounded-sm border">
    <div class="text-muted-foreground flex items-center justify-between bg-gray-50 p-2 text-xs font-normal">
      <Label for="selectAll">{$LL.table.form.selectAllFields()}</Label>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Switch
            size="sm"
            id="selectAll"
            bind:checked={selectAll}
            onCheckedChange={(checked) => {
              if (checked) {
                form.fields = form.fields.show(schema)
              } else {
                form.fields = form.fields.hide(schema)
              }
              setForm()
            }}
          />
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>{selectAll ? $LL.table.form.hideFields() : $LL.table.form.showFields()}</p>
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
    <SortableList
      class=""
      animation={200}
      onEnd={(event) => {
        if (isNumber(event.oldIndex) && isNumber(event.newIndex)) {
          swapFormFields(event.oldIndex, event.newIndex)
        }
      }}
    >
      {#each filteredFields as _, i (filteredFields[i].fieldId)}
        {@const formField = filteredFields[i]}
        {@const field = schema.get(formField.fieldId)}
        {#if field}
          {@const required = formField.getRequired(field)}
          {@const hiddenDisabled = (required && !formField.defaultValue) || field.type === "button"}
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
              <FieldIcon {field} class="text-muted-foreground h-4 w-4" type={field.type} />
              <span>{field.name.value}</span>
              {#if formField.getRequired(field)}
                <span class="text-red-500">*</span>
              {/if}
            </div>

            <div class="flex items-center gap-2">
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <Switch
                    size="sm"
                    checked={formField.getRequired(field)}
                    onCheckedChange={async (checked) => {
                      formField.setRequired(field, checked)
                      await tick()
                      setForm()
                    }}
                    disabled={field.required}
                  />
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <p>{$LL.common.required()}</p>
                </Tooltip.Content>
              </Tooltip.Root>
              <label class={cn(hiddenDisabled ? "cursor-not-allowed" : "cursor-pointer")}>
                <input
                  type="checkbox"
                  class="hidden"
                  bind:checked={formField.hidden}
                  disabled={hiddenDisabled}
                  on:change={async () => {
                    if (hiddenDisabled) {
                      return
                    }

                    await tick()
                    form = form
                    setForm()
                  }}
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

      {#if q && !filteredFields.length}
        <p class="text-muted-foreground flex items-center self-center p-2 text-center text-sm">
          {$LL.table.form.noFieldsFound({q})}
        </p>
      {/if}
    </SortableList>
  </div>

  <CreateFieldButton class="w-full" />
</div>
