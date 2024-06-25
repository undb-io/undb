<script lang="ts">
  import ShareButton from "./share-button.svelte"

  export let formId: string
</script>

<ShareButton type="form" id={formId} />
