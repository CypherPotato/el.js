import * as esbuild from 'esbuild';

// Função pa
// build common
await esbuild.build({
    entryPoints: ['main.js'],
    bundle: true,
    target: 'es6',
    outfile: `/dist/el.js`,
});

// build min
await esbuild.build({
    entryPoints: ['main.js'],
    bundle: true,
    minify: true,
    target: 'es6',
    outfile: `/dist/el.min.js`,
});