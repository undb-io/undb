<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import type { FormVO } from "@undb/table"
  import FieldControl from "../field-control/field-control.svelte"
  import FormFieldOptions from "./form-field-options.svelte"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import { cn } from "$lib/utils"
  import * as Collapsible from "$lib/components/ui/collapsible"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { tick } from "svelte"
  import { queryParam } from "sveltekit-search-params"
  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte"

  const selectedFieldId = queryParam("formField")

  const table = getTable()

  $: schema = $table.schema.fieldMapById

  export let form: FormVO

  $: formFields = form.visibleFields

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

  let isEditingFormName = false

  let el: HTMLDivElement
  $: if ($selectedFieldId) {
    el?.querySelector(`[data-field-id="${$selectedFieldId}"]`)?.scrollIntoView({ behavior: "smooth" })
  }
</script>

<ScrollArea class="h-full w-full bg-gray-100 p-6 shadow-inner">
  <div class="bg-background mx-auto max-w-[660px] space-y-2 rounded-md px-8 py-4 shadow-xl" data-form-id={form.id}>
    {#if isEditingFormName}
      <input
        class="text-4xl font-extrabold tracking-tight"
        bind:value={form.name}
        on:change={() => {
          setForm()
          isEditingFormName = false
        }}
      />
    {:else}
      <h2 class="text-4xl font-extrabold tracking-tight" on:click={() => (isEditingFormName = true)}>
        {form.name}
      </h2>
    {/if}

    <div>
      <Label>Description</Label>
      <Input class="text-sm" bind:value={form.description} on:change={setForm}></Input>
    </div>

    <div class="space-y-2" bind:this={el}>
      {#each formFields as formField}
        {@const field = schema.get(formField.fieldId)}
        {#if field}
          {@const isSelected = $selectedFieldId === field.id.value}
          <label class="block" data-field-id={formField.fieldId}>
            <input type="radio" class="hidden" bind:group={$selectedFieldId} value={field.id.value} />
            <Collapsible.Root
              open={isSelected}
              onOpenChange={(open) => {
                if (!open) {
                  $selectedFieldId = null
                }
              }}
              class={cn(
                "-mx-4 space-y-2 rounded-md border-2 border-transparent p-0 px-4 transition-all",
                isSelected ? "border-gray-50 shadow-lg" : "hover:bg-muted/50",
              )}
            >
              <div class={cn("cursor-pointer space-y-2 py-4")}>
                <div class="text-md flex items-center gap-2 font-medium">
                  <FieldIcon type={field.type} class="h-4 w-4" />
                  <span>
                    {field.name.value}
                  </span>
                  {#if formField.getRequired(field)}
                    <span class="text-red-500">*</span>
                  {/if}
                  {#if formField.conditionEnabled && formField.hasCondition}
                    <span
                      class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                    >
                      condition
                    </span>
                  {/if}
                  {#if form.getIsFormFieldContionInValid(formField.fieldId)}
                    <span
                      class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20"
                    >
                      invalid condition
                    </span>
                  {/if}
                </div>
                <FieldControl {field} value={undefined} class="bg-background" />
              </div>
              <Collapsible.Content>
                <FormFieldOptions {field} bind:formField bind:form class="-mx-4" />
              </Collapsible.Content>
            </Collapsible.Root>
          </label>
        {/if}
      {/each}
    </div>
  </div>
</ScrollArea>
