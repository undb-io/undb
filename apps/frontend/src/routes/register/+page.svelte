<script lang="ts">
	import type { PageData } from './$types'
	import { superForm } from 'sveltekit-superforms/client'
	import { goto } from '$app/navigation'
	import { createMutation } from '@tanstack/svelte-query'
	import logo from '$lib/assets/logo.svg'
	import { page } from '$app/stores'
	import { t } from '$lib/i18n'
	import { Button } from '$components/ui/button'
	import { Input } from '$components/ui/input'
	import { Label } from '$components/ui/label'
	import { toast } from 'svelte-sonner'

	export let data: PageData

	const register = createMutation<unknown, unknown, { email: string; password: string }>({
		mutationKey: ['register'],
		mutationFn: async (body) => {
			const response = await fetch('/api/auth/register', {
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
		onUpdate(event) {
			$register.mutate(event.form.data)
		},
	})
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<img class="mx-auto h-10 w-auto" src={logo} alt="undb" />
		<h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
			{$t('register to undb', { ns: 'auth' })}
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<form class="space-y-6" action="/register" method="POST" use:enhance>
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
				<Label for="email" class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
					>{$t('password', { ns: 'auth' })}</Label
				>
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
				<Button size="sm" type="submit" class="w-full">{$t('register', { ns: 'auth' })}</Button>
			</div>
		</form>

		<p class="mt-10 text-center text-sm text-gray-500">
			{$t('has account', { ns: 'auth' })}
			<a class="ml-1 text-primary" href="/login">{$t('login', { ns: 'auth' })}</a>
		</p>
	</div>
</div>
