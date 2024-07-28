<script lang="ts">
	import { Steps } from '../stores/steps';
	import { get } from 'svelte/store';
	import { cliVars, getValueFromName, updateVariable } from '../stores/variables';
	import { login } from '$lib/steps';
	let currentStep: number;
	$: currentStep = $Steps;
	let currentVars;
	$: currentVars = get(cliVars);

	// to do, remove this func
	const nextStep = () => {
		console.log('currentStep:', currentStep)
		console.log('Steps:', get(Steps));
	}

	const funcOfSteps = [openLogin, login];
	// used to bind with dialog input, client: false server: true
	let username = getValueFromName('username', false);
	let password = getValueFromName('password', false);

	function getStatusPrompt(sts: number) {
		switch (sts) {
			case 0:
				return 'start';
			// 5 is the last step of this demo
			case 5:
				return 'reset';
			default:
				return 'continue';
		}
	}

	function openLogin() {
		console.log('openLogin')
		const dialog = document.getElementById('loginDialog') as HTMLDialogElement;
		if (dialog) dialog.showModal();
	}
	function closeLogin() {
		const dialog = document.getElementById('loginDialog') as HTMLDialogElement;
		if (dialog) dialog.close();
		// restore username and password
		username = getValueFromName('username', false);
		password = getValueFromName('password', false);
	}
	function inputUserNameAndPassWord() {
		const dialog = document.getElementById('loginDialog') as HTMLDialogElement;
		if (dialog) dialog.close();
		// set username and password
		updateVariable({'name': "username",'value': username }, false);
		updateVariable({'name': "password",'value': password }, false);

		// update status
		Steps.update((sts) => sts + 1);
		console.log('currentStatus:', currentStep)
		console.log('Status:', get(Steps));
	}
</script>

<div class=" flex flex-col mt-4">
	<div
		class="w-full h-[100px] px-4 py-3 m-1 rounded-sm border border-[#e4e4e7] border-1[px] bg-darkgray text-lightgreen font-bold sm:min-h-[330px] mt-3 ml-3 sm:w-[250px]"
	>
		<i class="fas fa-bars"></i>

		<nav class="ml-2 mt-2 text-xs">
			<ul class="flex flex-col space-y-2 font-normal text-[14px]">
				<li>
					<button on:click={() => {
						funcOfSteps[currentStep]();
						}}>
						<i class="fas fa-play p-1 hover:bg-hoverbtnbg cursor-pointer">
							&nbsp {getStatusPrompt(currentStep)}
						</i>
					</button>
				</li>
				<li>
					<i class="fas fa-redo p-1 hover:bg-hoverbtnbg cursor-pointer"> &nbsp reset </i>
				</li>
			</ul>
		</nav>
	</div>
	<dialog id="loginDialog" class="rounded-sm">
		<div class="flex flex-col justify-start p-8 items-center overflow-auto h-[350px] w-300[px]">
		  <div class="overflow-hide">
			<span class="dialog-close" on:click={closeLogin}>&times;</span>
			<form on:submit={inputUserNameAndPassWord} class="flex flex-col text-darkgreen">
			  <label class="mt-4" for="username">Username</label>
			  <input class="mt-[4px] p-[8px] rounded-sm border-[1px] border-gray-300 " type="text" id="username" bind:value={username} required />
	  
			  <label class="mt-4" for="password">Password</label>
			  <input class="mt-[4px] p-[8px] rounded-sm border-[1px] border-gray-500" type="password" id="password" bind:value={password} required />
	  
			  <button class="mt-10 p-[10px] text-darkgreen font-bold rounded-sm border-[1px] border-gray-500 hover:cursor-pointer hover:border-[2px] hover:border-gray-800" type="submit">Login</button>
			</form>
		  </div>
		</div>
	  </dialog>
</div>
<style>
  .dialog-close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }

  .dialog-close:hover,
  .dialog-close:focus {
    color: darkgreen;
    text-decoration: none;
  }

</style>