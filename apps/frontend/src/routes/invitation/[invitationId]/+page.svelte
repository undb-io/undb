<script lang="ts">
	import type { PageData } from './$types'
	import logo from '$lib/assets/logo.svg'
	import { trpc } from '$lib/trpc/client'
	import { goto } from '$app/navigation'

	export let data: PageData

	$: invitation = data.invitation.invitation ?? null

	const acceptInvitationMutation = trpc().invitation.accept.mutation({
		async onSuccess(data, variables, context) {
			if (!invitation) return
			await goto('/register?email=' + invitation.email)
		},
	})

	const acceptInvitation = () => {
		if (!invitation) return
		$acceptInvitationMutation.mutate({
			id: invitation.id,
		})
	}
</script>

{#if invitation}
	<section class="max-w-2xl px-6 py-8 mx-auto bg-white dark:bg-gray-900">
		<header>
			<img class="h-6 w-auto" src={logo} alt="undb" />
		</header>

		<main class="mt-8">
			<h2 class="text-gray-700 dark:text-gray-200 font-semibold">Hi {invitation.email},</h2>

			<p class="mt-2 leading-loose text-gray-600 dark:text-gray-300">
				Alicia has invited you to join
				<span class="font-semibold">undb</span>.
			</p>

			<button
				class="px-6 py-2 mt-4 text-sm font-medium tracking-wider text-white capitalize transition-colors duration-300 transform bg-primary-600 rounded-lg hover:bg-primary-500 focus:outline-none focus:ring focus:ring-primary-300 focus:ring-opacity-80"
				on:click={acceptInvitation}
			>
				Accept the invite
			</button>

			<p class="mt-8 text-gray-600 dark:text-gray-300">
				Thanks,
				<br />
				undb team
			</p>
		</main>
	</section>
{/if}
