<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { CREATE_BASE_MODAL, toggleModal } from "$lib/store/modal.store"
</script>

<Button on:click={() => toggleModal(CREATE_BASE_MODAL)}>Create New Base</Button>
