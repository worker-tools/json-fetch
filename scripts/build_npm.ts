// ex. scripts/build_npm.ts
import { basename, extname } from "https://deno.land/std@0.133.0/path/mod.ts";
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

import { latestVersion, copyMdFiles } from 'https://gist.githubusercontent.com/qwtel/ecf0c3ba7069a127b3d144afc06952f5/raw/latest-version.ts'

await emptyDir("./npm");

const name = basename(Deno.cwd())

await build({
  entryPoints: ["./index.ts", {
    name: './search-params-url',
    path: 'search-params-url.ts'
  }],
  outDir: "./npm",
  shims: {},
  test: false,
  // mappings: {
  //   "https://esm.sh/cookie-store-interface@0.1.1/index.js": {
  //     name: "cookie-store-interface",
  //     version: "^0.1.1",
  //   },
  // },
  package: {
    // package.json properties
    name: `@worker-tools/${name}`,
    version: await latestVersion(),
    description: "",
    license: "MIT",
    publishConfig: {
      access: "public"
    },
    author: "Florian Klampfer <mail@qwtel.com> (https://qwtel.com/)",
    repository: {
      type: "git",
      url: `git+https://github.com/worker-tools/${name}.git`,
    },
    bugs: {
      url: `https://github.com/worker-tools/${name}/issues`,
    },
    homepage: `https://workers.tools/#${name}`,
  },
  packageManager: 'pnpm',
  compilerOptions: {
    sourceMap: true,
  },
});

// post build steps
await copyMdFiles();
