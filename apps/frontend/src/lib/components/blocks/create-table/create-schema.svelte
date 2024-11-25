<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import {
    FieldIdVo,
    fieldTypes,
    getIsDisplayFieldType,
    systemFieldTypes,
    type IButtonFieldOption,
    type ICreateSchemaDTO,
    type NoneSystemFieldType,
  } from "@undb/table"
  import { getNextName } from "@undb/utils"
  import * as Popover from "$lib/components/ui/popover"
  import * as Card from "$lib/components/ui/card"
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { getFormField } from "formsnap"
  import { BetweenHorizonalEnd, SettingsIcon } from "lucide-svelte"
  import FieldIcon from "../field-icon/field-icon.svelte"
  import * as Accordion from "$lib/components/ui/accordion"
  import FieldOptions from "../field-options/field-options.svelte"
  import type { Infer } from "sveltekit-superforms"
  import type { createTableCommand } from "@undb/commands"
  import FieldTypePicker from "../field-picker/field-type-picker.svelte"
  import { tick } from "svelte"
  import { DotsHorizontal } from "svelte-radix"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { clickoutside } from "@svelte-put/clickoutside"
  import autoAnimate from "@formkit/auto-animate"
  import { match } from "ts-pattern"
  import { LL } from "@undb/i18n/client"

  const { form } = getFormField<Infer<typeof createTableCommand>, "schema">()

  const { form: formData } = form

  let open = false

  const addField = async (type: NoneSystemFieldType) => {
    const fieldId = FieldIdVo.create().value

    const newField = match(type)
      .with("select", (type) => ({
        id: fieldId,
        type,
        name: getNextName(
          $formData.schema.map((field) => field.name),
          $LL.table.fieldTypes[type](),
        ),
        display: false,
        constraint: {
          max: 1,
        },
        option: {
          options: [],
        },
      }))
      .with("currency", () => ({
        id: fieldId,
        type: "currency",
        name: getNextName(
          $formData.schema.map((field) => field.name),
          $LL.table.fieldTypes[type](),
        ),
        display: false,
        constraint: {},
        option: {
          symbol: "$",
        },
      }))
      .with("button", () => ({
        id: fieldId,
        type,
        name: getNextName(
          $formData.schema.map((field) => field.name),
          $LL.table.fieldTypes[type](),
        ),
        display: false,
        constraint: {},
        option: {
          action: {
            type: "update",
            values: [],
            confirm: true,
          },
        } satisfies IButtonFieldOption,
      }))
      .otherwise((type) => ({
        id: fieldId,
        type,
        name: getNextName(
          $formData.schema.map((field) => field.name),
          $LL.table.fieldTypes[type](),
        ),
        display: false,
        constraint: {},
      }))

    $formData.schema = [...$formData.schema, newField]

    await tick()
    open = false

    activeFieldId = fieldId
    const el = document.querySelector(`[data-field-id="${fieldId}"]`) as HTMLInputElement
    if (el.tagName === "INPUT") {
      el.focus()
      el.select()
    }
  }

  const removeField = (fieldId?: string) => {
    $formData.schema = $formData.schema.filter((field) => field.id !== fieldId) as ICreateSchemaDTO
  }

  let activeFieldId: string | undefined
</script>

<Form.Legend>{$LL.table.schema.label()}</Form.Legend>
<Form.Description>
  {$LL.table.schema.systemFields()}:
  <div class="mt-2 flex flex-wrap items-center gap-2">
    {#each systemFieldTypes as type}
      <span
        class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
      >
        {$LL.table.fieldTypes[type]()}
      </span>
    {/each}
  </div>
</Form.Description>
<Accordion.Root bind:value={activeFieldId}>
  {#each $formData.schema as field, i (field.id)}
    <Form.ElementField {form} name="schema">
      <Form.Control let:attrs>
        <Accordion.Item class="w-full border-b-0" value={field.id}>
          <div class="flex w-full items-center gap-2">
            <Form.Label class="flex h-9 w-40 flex-1 items-center gap-2">
              <FieldTypePicker
                sameWidth={false}
                class="h-full w-40"
                bind:value={field.type}
                onValueChange={(type) => {
                  $formData.schema[i].display = getIsDisplayFieldType(type)
                  if (type === "select" || type === "reference") {
                    activeFieldId = field.id
                  }
                }}
              />
              <Input
                placeholder={$LL.table.schema.fieldName()}
                {...attrs}
                class="bg-background no-underline"
                bind:value={field.name}
                data-field-id={field.id}
              />
              <div class="flex items-center gap-1" use:autoAnimate={{ duration: 100 }}>
                {#if field.constraint?.required}
                  <span
                    class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10"
                  >
                    {$LL.table.schema.required()}
                  </span>
                {/if}
                {#if field.display}
                  <span
                    class="inline-flex items-center text-nowrap rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                  >
                    {$LL.table.schema.display()}
                  </span>
                {/if}
              </div>
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
                  {$LL.common.remove()}
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
          <Accordion.Content class="mt-2 rounded-sm border bg-gray-50 p-3 shadow-inner">
            <FieldOptions
              type={field.type}
              bind:constraint={field.constraint}
              bind:display={field.display}
              bind:defaultValue={field.defaultValue}
              bind:option={field.option}
            />
          </Accordion.Content>
        </Accordion.Item>
      </Form.Control>
      <Form.FieldErrors />
    </Form.ElementField>
  {/each}
</Accordion.Root>

<Form.FieldErrors />

<div use:clickoutside on:clickoutside={() => (open = false)}>
  <Popover.Root bind:open>
    <Popover.Trigger class="w-full">
      <Button class="w-full" variant={$formData.schema.length ? "outline" : "default"}>
        <BetweenHorizonalEnd class="mr-2 h-4 w-4" />
        {$LL.table.schema.addField()}
      </Button>
    </Popover.Trigger>
    <Popover.Content sameWidth class="p-0">
      <Card.Root class="rounded-none px-1.5 py-2">
        <Card.Content class="p-0">
          <div class="grid grid-cols-4 gap-1">
            {#each fieldTypes as type}
              {#if type !== "rollup" && type !== "button"}
                <button
                  type="button"
                  on:click={() => addField(type)}
                  class="hover:bg-muted flex cursor-pointer items-center gap-2 p-2 text-sm"
                >
                  <FieldIcon class="h-3 w-3" {type} />
                  <span class="text-sm">{$LL.table.fieldTypes[type]()}</span>
                </button>
              {/if}
            {/each}
          </div>
        </Card.Content>
      </Card.Root>
    </Popover.Content>
  </Popover.Root>
</div>
