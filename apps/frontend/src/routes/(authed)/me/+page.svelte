<script lang="ts">
	import { page } from '$app/stores'
	import { t } from '$lib/i18n'
	import { createMutation } from '@tanstack/svelte-query'
	import { Fileupload, Label } from 'flowbite-svelte'

	$: me = $page.data.me?.me
	let value: string
	let files: FileList

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

<div class="space-y-10 divide-y divide-gray-900/10">
	<div class="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
		<div class="px-4 sm:px-0">
			<h2 class="text-base font-semibold leading-7 text-gray-900">{$t('Profile', { ns: 'auth' })}</h2>
			<p class="mt-1 text-sm leading-6 text-gray-600">
				{$t('Profile Helper', { ns: 'auth' })}
			</p>
		</div>

		<form
			class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
			on:submit={() => {
				$updateProfile.mutate({ username: me?.username })
			}}
		>
			<div class="px-4 py-6 sm:p-8">
				<div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
					<div class="sm:col-span-4">
						<label for="username" class="block text-sm font-medium leading-6 text-gray-900"
							>{$t('username', { ns: 'auth' })}</label
						>
						<div class="mt-2">
							<div
								class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
							>
								<input
									type="text"
									name="username"
									id="username"
									bind:value={me.username}
									class="block flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
									placeholder={$t('username', { ns: 'auth' })}
								/>
							</div>
						</div>
					</div>

					<div class="col-span-full">
						<Label class="space-y-2 mb-2">
							<span>{$t('avatar', { ns: 'auth' })}</span>
							<Fileupload bind:value bind:files accept="image/png, image/jpeg" />
						</Label>
					</div>
				</div>
			</div>
			<div class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
				<button
					type="submit"
					disabled={$updateProfile.isLoading}
					class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>{$t('Confirm', { ns: 'common' })}</button
				>
			</div>
		</form>
	</div>
</div>
