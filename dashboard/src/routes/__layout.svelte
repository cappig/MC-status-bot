<script>
  import Nav from "../components/nav.svelte"
  import Footer from "../components/footer.svelte"
</script>

<div class="relative p-8 min-h-screen h-screen w-screen">
  <Nav />
  <slot />
</div>


<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>