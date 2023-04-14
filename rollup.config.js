import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'dist/muse.js',
  output: {
    dir: 'bundle/',
    format: 'esm'
  },
  plugins: [resolve()]
};