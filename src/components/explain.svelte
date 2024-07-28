<script>
	import { Steps } from '../stores/steps';

	const nowList = [
		'No username or password entered yet (or after entering a wrong username/password).', 
		'Username and password are entered.', 
		'Successfully logged in. Access token and refresh token are received.', 
		'step 3', 
		'step 4'];
	const nextList = [
		'Pop up a dialog asking for enter username and password.', 
		'Send username and password to the server. If password and username is correct, the server will return a access token and a refresh token.', 
		'Use access token to access protected resources.', 
		'step 3', 
		'step 4'
	];

	export let step = 0;
	$: step = $Steps;
</script>

<div class="text-sm">
	<div class="flex flex-col items-start p-2 bg-white">
		<p class="text-statustitle">Now--></p>
		<div class="text-darkgray h-10 w-full">
			{nowList[step]}
		</div>
		<p class="text-nexttitle">Next Step--></p>
		<div class="text-darkgray h-10 w-full">
			{nextList[step]}
		</div>
	</div>
</div>
