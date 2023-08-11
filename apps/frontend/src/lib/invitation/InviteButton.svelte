<script lang="ts">
	import { t } from '$lib/i18n'
	import { trpc } from '$lib/trpc/client'
	import { Button } from 'flowbite-svelte'

	const inviteMutation = trpc().invitation.invite.mutation({})
</script>

<Button class="w-36" on:click={() => $inviteMutation.mutate({})}>
	{$t('invite', { ns: 'common' })}
</Button>
