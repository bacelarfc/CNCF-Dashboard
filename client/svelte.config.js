import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: vitePreprocess({
    scss: {
      prependData: `
      @import 'src/styles/dashboard.scss';
      @import 'src/styles/logintest.scss'; 
      @import 'src/styles/filter.scss'; 
      @import 'src/styles/userDetails.scss'; 
    `
    },
  }),
};
