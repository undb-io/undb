<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { FieldIdVo, fieldTypes, getNextName, type ICreateSchemaDTO, type NoneSystemFieldType } from "@undb/table"
  import * as Collapsible from "$lib/components/ui/collapsible"
  import * as Card from "$lib/components/ui/card"
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { getFormField } from "formsnap"
  import { BetweenHorizonalEnd, Settings2Icon, SettingsIcon } from "lucide-svelte"
  import FieldIcon from "../field-icon/field-icon.svelte"
  import * as Accordion from "$lib/components/ui/accordion"
  import FieldOptions from "../field-options/field-options.svelte"
  import type { Infer } from "sveltekit-superforms"
  import type { createTableCommand } from "@undb/commands"
  import FieldTypePicker from "../field-picker/field-type-picker.svelte"
  import { tick } from "svelte"
  import { DotsHorizontal } from "svelte-radix"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"

  const { form } = getFormField<Infer<typeof createTableCommand>, "schema">()

  const { form: formData } = form

  let open = false

  const addField = async (type: NoneSystemFieldType) => {
    const fieldId = FieldIdVo.create().value
    $formData.schema = [
      ...$formData.schema,
      {
        id: fieldId,
        type,
        name: getNextName($formData.schema.map((field) => field.name)),
        constraint: {},
      },
    ]

    open = false

    await tick()

    if (activeFieldId !== undefined) {
      activeFieldId = fieldId
    }
    const el = document.querySelector(`[data-field-id="${fieldId}"]`) as HTMLInputElement
    if (el.tagName === "INPUT") {
      el.focus()
      el.select()
    }
  }

  const removeField = (fieldId?: string) => {
    $formData.schema = $formData.schema.filter((field) => field.id !== fieldId) as ICreateSchemaDTO
    console.log($formData.schema)
  }

  let activeFieldId: string | undefined
</script>

<Form.Legend>Schema</Form.Legend>
<Accordion.Root bind:value={activeFieldId}>
  {#each $formData.schema as field, i (field.id)}
    <Form.ElementField {form} name="schema">
      <Form.Control let:attrs>
        <Accordion.Item class="w-full border-b-0" value={field.id}>
          <div class="mr-2 flex items-center gap-2">
            <Form.Label class="flex h-9 flex-1 items-center gap-1">
              <FieldTypePicker class="h-full w-20" bind:value={field.type} />
              <Input {...attrs} class="bg-background no-underline" bind:value={field.name} data-field-id={field.id} />
            </Form.Label>
            <Accordion.Trigger>
              <SettingsIcon class="text-muted-foreground h-4 w-4 shrink-0 transition-transform duration-200" />
            </Accordion.Trigger>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <button type="button">
                  <DotsHorizontal class="text-muted-foreground h-3 w-3 shrink-0" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item
                  class="text-xs text-red-500 data-[highlighted]:bg-red-100 data-[highlighted]:text-red-500"
                  disabled={$formData.schema.length === 1}
                  on:click={() => removeField(field.id)}
                >
                  Remove
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
          <Accordion.Content class="rounded-sm border bg-gray-50 px-3 pt-1.5">
            <FieldOptions type={field.type} bind:constraint={field.constraint} />
          </Accordion.Content>
        </Accordion.Item>
      </Form.Control>
      <Form.FieldErrors />
    </Form.ElementField>
  {/each}
</Accordion.Root>

<Form.FieldErrors />

<Collapsible.Root bind:open>
  <Collapsible.Trigger class="w-full">
    <Button class="w-full" variant={$formData.schema.length ? "outline" : "default"}>
      <BetweenHorizonalEnd class="mr-2 h-4 w-4" />
      Add Field
    </Button>
  </Collapsible.Trigger>
  <Collapsible.Content class="pt-2">
    <Card.Root class="rounded-none p-1">
      <Card.Content class="p-0">
        <div class="grid grid-cols-4 gap-1">
          {#each fieldTypes as type}
            <button
              type="button"
              on:click={() => addField(type)}
              class="hover:bg-muted flex cursor-pointer items-center gap-2 p-2 text-sm"
            >
              <FieldIcon class="h-4 w-4" {type} />
              <span>{type}</span>
            </button>
          {/each}
        </div>
      </Card.Content>
    </Card.Root>
  </Collapsible.Content>
</Collapsible.Root>
