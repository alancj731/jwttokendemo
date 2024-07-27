/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{svelte, html, js, ts}'],
	theme: {
		extend: {
			colors: {
				darkgray: '#0F0F0F',
				darkgreen: '#005B41',
				lightgreen: '#008170',
				hoverbtnbg: '#EEEEEE',
				logscontent: '#1B262C',
				logstitle: '#FF4301',
				vartitle: '#F2F7A1',
				varcontent: '#F4EEE0'
			}
		}
	},
	plugins: []
};
