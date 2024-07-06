<script lang="ts">
  import type { UserField } from "@undb/table"
  import UserPicker from "../user/user-picker.svelte"
  import UsersPicker from "../user/users-picker.svelte"

  export let field: UserField
  export let value: string | string[] | undefined
</script>

{#if field.isSingle}
  {#if !Array.isArray(value)}
    <UserPicker bind:value />
  {/if}
{:else if Array.isArray(value) || value === undefined || value === null}
  <UsersPicker bind:value />
{/if}
