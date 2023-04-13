import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'dist/muse.js',
  output: {
    dir: 'bundle/',
    format: 'cjs'
  },
  plugins: [commonjs()]
};