<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js"
  import NumberInput from "$lib/components/ui/input/number-input.svelte"
  import { Switch } from "$lib/components/ui/switch/index.js"
  import {
    COLORS,
    ColorsVO,
    SelectField,
    type ISelectFieldConstraint,
    type ISelectFieldOption,
    type ISelectFieldValue,
  } from "@undb/table"
  import OptionEditor from "$lib/components/blocks/option/option-editor.svelte"
  import { OptionIdVo } from "@undb/table/src/modules/schema/fields/option/option-id.vo"
  import Button from "$lib/components/ui/button/button.svelte"
  import { isNumber } from "radash"
  import { SortableList } from "@jhubbardsf/svelte-sortablejs"
  import { GripVerticalIcon, PlusSquareIcon, XIcon } from "lucide-svelte"
  import { Separator } from "$lib/components/ui/separator"
  import { Checkbox } from "$lib/components/ui/checkbox"
  import autoAnimate from "@formkit/auto-animate"
  import OptionsPicker from "../option/options-picker.svelte"
  import OptionPicker from "../option/option-picker.svelte"
  import * as Alert from "$lib/components/ui/alert/index.js"
  import { LL } from "@undb/i18n/client"

  export let constraint: ISelectFieldConstraint | undefined
  const colors = new ColorsVO()
  export let isNew = true
  export let field: SelectField | undefined
  export let option: ISelectFieldOption = { options: [] }
  export let defaultValue: ISelectFieldValue | undefined
  export let disabled: boolean = false

  $: if (!option?.options.length && isNew) {
    option = {
      options: [
        {
          color: COLORS[0],
          name: "option1",
          id: OptionIdVo.create().value,
        },
      ],
    }
  }

  function handleDefaultValue() {
    if (Array.isArray(defaultValue)) {
      if (option.options.some((option) => !defaultValue?.includes(option.id))) {
        defaultValue = defaultValue.filter((id) => option.options.some((option) => option.id === id))
      }
    } else if (defaultValue) {
      if (!option.options.some((option) => option.id === defaultValue)) {
        defaultValue = undefined
      }
    }
  }

  // $: option?.options, handleDefaultValue()

  const addOption = () => {
    option.options = [
      ...option.options,
      {
        color: colors.next(option.options[option.options.length - 1]?.color),
        name: `option${option.options.length + 1}`,
        id: OptionIdVo.create().value,
      },
    ]
  }

  const swap = (oldIndex: number, newIndex: number) => {
    const options = [...option.options]
    const [removed] = options.splice(oldIndex, 1)
    options.splice(newIndex, 0, removed)
    option.options = [...options]
  }

  const removeOption = (id: string) => {
    option.options = option.options.filter((o) => o.id !== id)
    handleDefaultValue()
  }

  let initialMultiple = !isNew && field?.isMultiple
  let multiple = constraint?.max !== 1
</script>

