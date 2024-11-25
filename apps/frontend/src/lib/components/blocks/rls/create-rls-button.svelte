<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte"
  import { CREATE_RLS_MODAL, toggleModal } from "$lib/store/modal.store"
  import { hasPermission } from "$lib/store/space-member.store"
  import { PlusCircleIcon } from "lucide-svelte"
  import { LL } from '@undb/i18n/client'
</script>

{#if $hasPermission("table:update")}
  <Button {...$$restProps} on:click={() => toggleModal(CREATE_RLS_MODAL)}>
    <PlusCircleIcon class="mr-2 h-4 w-4" />
    {$LL.table.authz.create()}
  </Button>
{/if}
