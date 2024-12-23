<script lang="ts">
  import Logo from "$lib/images/logo.svg"
  import { goto } from "$app/navigation"
  import { LL } from "@undb/i18n/client"
  import LoginWithOtp from "$lib/components/blocks/auth/login-with-otp.svelte"
</script>

<section class="w-[450px] -translate-y-20 space-y-5">
  <div class="flex justify-center">
    <img src={Logo} alt="undb" class="h-12 w-12" />
  </div>

  <div class="rounded-md border p-6 shadow-sm">
    <h3 class="text-xl font-semibold tracking-tight">Undb {$LL.auth.loginWith({ provider: "One-time password" })}</h3>
    <LoginWithOtp />
  </div>
</section>
