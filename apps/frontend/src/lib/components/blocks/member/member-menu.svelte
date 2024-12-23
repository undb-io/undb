<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import * as Avatar from "$lib/components/ui/avatar"
  import {
    ExternalLinkIcon,
    KeyIcon,
    LogOutIcon,
    SettingsIcon,
    SearchIcon,
    EarthIcon,
    PipetteIcon,
  } from "lucide-svelte"
  import { createMutation } from "@tanstack/svelte-query"
  import { goto } from "$app/navigation"
  import Logo from "$lib/images/logo.svg"
  import GithubLogo from "$lib/images/github.svg"
  import { loadLocaleAsync, type Locales, setLocale } from "@undb/i18n/client"
  import { LL } from "@undb/i18n/client"

  export let user: { avatar: string | null; username: string; userId: string }

  const logoutMutation = createMutation({
    mutationFn: () => fetch("/api/logout", { method: "POST" }),
    onSuccess(data, variables, context) {
      goto("/login")
    },
  })

  const logout = () => {
    $logoutMutation.mutate()
  }

  const changeLanguage = async (lang: Locales) => {
    await loadLocaleAsync(lang)
    await fetch(`/api/lang/${lang}`, { method: "POST" })
    setLocale(lang)
    localStorage.setItem("lang", lang)
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button builders={[builder]} class="w-full justify-start gap-2" variant="link" size="sm">
      <Avatar.Root class="h-6 w-6">
        <Avatar.Image src={user.avatar} alt={user.username} />
        <Avatar.Fallback>{user.username.slice(0, 2)}</Avatar.Fallback>
      </Avatar.Root>

      <span>
        {user.username}
      </span>
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content sameWidth>
    <DropdownMenu.Group>
      <DropdownMenu.Label>{$LL.common.accountAndSpaceSettings()}</DropdownMenu.Label>
      <DropdownMenu.Separator />
      <DropdownMenu.Item on:click={logout}>
        <LogOutIcon class="mr-2 h-4 w-4" />
        {$LL.account.logout()}
      </DropdownMenu.Item>
      <DropdownMenu.Item href="/account/profile">
        <SettingsIcon class="mr-2 h-4 w-4" />
        {$LL.account.accountSettings()}
      </DropdownMenu.Item>
      <DropdownMenu.Item href="/account/token">
        <KeyIcon class="mr-2 h-4 w-4" />
        {$LL.account.apiToken()}
      </DropdownMenu.Item>
      <DropdownMenu.Item href="/playground">
        <PipetteIcon class="mr-2 h-4 w-4" />
        {$LL.playground.playgroundMode()}
      </DropdownMenu.Item>
      <DropdownMenu.Item href="https://undb.io/templates" target="_blank" rel="noopener noreferrer">
        <img src={Logo} alt="undb" class="mr-2 h-4 w-4" />
        {$LL.account.undbTemplates()}
        <ExternalLinkIcon class="ml-auto h-4 w-4" />
      </DropdownMenu.Item>
      <DropdownMenu.Item href="https://undb.io" target="_blank" rel="noopener noreferrer">
        <img src={Logo} alt="undb" class="mr-2 h-4 w-4" />
        {$LL.account.undbWebsite()}
        <ExternalLinkIcon class="ml-auto h-4 w-4" />
      </DropdownMenu.Item>
      <DropdownMenu.Item href="https://github.com/undb-io/undb" target="_blank" rel="noopener noreferrer">
        <img src={GithubLogo} alt="undb" class="mr-2 h-4 w-4" />
        Github
        <ExternalLinkIcon class="ml-auto h-4 w-4" />
      </DropdownMenu.Item>
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger>
          <EarthIcon class="mr-2 h-4 w-4" />
          {$LL.common.language()}
        </DropdownMenu.SubTrigger>
        <DropdownMenu.SubContent>
          <DropdownMenu.Item on:click={() => changeLanguage("en")}>English</DropdownMenu.Item>
          <DropdownMenu.Item on:click={() => changeLanguage("zh")}>中文</DropdownMenu.Item>
          <DropdownMenu.Item on:click={() => changeLanguage("ja")}>日本語</DropdownMenu.Item>
          <DropdownMenu.Item on:click={() => changeLanguage("ko")}>한국어</DropdownMenu.Item>
          <DropdownMenu.Item on:click={() => changeLanguage("es")}>Español</DropdownMenu.Item>
          <DropdownMenu.Item on:click={() => changeLanguage("pt")}>Português</DropdownMenu.Item>
        </DropdownMenu.SubContent>
      </DropdownMenu.Sub>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
