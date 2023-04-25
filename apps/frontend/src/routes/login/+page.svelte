<script lang="ts">
	import { Button, A } from 'flowbite-svelte'
	import type { PageData } from './$types'
	import { superForm } from 'sveltekit-superforms/client'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'

	export let data: PageData

	const { form, enhance, constraints } = superForm(data.form, {
		SPA: true,
		async onUpdate(event) {
			await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(event.form.data),
			})

			await goto($page.url.searchParams.get('redirectTo') || '/')
		},
	})
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<img
			class="mx-auto h-10 w-auto"
			src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
			alt="Your Company"
		/>
		<h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to undb</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<form class="space-y-6" method="POST" use:enhance>
			<div>
				<label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
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
				<div class="flex items-center justify-between">
					<label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
					<div class="text-sm">
						<a tabindex="-1" href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
					</div>
				</div>
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
				<Button type="submit" class="w-full">Login</Button>
			</div>
		</form>

		<p class="mt-10 text-center text-sm text-gray-500">
			Not a member?
			<A class="ml-1" href="/register">Register</A>
		</p>
	</div>
</div>
