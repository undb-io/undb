<script lang="ts">
	import { t } from '$lib/i18n'
	import { inviteModal } from '$lib/store/modal'
	import { trpc } from '$lib/trpc/client'
	import type { IRolesWithoutOwner } from '@undb/authz'
	import { inviteSchema } from '@undb/integrations'
	import { Button, Input, Select } from 'flowbite-svelte'
	import type { SelectOptionType } from 'flowbite-svelte/dist/types'

	let email = ''
	let role: IRolesWithoutOwner = 'viewer'

	const items: SelectOptionType[] = [
		{ value: 'admin', name: $t('admin', { ns: 'authz' }) },
		{ value: 'editor', name: $t('editor', { ns: 'authz' }) },
		{ value: 'viewer', name: $t('viewer', { ns: 'authz' }) },
	]

	const inviteMutation = trpc().invitation.invite.mutation({
		onSuccess(data, variables, context) {
			inviteModal.close()
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
			<Input placeholder={$t('email', { ns: 'common' })} bind:value={email} autocomplete="off" type="email">
				<i class="ti ti-mail" slot="left"></i>
			</Input>
		</div>
		<Select {items} bind:value={role} size="sm" class="col-span-1" />
	</div>

	<div class="flex justify-end">
		<Button disabled={!valid} size="sm" class="w-28" type="submit">
			{$t('invite', { ns: 'common' })}
		</Button>
	</div>
</form>
