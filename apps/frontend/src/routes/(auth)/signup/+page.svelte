<script lang="ts">
  import { page } from "$app/stores"
  import type { PageData } from "./$types"
  import Signup from "$lib/components/blocks/auth/signup.svelte"
  import Logo from "$lib/images/logo.svg"
  import { goto } from "$app/navigation"
  import { LL } from "@undb/i18n/client"
  import { Button } from "$lib/components/ui/button"

  export let data: PageData

  $: invitationId = $page.url.searchParams.get("invitationId")
  $: redirect = $page.url.searchParams.get("redirect")

  $: showBanner = !!invitationId
</script>

{#if showBanner}
  <div
    id="sticky-banner"
    tabindex="-1"
    class="fixed start-0 top-0 z-50 flex w-full justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700"
  >
    <div class="mx-auto flex items-center">
      <p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
        <span
          class="me-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 p-1 dark:bg-gray-600"
        >
          <svg
            class="h-3 w-3 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 19"
          >
            <path
              d="M15 1.943v12.114a1 1 0 0 1-1.581.814L8 11V5l5.419-3.871A1 1 0 0 1 15 1.943ZM7 4H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2v5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V4ZM4 17v-5h1v5H4ZM16 5.183v5.634a2.984 2.984 0 0 0 0-5.634Z"
            />
          </svg>
          <span class="sr-only">Light bulb</span>
        </span>
        <span>{$LL.auth.createAccountAndAcceptInvitation()}</span>
      </p>
    </div>
    <div class="flex items-center">
      <button
        on:click={() => (showBanner = false)}
        data-dismiss-target="#sticky-banner"
        type="button"
        class="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
      >
        <svg class="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
        <span class="sr-only">Close banner</span>
      </button>
    </div>
  </div>
{/if}

<section class="w-[450px] -translate-y-20 space-y-5">
  <div class="flex justify-center">
    <img src={Logo} alt="undb" class="h-12 w-12" />
  </div>

  <div class="rounded-md border p-6 shadow-sm">
    <h3 class="text-xl font-semibold tracking-tight">Undb {$LL.auth.register()}</h3>
    <p class="text-muted-foreground mb-4 mt-2 text-sm">{$LL.auth.enterYourInformationToCreateAnAccount()}</p>
    <Signup
      {redirect}
      {invitationId}
      email={$page.url.searchParams.get("email")}
      githubEnabled={!!data.oauth?.github?.enabled}
      googleEnabled={!!data.oauth?.google?.enabled}
      onSuccess={async () => {
        if (redirect) {
          window.location.href = redirect
        } else {
          await goto("/")
        }
      }}
    />
  </div>
  <div>
    <Button href="/playground" variant="link" class="w-full" size="sm">Try Undb Playground</Button>
    <p class="text-muted-foreground w-full text-center text-xs">Without register</p>
  </div>
</section>
