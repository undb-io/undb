<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte"
  import { CREATE_RLS_MODAL, toggleModal } from "$lib/store/modal.store"
</script>

<Button on:click={() => toggleModal(CREATE_RLS_MODAL)}>Create Record Level Security</Button>
