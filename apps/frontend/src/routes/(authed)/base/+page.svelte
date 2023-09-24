<script lang="ts">
	import { page } from '$app/stores'
	import { Input } from '$components/ui/input'
	import Bases from '$lib/base/Bases.svelte'
	import { t } from '$lib/i18n'
	import type { PageData } from './$types'

	export let data: PageData

	let q = ''
</script>

<main class="container py-6">
	<Input bind:value={q} placeholder={$t('search', { ns: 'base' })}></Input>

	<h3 class="font-semibold my-4">Base</h3>

	<Bases bases={data.bases.bases} />
</main>
