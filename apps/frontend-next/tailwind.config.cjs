const config = {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {},
		colors: {
			indigo: '#5C7CFA',
		},
	},

	plugins: [require('flowbite/plugin'), require('@tailwindcss/forms')],
	darkMode: 'class',
}

module.exports = config
