<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { CREATE_BASE_MODAL, toggleModal } from "$lib/store/modal.store"
  import { hasPermission } from "$lib/store/space-member.store"
</script>

{#if $hasPermission("base:create")}
  <Button on:click={() => toggleModal(CREATE_BASE_MODAL)}>Create New Base</Button>
{/if}
