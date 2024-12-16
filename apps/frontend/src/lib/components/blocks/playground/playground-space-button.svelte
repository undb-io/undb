<script lang="ts">
  import { Button, type Props as ButtonProps } from "$lib/components/ui/button"
  import { LL } from "@undb/i18n/client"

  type Props = {
    isLoggedIn: boolean
    size: ButtonProps["size"]
  }

  let { isLoggedIn, ...rest }: Props = $props()
</script>

{#if isLoggedIn}
  <Button href="/" {...rest}>{$LL.auth.gotoSpace()}</Button>
{:else}
  <Button href="/login" {...rest}>{$LL.auth.login()}</Button>
{/if}
