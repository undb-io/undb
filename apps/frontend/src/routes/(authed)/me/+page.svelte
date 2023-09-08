<script lang="ts">
	import { page } from '$app/stores'
	import Button from '$components/ui/button/button.svelte'
	import Input from '$components/ui/input/input.svelte'
	import { Label } from '$components/ui/label'
	import { t } from '$lib/i18n'
	import { createMutation } from '@tanstack/svelte-query'
	import type { IAttachmentItem } from '@undb/core'

	$: me = $page.data.me?.me
	let attachment: IAttachmentItem | undefined

	const upload = createMutation<any, unknown, FormData>({
		mutationKey: ['upload'],
		mutationFn: (body) =>
			fetch('/api/attachment/upload', {
				method: 'POST',
				body,
			}),
		async onSuccess(data, variables, context) {
			attachment = await data.json()
		},
	})

	const onChange = async (e: Event) => {
		const target = e.target as HTMLInputElement
		const files = target.files
		if (!files?.[0]) return
		const formData = new FormData()
		formData.set('file', files[0])
		$upload.mutate(formData)
	}

	const updateProfile = createMutation<unknown, unknown, { username?: string; avatar?: string | null }>({
		mutationKey: ['updateProfile'],
		mutationFn: (body) =>
			fetch('/api/auth/me', {
				method: 'PUT',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			}),
	})
</script>

<div class="space-y-10 divide-y divide-gray-900/10 px-4 sm:px-7">
	<div class="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
		<div class="">
			<h2 class="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
				{$t('Profile', { ns: 'auth' })}
			</h2>
			<p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-200/70">
				{$t('Profile Helper', { ns: 'auth' })}
			</p>
		</div>

		<form
			class="bg-white shadow-md ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2 dark:bg-slate-800/75"
			on:submit={() => {
				$updateProfile.mutate({
					username: me?.username,
					avatar: attachment?.url ?? me.avatar,
				})
			}}
		>
			<div class="px-4 py-6 sm:p-8">
				<div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
					<div class="sm:col-span-4">
						<Label for="username" class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
							{$t('username', { ns: 'auth' })}
						</Label>
						<div class="mt-2">
							<div
								class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
							>
								<Input
									type="text"
									name="username"
									id="username"
									bind:value={me.username}
									class="block flex-1 border-0 bg-transparent py-1.5 text-gray-900 dark:text-gray-200 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
									placeholder={$t('username', { ns: 'auth' })}
								/>
							</div>
						</div>
					</div>

					<div class="col-span-full">
						<Label class="space-y-2 mb-2">
							<span>{$t('avatar', { ns: 'auth' })}</span>
							<Input type="file" accept="image/png, image/jpeg" on:change={onChange} />
						</Label>
						{#if attachment}
							<img src={attachment.url} alt={attachment.name} />
						{:else if me.avatar}
							<img src={me.avatar} alt={me.username} />
						{/if}
					</div>
				</div>
			</div>
			<div class="flex items-center justify-between gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
				<div class="text-gray-400">
					{$page.data.appInfo.version}
				</div>
				<Button type="submit" disabled={$updateProfile.isLoading}>
					{$t('Confirm', { ns: 'common' })}
				</Button>
			</div>
		</form>
	</div>
</div>