{#if constraint}
  <div class="space-y-2 pt-2">
    <div class="space-y-1">
      <p class="text-xs font-normal">{$LL.table.field.select.option.label()}</p>
      <div class="space-y-2">
        <SortableList
          animation={200}
          handle=".handler"
          class="max-h-[200px] space-y-2 overflow-y-auto py-1"
          onEnd={(event) => {
            if (isNumber(event.oldIndex) && isNumber(event.newIndex)) {
              swap(event.oldIndex, event.newIndex)
            }
          }}
        >
          {#each option.options as o (o.id)}
            <div class="flex gap-1">
              <OptionEditor
                {disabled}
                color={o.color}
                name={o.name}
                onNameChange={(name) => {
                  o.name = name
                  option.options = [...option.options]
                }}
                onColorChange={(color) => {
                  o.color = color
                  option.options = [...option.options]
                }}
              />

              <div class="inline-flex items-center">
                <button {disabled} type="button" class="handler">
                  <GripVerticalIcon class="text-muted-foreground h-4 w-4" />
                </button>
                <button
                  disabled={option.options.length === 1 || disabled}
                  type="button"
                  on:click={() => removeOption(o.id)}
                >
                  <XIcon class="text-muted-foreground h-4 w-4" />
                </button>
              </div>
            </div>
          {/each}
        </SortableList>

        <Button {disabled} on:click={addOption} class="w-full text-xs" size="sm" variant="outline">
          <PlusSquareIcon class="mr-2 h-3 w-3" />
          {$LL.table.field.select.option.add()}
        </Button>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <Switch
        {disabled}
        size="sm"
        id="single"
        bind:checked={multiple}
        onCheckedChange={(newValue) => {
          if (!newValue) {
            constraint.max = 1
            if (defaultValue && Array.isArray(defaultValue)) {
              defaultValue = defaultValue[0]
            }
          } else {
            constraint.max = undefined
            if (defaultValue && !Array.isArray(defaultValue)) {
              defaultValue = [defaultValue]
            }
          }
          handleDefaultValue()
        }}
      />
      <Label for="single" class="text-xs font-normal">{$LL.table.field.select.allowAddMultiple()}</Label>
    </div>

    <div use:autoAnimate>
      {#if !isNew}
        {#if initialMultiple && !multiple}
          <Alert.Root class="border-yellow-500 bg-yellow-50">
            <Alert.Title>{$LL.table.field.select.option.changeFromMultipleToSingle()}</Alert.Title>
            <Alert.Description class="text-xs"
              >{$LL.table.field.select.option.changeFromMultipleToSingleDescription()}</Alert.Description
            >
          </Alert.Root>
        {/if}
      {/if}
    </div>

    <div class="w-full space-y-1">
      {#if multiple}
        {#if Array.isArray(defaultValue) || defaultValue === undefined || defaultValue === null}
          <Label for="defaultValue" class="block text-xs font-normal">{$LL.table.field.defaultValue.label()}</Label>
          <OptionsPicker
            {disabled}
            sameWidth
            id="defaultValue"
            class="bg-background w-full flex-1 text-xs"
            placeholder={$LL.table.field.select.option.selectDefault()}
            options={option.options}
            bind:value={defaultValue}
          />
        {/if}
      {:else if !Array.isArray(defaultValue)}
        <Label for="defaultValue" class="block text-xs font-normal">{$LL.table.field.defaultValue.label()}</Label>
        <OptionPicker
          {disabled}
          sameWidth
          id="defaultValue"
          class="bg-background w-full flex-1 text-xs"
          placeholder={$LL.table.field.select.option.selectDefault()}
          options={option.options}
          bind:value={defaultValue}
        />
      {/if}
    </div>

    <div class="grid grid-cols-2 gap-2" use:autoAnimate>
      {#if multiple}
        <div class="space-y-1">
          <Label for="min" class="text-xs font-normal">{$LL.table.field.select.min()}</Label>
          <NumberInput
            {disabled}
            id="min"
            min={0}
            max={constraint.max}
            step={1}
            bind:value={constraint.min}
            placeholder={$LL.table.field.select.minPlaceholder()}
            class="bg-background text-xs"
          />
        </div>
        <div class="space-y-1">
          <Label for="max" class="text-xs font-normal">{$LL.table.field.select.max()}</Label>
          <NumberInput
            {disabled}
            id="max"
            min={constraint.min || 0}
            step={1}
            bind:value={constraint.max}
            placeholder={$LL.table.field.select.maxPlaceholder()}
            class="bg-background text-xs"
          />
        </div>
      {/if}
    </div>

    <div>
      <Separator />
    </div>
    <div class="flex items-center space-x-2">
      <Checkbox {disabled} id="required" bind:checked={constraint.required} />
      <Label for="required" class="text-xs font-normal">{$LL.table.field.defaultValue.markAsRequired()}</Label>
    </div>
  </div>
{/if}
