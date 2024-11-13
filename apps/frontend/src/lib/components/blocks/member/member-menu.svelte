<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import * as Avatar from "$lib/components/ui/avatar"
  import { ExternalLinkIcon, KeyIcon, LogOutIcon, SettingsIcon } from "lucide-svelte"
  import { createMutation } from "@tanstack/svelte-query"
  import { goto } from "$app/navigation"
  import Logo from "$lib/images/logo.svg"
  import GithubLogo from "$lib/images/github.svg"

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
      <DropdownMenu.Label>Account & Space Settings</DropdownMenu.Label>
      <DropdownMenu.Separator />
      <DropdownMenu.Item on:click={logout}>
        <LogOutIcon class="mr-2 h-4 w-4" />
        Log Out
      </DropdownMenu.Item>
      <DropdownMenu.Item href="/account/profile">
        <SettingsIcon class="mr-2 h-4 w-4" />
        Account Settings
      </DropdownMenu.Item>
      <DropdownMenu.Item href="/account/token">
        <KeyIcon class="mr-2 h-4 w-4" />
        Api Token
      </DropdownMenu.Item>
      <DropdownMenu.Item href="https://undb.io/templates" target="_blank" rel="noopener noreferrer">
        <img src={Logo} alt="undb" class="mr-2 h-4 w-4" />
        Undb Templates
        <ExternalLinkIcon class="ml-auto h-4 w-4" />
      </DropdownMenu.Item>
      <DropdownMenu.Item href="https://undb.io" target="_blank" rel="noopener noreferrer">
        <img src={Logo} alt="undb" class="mr-2 h-4 w-4" />
        Undb Website
        <ExternalLinkIcon class="ml-auto h-4 w-4" />
      </DropdownMenu.Item>
      <DropdownMenu.Item href="https://github.com/undb-io/undb" target="_blank" rel="noopener noreferrer">
        <img src={GithubLogo} alt="undb" class="mr-2 h-4 w-4" />
        Github
        <ExternalLinkIcon class="ml-auto h-4 w-4" />
      </DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
