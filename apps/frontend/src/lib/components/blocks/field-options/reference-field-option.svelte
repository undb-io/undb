<script lang="ts">
  import {
    type ICreateReferenceFieldDTO,
    type IReferenceFieldConstraint,
    type IUpdateReferenceFieldDTO,
  } from "@undb/table"
  import CreateReferenceFieldOptioin from "./create-reference-field-optioin.svelte"
  import ReferenceField from "../field-value/reference-field.svelte"
  import UpdateReferenceFieldOptioin from "./update-reference-field-optioin.svelte"

  export let constraint: IReferenceFieldConstraint | undefined = {
    required: false,
  }
  export let option: Partial<ICreateReferenceFieldDTO["option"] | IUpdateReferenceFieldDTO["option"]>
  export let isNew: boolean
  export let field: ReferenceField
  export let disabled = false
</script>

{#if isNew}
  <CreateReferenceFieldOptioin bind:option bind:constraint />
{:else}
  <UpdateReferenceFieldOptioin bind:option bind:constraint />
{/if}
