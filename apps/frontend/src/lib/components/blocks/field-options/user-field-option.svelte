<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js"
  import NumberInput from "$lib/components/ui/input/number-input.svelte"
  import { Switch } from "$lib/components/ui/switch/index.js"
  import { isUserFieldMacro, UserField, type IUserFieldConstraint, type IUserFieldValue } from "@undb/table"
  import autoAnimate from "@formkit/auto-animate"
  import { Separator } from "$lib/components/ui/separator"
  import { Checkbox } from "$lib/components/ui/checkbox"
  import UsersPicker from "../user/users-picker.svelte"
  import UserPicker from "../user/user-picker.svelte"
  import UserFieldComponent from "$lib/components/blocks/field-value/user-field.svelte"
  import { ChevronDownIcon, ChevronsUpDownIcon } from "lucide-svelte"
  import { Button } from "$lib/components/ui/button"
  import * as Alert from "$lib/components/ui/alert/index.js"
  import UserMacro from "../user/user-macro.svelte"
  import { LL } from "@undb/i18n/client"

  export let constraint: IUserFieldConstraint | undefined = { required: false, max: 1 }
  export let defaultValue: IUserFieldValue | undefined
  export let field: UserField | undefined
  export let isNew = true
  export let disabled: boolean = false

  let initialMultiple = !isNew && field?.isMultiple
  let multiple = constraint?.max !== 1
</script>

{#if constraint}
  <div class="space-y-2">
    <div class="my-2 flex items-center gap-2">
      <Switch
        size="sm"
        id="single"
        bind:checked={multiple}
        {disabled}
        onCheckedChange={(multiple) => {
          if (!multiple) {
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
        }}
      />
      <Label for="single" class="text-xs font-normal">{$LL.table.field.user.allowAddMultiple()}</Label>
    </div>

    <div use:autoAnimate>
      {#if !isNew}
        {#if initialMultiple && !multiple}
          <Alert.Root class="border-yellow-500 bg-yellow-50">
            <Alert.Title>{$LL.table.field.user.changeFromMultipleToSingle()}</Alert.Title>
            <Alert.Description class="text-xs"
              >{$LL.table.field.user.changeFromMultipleToSingleDescription()}</Alert.Description
            >
          </Alert.Root>
        {/if}
      {/if}
    </div>

    <div class="w-full space-y-1">
      {#if multiple}
        {#if Array.isArray(defaultValue) || defaultValue === undefined || defaultValue === null}
          <Label for="defaultValue" class="block text-xs font-normal">{$LL.table.field.defaultValue.label()}</Label>
          <UsersPicker
            {disabled}
            id="defaultValue"
            class="bg-background w-full flex-1 text-xs"
            placeholder={$LL.table.field.defaultValue.placeholder()}
            bind:value={defaultValue}
          >
            <Button
              {disabled}
              slot="trigger"
              variant="outline"
              size="sm"
              let:builder
              let:selected
              builders={[builder]}
              class="flex w-full flex-nowrap items-center justify-between overflow-hidden"
            >
              {#if defaultValue?.length}
                <div class="flex flex-1 items-center gap-1 overflow-hidden">
                  {#each defaultValue ?? [] as user, i}
                    {#if isUserFieldMacro(user)}
                      <UserMacro value={user} />
                    {:else}
                      {@const value = selected.find((u) => u.user.id === user)?.user}
                      <UserFieldComponent disableHoverCard value={user} displayValue={value} />
                    {/if}
                  {/each}
                </div>
              {:else}
                <span class="text-muted-foreground"> {$LL.table.field.defaultValue.placeholder()} </span>
              {/if}
              <ChevronDownIcon class="text-muted-foreground h-3 w-3" />
            </Button>
            <ChevronsUpDownIcon class="text-muted-foreground h-3 w-3" />
          </UsersPicker>
        {/if}
      {:else if !Array.isArray(defaultValue)}
        <Label for="defaultValue" class="block text-xs font-normal">{$LL.table.field.defaultValue.label()}</Label>
        <UserPicker
          {disabled}
          id="defaultValue"
          class="bg-background w-full flex-1 text-xs"
          placeholder={$LL.table.field.defaultValue.placeholder()}
          bind:value={defaultValue}
        >
          <Button
            {disabled}
            slot="trigger"
            variant="outline"
            size="sm"
            let:builder
            let:selected
            builders={[builder]}
            class="flex w-full flex-nowrap items-center justify-between overflow-hidden"
          >
            {#if defaultValue}
              {#if isUserFieldMacro(defaultValue)}
                <UserMacro value={defaultValue} />
              {:else}
                <UserFieldComponent disableHoverCard value={defaultValue} displayValue={selected?.user} />
              {/if}
            {:else}
              <span class="text-muted-foreground"> {$LL.table.field.defaultValue.placeholder()} </span>
            {/if}
            <ChevronDownIcon class="text-muted-foreground h-3 w-3" />
          </Button>
        </UserPicker>
      {/if}
    </div>
    <div class="grid grid-cols-2 gap-2" use:autoAnimate>
      {#if multiple}
        <div class="space-y-1">
          <Label for="min" class="text-xs font-normal">{$LL.table.field.user.min()}</Label>
          <NumberInput
            {disabled}
            id="min"
            min={0}
            max={constraint.max}
            step={1}
            bind:value={constraint.min}
            placeholder={$LL.table.field.user.minPlaceholder()}
            class="bg-background text-xs"
          />
        </div>
        <div class="space-y-1">
          <Label for="max" class="text-xs font-normal">{$LL.table.field.user.max()}</Label>
          <NumberInput
            {disabled}
            id="max"
            min={constraint.min || 0}
            step={1}
            bind:value={constraint.max}
            placeholder={$LL.table.field.user.maxPlaceholder()}
            class="bg-background text-xs"
          />
        </div>
      {/if}
    </div>

    <div>
      <Separator />
    </div>
    <div class="flex items-center space-x-2">
      <Checkbox id="required" bind:checked={constraint.required} {disabled} />
      <Label for="required" class="text-xs font-normal">{$LL.table.field.defaultValue.markAsRequired()}</Label>
    </div>
  </div>
{/if}
