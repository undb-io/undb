<script lang="ts">
  import {
    isUserFieldMacro,
    type CreatedByField,
    type IUserFieldConditionValue,
    type UpdatedByField,
    type UserField,
  } from "@undb/table"
  import UserPicker from "../../user/user-picker.svelte"
  import { Button } from "$lib/components/ui/button"
  import { ChevronsUpDownIcon } from "lucide-svelte"
  import { cn } from "$lib/utils"
  import UserFilterInputComponent from "./user-filter-input-component.svelte"
  import UsersPicker from "../../user/users-picker.svelte"
  import UsersFilterInputComponent from "./users-filter-input-component.svelte"
  import { isString } from "radash"
  import UserMacro from "../../user/user-macro.svelte"

  export let field: UserField | CreatedByField | UpdatedByField
  export let value: IUserFieldConditionValue
  export let disabled = false
</script>

{#if field.type === "createdBy" || field.type === "updatedBy" || (field.type === "user" && field.isSingle && !Array.isArray(value))}
  <UserPicker bind:value>
    <Button
      {disabled}
      slot="trigger"
      let:builder
      let:selected
      variant="outline"
      builders={[builder]}
      class={cn("flex w-full items-center justify-between", $$restProps.class)}
    >
      {#if isString(value) && isUserFieldMacro(value)}
        <UserMacro {value} />
      {:else}
        <UserFilterInputComponent {value} user={selected?.user} {field} />
      {/if}
      <ChevronsUpDownIcon class="text-muted-foreground h-3 w-3" />
    </Button>
  </UserPicker>
{/if}
{#if field.type === "user" && field.isMultiple && !isString(value)}
  <UsersPicker bind:value>
    <Button
      {disabled}
      slot="trigger"
      let:builder
      let:selected
      variant="outline"
      builders={[builder]}
      class={cn("flex w-full items-center justify-between", $$restProps.class)}
    >
      {#each value ?? [] as user}
        {#if isUserFieldMacro(user)}
          <UserMacro value={user} />
        {/if}
      {/each}
      <UsersFilterInputComponent {field} {value} users={selected.map((s) => s.user)} />
      <ChevronsUpDownIcon class="text-muted-foreground h-3 w-3" />
    </Button>
  </UsersPicker>
{/if}
