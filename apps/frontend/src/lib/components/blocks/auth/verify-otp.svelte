<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js"
  import { createMutation } from "@tanstack/svelte-query"
  import { z } from "@undb/zod"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form"
  import { LoaderCircleIcon } from "lucide-svelte"
  import { LL } from "@undb/i18n/client"
  import { page } from "$app/stores"
  import { goto } from "$app/navigation"
  import Button from "$lib/components/ui/button/button.svelte"
  import { OTPInput, OTPRoot } from "@jimmyverburgt/svelte-input-otp"
  import Minus from "lucide-svelte/icons/minus"

  export let email: string
  export let onSuccess: () => void = () => {}

  const schema = z.object({
    email: z.string().email(),
  })

  type sendOtpSchema = z.infer<typeof schema>

  let loginError = false

  const sendOtpMutation = createMutation({
    mutationFn: async (input: sendOtpSchema) => {
      try {
        const { ok } = await fetch("/api/auth/otp/request", { method: "POST", body: JSON.stringify(input) })
        if (!ok) {
          throw new Error($LL.auth.loginFailed())
        }
        return
      } catch (error) {
        loginError = true
      }
    },
    onMutate(variables) {
      loginError = false
    },
    async onSuccess(data, variables, context) {
      onSuccess()
    },
    async onError(error, variables, context) {
      loginError = true
    },
  })

  let otpref: any

  let value = ""

  function handleOtpComplete(otp: string) {
    $verifyMutation.mutate()
  }

  const verifyMutation = createMutation({
    mutationFn: () =>
      fetch("/api/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ otp: value, email }),
      }),
    mutationKey: ["verify-email"],
    async onSuccess(data, variables, context) {
      await goto("/")
    },
  })
</script>

<section class="space-y-5">
  <h1 class="text-center text-2xl font-bold">Enter One-time Password Code</h1>
  <OTPRoot
    bind:this={otpref}
    maxLength={6}
    bind:value
    autoFocus={true}
    onComplete={handleOtpComplete}
    className="flex items-center gap-2"
  >
    <div class="flex items-center">
      <OTPInput
        index={0}
        className="relative flex h-20 w-16 items-center justify-center border-y border-r border-input text-3xl transition-all first:rounded-l-md first:border-l last:rounded-r-md"
        focusClassName="z-10 ring-2 ring-ring ring-offset-background"
      />
      <OTPInput
        index={1}
        className="relative flex h-20 w-16 items-center justify-center border-y border-r border-input text-3xl transition-all first:rounded-l-md first:border-l last:rounded-r-md"
        focusClassName="z-10 ring-2 ring-ring ring-offset-background"
      />
      <OTPInput
        index={2}
        className="relative flex h-20 w-16 items-center justify-center border-y border-r border-input text-3xl transition-all first:rounded-l-md first:border-l last:rounded-r-md"
        focusClassName="z-10 ring-2 ring-ring ring-offset-background"
      />
    </div>
    <div class="mx-1">
      <Minus />
    </div>
    <div class="flex items-center">
      <OTPInput
        index={3}
        className="relative flex h-20 w-16 items-center justify-center border-y border-r border-input text-3xl transition-all first:rounded-l-md first:border-l last:rounded-r-md"
        focusClassName="z-10 ring-2 ring-ring ring-offset-background"
      />
      <OTPInput
        index={4}
        className="relative flex h-20 w-16 items-center justify-center border-y border-r border-input text-3xl transition-all first:rounded-l-md first:border-l last:rounded-r-md"
        focusClassName="z-10 ring-2 ring-ring ring-offset-background"
      />
      <OTPInput
        index={5}
        className="relative flex h-20 w-16 items-center justify-center border-y border-r border-input text-3xl transition-all first:rounded-l-md first:border-l last:rounded-r-md"
        focusClassName="z-10 ring-2 ring-ring ring-offset-background"
      />
    </div>
  </OTPRoot>

  <Button
    class="w-full"
    disabled={value.length < 6 || $verifyMutation.isPending || ($verifyMutation.isSuccess && !$verifyMutation.isError)}
    on:click={() => {
      $verifyMutation.mutate()
    }}
  >
    {#if $verifyMutation.isPending}
      <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
      Verifying Code
    {:else}
      Verify Code
    {/if}
  </Button>

  <div class="mt-4 text-center text-sm">
    Don&apos;t receive the code?
    <Button
      variant="link"
      class="underline"
      on:click={() => {
        $sendOtpMutation.mutate({ email })
      }}
    >
      Resend
    </Button>
  </div>
</section>
