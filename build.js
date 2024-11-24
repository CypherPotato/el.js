import * as esbuild from 'esbuild';

// Função pa
// build common
await esbuild.build({
    entryPoints: ['main.js'],
    bundle: true,
    outfile: `/dist/el.js`,
});

// build min
await esbuild.build({
    entryPoints: ['main.js'],
    bundle: true,
    minify: true,
    outfile: `/dist/el.min.js`,
});