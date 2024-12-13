<script lang="ts">
  import { Button, type Props as ButtonProps } from "$lib/components/ui/button"

  type Props = {
    isLoggedIn: boolean
    size: ButtonProps["size"]
  }

  let { isLoggedIn, ...rest }: Props = $props()
</script>

{#if isLoggedIn}
  <Button href="/" {...rest}>Go to space</Button>
{:else}
  <Button href="/login" {...rest}>Login</Button>
{/if}
