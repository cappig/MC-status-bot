<script context="module">
	export async function load({fetch}) {
        let res;

        try {
            res = await fetch('http://127.0.0.1:3100/commands');
        } catch (e) {
            console.error(`An error has occurred while tring to fetch the commands: ${e}`)
            res = null;
        }

        if (res != null && res.ok) {
            const commands = await res.json()
            
            return {
                props: { commands },
            }
        } else {
            return {
                props: { commands: [null] },
            }
        }
    }
</script>

<script>
    import {fly} from 'svelte/transition'
    import { onMount } from 'svelte';

    // Get the commands
    export let commands;

    // Animate the cards on load
    let ready = false;
    onMount(() => ready = true);
    // in:fly="{{ y: 100, duration: 2000 }}"         
    // {#if filteredItems.lenght = 0}

    let inVlue = '';
    let filteredItems = [];

    $: {
        filteredItems = inVlue ? commands.filter(item => item.name.toLowerCase().includes(inVlue)) : commands
    }

    /*
	const handleInput = () => {
        console.log(inVlue);
        if (inVlue) {
            let query = inVlue.trim().toLowerCase()

            return filteredItems = commands.filter(item => 
                item.name.toLowerCase().includes(query)
            )
        }
	}
    */
</script>


<div class="relative max-w-5xl mx-auto mt-28">
    <div class="items-center">
        <h1 class="text-center text-4xl tracking-wide font-semibold text-gray-300">
            Bot commands
        </h1>
        <input bind:value={inVlue} type="text" class="block m-auto mt-8 bg-transparent focus:ring-0 focus:border-sky-200 rounded-md text-indigo-100 w-1/z" placeholder=" Look for a command 🔎 " autocomplete="off">    
    </div>

    <div class="mt-24 pb-20">
        {#if ready}
            {#if commands[0] == null}
                <h1 class="mt-8 text-center text-gray-300 text-xl">
                    An error has occurred while tring to fetch the commands!
                </h1>
                <h2 class="mt-2 text-center text-gray-400 text-lg">
                    Please contact the developes via the 
                    <a href="https://discord.gg/YzX5KdF4kq" class="text-sky-600 hover:underline">
                        support server
                    </a>
                </h2>
            {:else}
                {#each filteredItems as command, index}
                    <div class="mt-8 flex justify-center">
                        <div in:fly="{{ x: 100, duration: 2000, delay: index * 300 }}" class="relative block p-8 border border-gray-400 bg-sky-200/5 shadow-2xl rounded-xl w-2/3">
                            {#if command.admin == true}
                                <span class="absolute right-4 top-4 rounded-full px-3 py-1.5 bg-green-100 text-sky-700 font-medium text-xs">
                                    Admin
                                </span>
                            {/if}

                            <h5 class="mt text-xl font-bold text-gray-200">
                                {command.name.charAt(0).toUpperCase() + command.name.slice(1)}
                            </h5>
                            
                            <p class="hidden mt-2 text-sm text-gray-400 sm:block">
                                {command.description}
                            </p>
                        </div>
                    </div>
                {/each}
            {/if}        
        {/if}

    </div>

</div>
