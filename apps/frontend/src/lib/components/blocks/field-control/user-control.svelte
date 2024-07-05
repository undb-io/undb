<script lang="ts">
  import UserPicker from "../user/user-picker.svelte"
  export let value: string | undefined
</script>

<UserPicker bind:value />
