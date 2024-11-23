import * as esbuild from 'esbuild';
import { promises as fs } from 'fs';
import { dirname, join } from 'path';

const version = process.env.npm_package_version;

// Função para copiar arquivos
async function copyFile(src, dest) {
    src = join(process.cwd(), src);
    dest = join(process.cwd(), dest);
    
    await fs.mkdir(dirname(dest), { recursive: true }); // Cria a pasta de destino se não existir
    await fs.copyFile(src, dest);
}

// build common
await esbuild.build({
    entryPoints: ['main.js'],
    bundle: true,
    outfile: `/dist/v${version}/el.js`,
});

// build min
await esbuild.build({
    entryPoints: ['main.js'],
    bundle: true,
    minify: true,
    outfile: `/dist/v${version}/el.min.js`,
});

// copy to latest
await copyFile(`/dist/v${version}/el.js`, `/dist/latest/el.js`);
await copyFile(`/dist/v${version}/el.min.js`, `/dist/latest/el.min.js`);
