<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { fieldTypes, type FieldType, type NoneSystemFieldType } from "@undb/table"
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

  const { form } = getFormField<Infer<typeof createTableCommand>, "schema">()

  const { form: formData } = form

  let open = false

  const addField = (type: NoneSystemFieldType) => {
    $formData.schema = [
      ...$formData.schema,
      {
        type,
        name: "field" + ($formData.schema.length + 1),
        constraint: {},
      },
    ]

    open = false
  }
</script>

<Form.Legend>Schema</Form.Legend>
<Accordion.Root>
  {#each $formData.schema as _, i}
    <Form.ElementField {form} name="schema">
      <Form.Control let:attrs>
        <Accordion.Item class="w-full border-b-0" value={$formData.schema[i].name}>
          <div class="mr-2 flex items-center gap-2">
            <Form.Label class="flex flex-1 items-center gap-2">
              <FieldIcon class="h-4 w-4" type={$formData.schema[i].type} />
              <Input {...attrs} class="no-underline" bind:value={$formData.schema[i].name} />
            </Form.Label>
            <Accordion.Trigger>
              <SettingsIcon class="text-muted-foreground h-4 w-4 shrink-0 transition-transform duration-200" />
            </Accordion.Trigger>
          </div>
          <Accordion.Content class="bg-muted rounded-sm border px-3 pt-1.5">
            <FieldOptions type={$formData.schema[i].type} bind:constraint={$formData.schema[i].constraint} />
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
