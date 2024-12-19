<script lang="ts">
  import { page } from "$app/stores"
  import VerifyOtp from "$lib/components/blocks/auth/verify-otp.svelte"

  $: email = $page.url.searchParams.get("email")
</script>

{#if email}
  <VerifyOtp {email} />
{/if}
