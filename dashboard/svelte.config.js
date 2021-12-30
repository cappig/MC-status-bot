import preprocess from "svelte-preprocess";
import adapter from '@sveltejs/adapter-node';

const config = {
  preprocess: [preprocess({})],
  kit: {
    adapter: adapter()
  }
};

export default config;
