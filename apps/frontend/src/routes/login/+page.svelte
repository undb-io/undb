<script lang="ts">
	import type { PageData } from './$types'
	import { superForm } from 'sveltekit-superforms/client'
	import { goto } from '$app/navigation'
	import logo from '$lib/assets/logo.svg'
	import { page } from '$app/stores'
	import { createMutation } from '@tanstack/svelte-query'
	import { env } from '$env/dynamic/public'
	import { t } from '$lib/i18n'
	import { Button } from '$components/ui/button'
	import { Input } from '$components/ui/input'
	import { Label } from '$components/ui/label'
	import { toast } from 'svelte-sonner'

	export let data: PageData

	const login = createMutation<unknown, unknown, { email: string; password: string }>({
		mutationKey: ['login'],
		mutationFn: async (body) => {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			})
			if (!response.ok) {
				const text = await response.text()
				const { code } = JSON.parse(text)

				throw new Error($t(code, { ns: 'error' }) ?? undefined)
			}
			return response.json()
		},

		async onSuccess(data, variables, context) {
			await goto($page.url.searchParams.get('redirectTo') || '/', { replaceState: true, invalidateAll: true })
		},

		onError(error, variables, context) {
			toast.error(error.message)
		},
	})

	const { form, enhance, constraints } = superForm(data.form, {
		SPA: true,
		taintedMessage: null,
		validators: false,
		dataType: 'json',
		clearOnSubmit: 'errors-and-message',
		resetForm: false,
		invalidateAll: false,
		onUpdate(event) {
			$login.mutate(event.form.data)
		},
	})

	const { PUBLIC_UNDB_ADMIN_EMAIL, PUBLIC_UNDB_ADMIN_PASSWORD } = env
	$: {
		$form.email = PUBLIC_UNDB_ADMIN_EMAIL ?? ''
		$form.password = PUBLIC_UNDB_ADMIN_PASSWORD ?? ''
	}
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<img class="mx-auto h-10 w-auto" src={logo} alt="undb" />
		<h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
			{$t('login to undb', { ns: 'auth' })}
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<form class="space-y-6" method="POST" use:enhance>
			<div>
				<Label for="email" class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
					>{$t('email', { ns: 'auth' })}</Label
				>
				<div class="mt-2">
					<Input
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						required
						bind:value={$form.email}
						{...$constraints.email}
						class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<div class="flex items-center justify-between">
					<Label for="password" class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
						>{$t('password', { ns: 'auth' })}</Label
					>
					<!-- <div class="text-sm">
						<a tabindex="-1" href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
					</div> -->
				</div>
				<div class="mt-2">
					<Input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						bind:value={$form.password}
						{...$constraints.password}
						class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<Button size="sm" type="submit" class="w-full">{$t('login', { ns: 'auth' })}</Button>
			</div>
		</form>

		<p class="mt-10 text-center text-sm text-gray-500">
			{$t('has no account', { ns: 'auth' })}
			<a class="ml-1 text-primary" href="/register">{$t('register', { ns: 'auth' })}</a>
		</p>
	</div>
</div>

{#if !!PUBLIC_UNDB_ADMIN_EMAIL && !!PUBLIC_UNDB_ADMIN_PASSWORD}
	<div
		class="absolute top-0 left-0 right-0 h-14 border-b border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center dark:bg-gray-700 dark:text-white dark:border-gray-800"
	>
		<p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
			<span class="inline-flex p-1 mr-3 bg-gray-200 rounded-full dark:bg-gray-600">
				<i class="ti ti-bulb-filled" />
			</span>
			<span
				>{@html $t('demo', {
					ns: 'common',
					email: PUBLIC_UNDB_ADMIN_EMAIL,
					password: PUBLIC_UNDB_ADMIN_PASSWORD,
				})}</span
			>
		</p>
	</div>
{/if}
