<script lang="ts">
	import { Button, A, Toast } from 'flowbite-svelte'
	import type { PageData } from './$types'
	import { superForm } from 'sveltekit-superforms/client'
	import { goto } from '$app/navigation'
	import { createMutation } from '@tanstack/svelte-query'
	import logo from '$lib/assets/logo.svg'
	import { page } from '$app/stores'
	import { slide } from 'svelte/transition'
	import { t } from '$lib/i18n'

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
		<h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
			{$t('register to undb', { ns: 'auth' })}
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<form class="space-y-6" action="/register" method="POST" use:enhance>
			<div>
				<label for="email" class="block text-sm font-medium leading-6 text-gray-900"
					>{$t('email', { ns: 'auth' })}</label
				>
				<div class="mt-2">
					<input
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
				<label for="email" class="block text-sm font-medium leading-6 text-gray-900"
					>{$t('password', { ns: 'auth' })}</label
				>
				<div class="mt-2">
					<input
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
				<Button type="submit" class="w-full">{$t('register', { ns: 'auth' })}</Button>
			</div>
		</form>

		<p class="mt-10 text-center text-sm text-gray-500">
			{$t('has account', { ns: 'auth' })}
			<A class="ml-1" href="/login">{$t('login', { ns: 'auth' })}</A>
		</p>
	</div>
</div>

{#if $register.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$register.error}
		</span>
	</Toast>
{/if}
