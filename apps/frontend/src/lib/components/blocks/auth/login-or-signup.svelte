<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs"
  import Login from "./login.svelte"
  import Signup from "./signup.svelte"

  export let registrationEnabled: boolean
  export let redirect: string | null
  export let onSuccess: () => void = () => {}
  export let githubEnabled: boolean
  export let googleEnabled: boolean
  export let invitationId: string | null
  export let email: string | null
</script>

<Tabs.Root value="login" class="w-full">
  <Tabs.List class="w-full">
    <Tabs.Trigger value="login" class="flex-1">Login</Tabs.Trigger>
    <Tabs.Trigger value="signup" class="flex-1">Signup</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="login">
    <Login {registrationEnabled} {redirect} {onSuccess} {githubEnabled} {googleEnabled} />
  </Tabs.Content>
  <Tabs.Content value="signup">
    <Signup {redirect} {onSuccess} {githubEnabled} {googleEnabled} {invitationId} {email} />
  </Tabs.Content>
</Tabs.Root>
