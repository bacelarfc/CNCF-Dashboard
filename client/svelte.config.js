import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: vitePreprocess({
    scss: {
      // you can add global SCSS files to be accessible in every component
      prependData: `@import 'src/styles/dashboard.scss';`
    },
    // ...other preprocessors like PostCSS, TypeScript, etc.
  }),
  // ...other configurations
};
