<script lang="ts">
	import { browser } from '$app/environment'
	import { getTable } from '$lib/store/table'
	import type { IQRCodeField, QRCodeField, Record } from '@undb/core'
	import * as QRCode from 'qrcode'
	import { onMount } from 'svelte'

	export let field: QRCodeField | undefined
	export let record: Record | undefined

	const table = getTable()

	let el: HTMLImageElement | undefined

	$: if (browser && field && record) {
		const url = window.location.origin + '/t' + '/' + $table.id.value + '?r' + '=' + record.id.value

		QRCode.toDataURL(url, {}, (error, data) => {
			if (error !== null) return
			setTimeout(() => {
				if (el) {
					el.src = data
				}
			}, 0)
		})
	}

	onMount(() => {})
</script>

<img bind:this={el} src="" alt="" />
