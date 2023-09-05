<script lang="ts">
	import { t } from '$lib/i18n'
	import { inviteModal } from '$lib/store/modal'
	import { trpc } from '$lib/trpc/client'
	import type { IRolesWithoutOwner } from '@undb/authz'
	import { inviteSchema } from '@undb/integrations'
	import { Input } from '$lib/components/ui/input'
	import * as Select from '$lib/components/ui/select'
	import { Button } from '$lib/components/ui/button'

	let email = ''
	let role: IRolesWithoutOwner = 'viewer'

	const items = [
		{ value: 'admin', name: $t('admin', { ns: 'authz' }) },
		{ value: 'editor', name: $t('editor', { ns: 'authz' }) },
		{ value: 'viewer', name: $t('viewer', { ns: 'authz' }) },
	]
	const getInvitations = trpc().invitation.list.query({}, { enabled: false })

	const inviteMutation = trpc().invitation.invite.mutation({
		async onSuccess(data, variables, context) {
			inviteModal.close()
			await $getInvitations.refetch()
		},
	})

	$: valid = inviteSchema.safeParse({ email, role }).success

	const invite = () => {
		$inviteMutation.mutate({
			email,
			role,
		})
	}
</script>

<form class="space-y-4" on:submit={invite}>
	<div class="grid grid-cols-4 items-center gap-2">
		<div class="col-span-3">
			<Input placeholder={$t('email', { ns: 'common' })} bind:value={email} autocomplete="off" type="email"></Input>
		</div>
		<Select.Root bind:value={role}>
			<Select.Trigger>
				<Select.Value />
			</Select.Trigger>
			<Select.Content>
				{#each items as item}
					<Select.Item value={item.value}>
						{item.name}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<div class="flex justify-end">
		<Button disabled={!valid} size="sm" class="w-28" type="submit">
			{$t('invite', { ns: 'common' })}
		</Button>
	</div>
</form>
