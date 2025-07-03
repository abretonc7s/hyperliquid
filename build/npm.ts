/**
 * Builds the Deno library for working with NodeJS or publishing to npm
 * Command: deno run -A build/npm.ts
 */

import { build, emptyDir } from "jsr:@deno/dnt@^0.42.1";

const denoConfig = JSON.parse(await Deno.readTextFile("./deno.json"));
const name = denoConfig.name;
const version = denoConfig.version;
const entryPoints = Object.entries(denoConfig.exports)
    .map(([key, value]) => {
        return { name: key, path: value as string };
    });

await emptyDir("./build/npm");
await build({
    entryPoints,
    outDir: "./build/npm",
    shims: {},
    typeCheck: "both",
    test: false,
    package: {
        name,
        version,
        description: "Unofficial Hyperliquid API SDK for all major JS runtimes, written in TypeScript. Fork with Node.js 20.18.0+ compatibility.",
        keywords: [
            "api",
            "library",
            "sdk",
            "javascript",
            "typescript",
            "crypto",
            "cryptocurrency",
            "trading",
            "blockchain",
            "exchange",
            "web3",
            "dex",
            "hyperliquid",
            "node20",
            "compatibility",
            "fork",
        ],
        author: {
            name: "deeeed",
            email: "your-email@example.com",
            url: "https://github.com/abretonc7s",
        },
        homepage: "https://github.com/abretonc7s/hyperliquid",
        repository: {
            type: "git",
            url: "git+https://github.com/abretonc7s/hyperliquid.git",
        },
        bugs: {
            url: "https://github.com/abretonc7s/hyperliquid/issues",
        },
        license: "MIT",
        engines: {
            /**
             * - v20.18.0: Minimum version with required APIs
             * - v22.4.0: Native WebSocket support
             * - v24.0.0: Promise.withResolvers, AbortSignal.timeout/any (polyfilled for compatibility)
             */
            node: ">=20.18.0",
        },
        sideEffects: false,
    },
    compilerOptions: {
        lib: ["ESNext", "DOM"],
        target: "Latest",
    },
});

await Promise.all([
    // Copy additional files to npm build directory
    Deno.copyFile("CONTRIBUTING.md", "build/npm/CONTRIBUTING.md"),
    Deno.copyFile("LICENSE", "build/npm/LICENSE"),
    Deno.copyFile("README.md", "build/npm/README.md"),
    Deno.copyFile("SECURITY.md", "build/npm/SECURITY.md"),
    // Add more items to ignore list in .npmignore
    Deno.writeTextFile("./build/npm/.npmignore", "node_modules\n", { append: true }),
    Deno.writeTextFile("./build/npm/.npmignore", "package-lock.json\n", { append: true }),
]);
