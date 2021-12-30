<script>
    import {fly} from 'svelte/transition'
    import { onMount } from 'svelte';

    // Animate the cards on load
    let ready = false;
    onMount(() => ready = true);
</script>

<svelte:head>
    <title>Mc status | landing page</title>
</svelte:head>

<div class="relative max-w-5xl mx-auto pt-36">
    <!-- Title -->
    <h1 class="text-center text-6xl font-bold text-gray-50">Mc status bot</h1>
    <h2 class="text-center text-2`xl text-gray-400 mt-8 mx-auto max-w-3xl">
        A versatile Discord bot that allows you to easaly display, log and graph the status of a Minecraft server. Lorem ipsum dolor sit amet.
    </h2>

    <!-- Buttons -->
    <div class="mt-24 flex justify-center text-sm">
        <a href="https://discord.com/oauth2/authorize?client_id=816747912888975362&scope=bot&permissions=268749904" class="mr-8 inline-flex items-center px-5 py-3 text-base font-medium text-center text-indigo-100 border border-transparent rounded-lg shadow-sm cursor-pointer hover:border-indigo-500 bg-gradient-to-br from-blue-800/40 via-indigo-800/40 to-sky-800/40">
            <img class="w-5 h-5 mr-2" src="discordlogo.svg" alt="discord_logo">            
            <span class="relative">Add to discord</span>
        </a>
    
        <a href="/dash" class="px-5 py-3 text-base font-medium text-center text-indigo-100 border border-transparent rounded-lg shadow-sm cursor-pointer hover:border-indigo-500 bg-gradient-to-br from-blue-800/10 via-indigo-800/10 to-sky-800/10">
            <span class="relative">Open dashboard</span>
        </a>
    </div>

    <!-- Cards -->
    {#if ready}
        <div class="mt-36 flex justify-center space-x-20" in:fly="{{ y: 100, duration: 2000 }}">
            <div class="relative block p-8 border border-gray-400 bg-sky-200/5 shadow-2xl rounded-xl w-2/5">
                <div class="mt">
                    <h1 class="w-12 h-12 rounded-lg inline-flex items-center justify-center text-2xl bg-sky-200/5 font-serif">
                        🔧
                    </h1>
            
                    <h5 class="mt-5 text-xl font-bold text-gray-200">Free and open source</h5>
                
                    <p class="hidden mt-2 text-sm text-gray-400 sm:block">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque nulla, dictum eget.
                    </p>
                </div>
            </div>

            <div class="relative block p-8 border border-gray-400 bg-sky-200/5 shadow-2xl rounded-xl w-2/5">
                <div class="mt">
                    <h1 class="w-12 h-12 rounded-lg inline-flex items-center justify-center text-2xl bg-sky-200/5 font-serif">
                        ⚡
                    </h1>
            
                    <h5 class="mt-5 text-xl font-bold text-gray-200">Easy to set up</h5>
                
                    <p class="hidden mt-2 text-sm text-gray-400 sm:block">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque nulla, dictum eget.
                    </p>
                </div>
            </div>
        </div>

        <div class="mt-20 flex justify-center space-x-20" in:fly="{{ y: 100, duration: 2000, delay: 500 }}">
            <div class="relative block p-8 border border-gray-400 bg-sky-200/5 shadow-2xl rounded-xl w-2/5">
                <div class="mt">
                    <h1 class="w-12 h-12 rounded-lg inline-flex items-center justify-center text-2xl bg-sky-200/5 font-serif">
                        🔮
                    </h1>
            
                    <h5 class="mt-5 text-xl font-bold text-gray-200">Free and open source</h5>
                
                    <p class="hidden mt-2 text-sm text-gray-400 sm:block">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque nulla, dictum eget.
                    </p>
                </div>
            </div>

            <div class="relative block p-8 border border-gray-400 bg-sky-200/5 shadow-2xl rounded-xl w-2/5">
                <div class="mt">
                    <h1 class="w-12 h-12 rounded-lg inline-flex items-center justify-center text-2xl bg-sky-200/5 font-serif">
                        🤖
                    </h1>
            
                    <h5 class="mt-5 text-xl font-bold text-gray-200">Easy to set up</h5>
                
                    <p class="hidden mt-2 text-sm text-gray-400 sm:block">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque nulla, dictum eget.
                    </p>
                </div>
            </div>
        </div>
    {/if}
</div>