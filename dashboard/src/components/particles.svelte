<script>
    import Particles from "svelte-particles";

    let particlesConfig = {
        particles: {
            color: {
                value: "#000",
            },
            links: {
                enable: true,
                color: "#000",
            },
            move: {
                enable: true,
            },
        },
    }


    let onParticlesLoaded = (event) => {
        const particlesContainer = event.detail.particles
    }
</script>

<Particles
    id=tsparticles
    options="{particlesConfig}"
    on:particlesLoaded={onParticlesLoaded}
/>