<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { fieldTypes } from "@undb/table"
  import * as Collapsible from "$lib/components/ui/collapsible"
  import * as Card from "$lib/components/ui/card"
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { getFormField } from "formsnap"
  import { BetweenHorizonalEnd } from "lucide-svelte"
  import FieldIcon from "../field-icon/field-icon.svelte"

  const { form } = getFormField<any, "schema">()

  const { form: formData } = form

  let open = false

  const addField = (type: string) => {
    $formData.schema = [...$formData.schema, { type, name: "field" + ($formData.schema.length + 1) }]

    open = false
  }
</script>

<Form.Legend>Schema</Form.Legend>
{#each $formData.schema as _, i}
  <Form.ElementField {form} name="">
    <Form.Control let:attrs>
      <Form.Label class="flex items-center gap-2">
        <FieldIcon class="h-4 w-4" type={$formData.schema[i].type} />
        <Input {...attrs} bind:value={$formData.schema[i].name} />
      </Form.Label>
    </Form.Control>
    <Form.FieldErrors />
  </Form.ElementField>
{/each}
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
