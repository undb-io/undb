<script lang="ts">
  import type { IUserFieldDisplayValue, IUserFieldValue, UserField } from "@undb/table"
  import UserPicker from "../user/user-picker.svelte"
  import UsersPicker from "../user/users-picker.svelte"
  import { Button } from "$lib/components/ui/button"
  import { ChevronsUpDownIcon } from "lucide-svelte"
  import UserFieldComponent from "$lib/components/blocks/field-value/user-field.svelte"

  export let field: UserField
  export let value: IUserFieldValue
  export let displayValue: IUserFieldDisplayValue[] | IUserFieldDisplayValue | null
</script>

{#if field.isSingle}
  {#if !Array.isArray(value) && !Array.isArray(displayValue)}
    <UserPicker bind:value>
      <Button
        slot="trigger"
        let:builder
        let:selected
        variant="outline"
        builders={[builder]}
        class="flex w-full items-center justify-between"
      >
        <UserFieldComponent disableHoverCard {value} displayValue={selected?.user ?? displayValue} />
        <ChevronsUpDownIcon class="text-muted-foreground h-3 w-3" />
      </Button>
    </UserPicker>
  {/if}
{:else if (Array.isArray(value) || value === undefined || value === null) && (Array.isArray(displayValue) || !displayValue)}
  <UsersPicker bind:value>
    <Button
      slot="trigger"
      let:builder
      let:selected
      variant="outline"
      builders={[builder]}
      class="flex w-full items-center justify-between"
    >
      <div class="flex flex-1 items-center gap-2">
        {#each value ?? [] as user, i}
          {@const value = selected.find((u) => u.user.id === user)?.user ?? displayValue?.[i]}
          <UserFieldComponent disableHoverCard value={user} displayValue={value} />
        {/each}
      </div>
      <ChevronsUpDownIcon class="text-muted-foreground h-3 w-3" />
    </Button>
  </UsersPicker>
{/if}
