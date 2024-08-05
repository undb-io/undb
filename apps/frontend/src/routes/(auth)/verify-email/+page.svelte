<script lang="ts">
  import { goto } from "$app/navigation"
  import Button from "$lib/components/ui/button/button.svelte"
  import { OTPInput, OTPRoot } from "@jimmyverburgt/svelte-input-otp"
  import { createMutation } from "@tanstack/svelte-query"
  import { LoaderCircleIcon } from "lucide-svelte"
  import Minus from "lucide-svelte/icons/minus"

  let otpref: any

  let value = ""

  function handleOtpComplete(otp: string) {
    $verifyMutation.mutate()
  }

  const verifyMutation = createMutation({
    mutationFn: () =>
      fetch("/api/email-verification", {
        method: "POST",
        body: JSON.stringify({ code: value }),
      }),
    mutationKey: ["verify-email"],
    async onSuccess(data, variables, context) {
      await goto("/")
    },
  })
</script>

<section class="space-y-5">
  <h1 class="text-center text-2xl font-bold">Enter Verification Code</h1>
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
    Don&apos;t have an account?
    <a href="/signup" class="underline"> Sign up </a>
  </div>
</section>
