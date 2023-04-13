import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'dist/muse.js',
  output: {
    dir: 'bundle/muse.js',
    format: 'umd'
  },
  plugins: [resolve()]
};