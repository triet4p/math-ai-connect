// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const owner = 'triet4p';
const repo = 'math-ai-connect';

function graphIntegration() {
  return {
    name: 'graph-build-integration',
    hooks: {
      'astro:build:done': async (/** @type {{ dir: URL }} */ { dir }) => {
        const { buildGraphData } = await import('./src/scripts/build-graph.ts');
        await buildGraphData(dir);
      }
    }
  };
}

// https://astro.build/config
export default defineConfig({
  site: `https://${owner}.github.io`,
  base: `/${repo}/`,
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex]
  },
  integrations: [
    mdx(),
    graphIntegration()
  ]
});