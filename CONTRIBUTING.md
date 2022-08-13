# Contributing

Welcome we will be attentive to all the help you need to generate your contribution.

Here you will find everything you need to start contributing to Atomico js webcomponents.

Any improvement to the Atomico workflow is welcome

## Getting Started

Atomico has a simple structure, just by cloning it could already contribute with maintenance, improvements or new functionalities.

1. Clone the git repository: `git clone git@github.com:atomicojs/atomico.git`
2. cd atomico
3. npm install

## Structure of the Atomico as a project

Atomico is a project written entirely in standard JS, now let's learn a little about its structure:

```bash
atomico
│
│   # Folder that groups all the api Browser, Render DOM,
│   # CustomElements and API hooks
├── src           # Folder that groups all the core that is exported by default,
│   │             # example: `import * from "atomico";`
│   │
│   ├─ tests      # Folder that groups all the tests of the core
│   │
│   ├─ element    # Folder that groups all the functionalities of Atomico
│   │             # as CustomElement example the binding of the
│   │             # render with API Hooks.
│   │
│   ├─ hooks      # Folder that groups the Atomico hooks api modules
│   │
│   ├─ options    # Module that declares the Atomico configuration,
│   │             # example SSR mode or use of CSSStyleSheet
│   │
│   └─ core.js    # Atomico main module of the core, groups everything exportable
│                 # exposed, example: `import * from "atomico";`
│
│   # Folder that groups all the SSR api and support for Node, Deno and Bun.
├── ssr
│   └─ tests      # Folder that groups the tests of the SSR api
│
│   # Folder that groups all the declaration of types for Typescript
│   # TS support is external to the CORE declarations since
│   # JSDOM does not cover all cases.
├── types
│
│   # Folder that groups all the tests for the visible modules at root level
│   # be fixture and utils, apis exposed as submodules.
├── tests
│
│   # Folder that groups Atomico support as template string
│   # Atomico generates an invisible bundle of htm to optimize the
│   # distribution as a module and not leverage more dependencies.
├── html
│
│   # The following exposed modules make the Atomico api visible
│   # by default or as a submodule.
├── core.js         # `atomico` module. Bundle `html.js` and `src/core.js`
│
├── html.js         # Module `atomico/html`, is generated
│                   # by rollup.config.js
│
├── ssr.js          # `atomico/ssr` top-level await module to optimize SSR download
│
├── jsx-runtime.js  # `atomico/jsx-runtime` module,
│                   # needed to compile jsx
│
├── utils.js        # `atomico/utils` module, exposed generic utilities.
│
├── test-dom.js     # `atomico/test-dom` model, it has the utilities to
│                   # test the DOM
│
└── test-hooks.js   # `atomico/test-hooks` model, it has the utilities to
                    # test the hooks.
```

## Scripts

the scripts facilitate the committed testing processes to achieve the publication of your contribution if it is code.

```bash
npm run test    # run all tests at the repository level

npm run test:w  # run all lost test in watcher mode
```

## Testing

Atomico currently uses [`chai`](https://www.chaijs.com/) via [`@web/test-runner`](https://modern-web.dev/docs/test-runner/overview/), the goals of the testing environment are:

1. All functionality should preferably be tested.
2. All exposed modules must be tested in declaration.
3. Every exposed module must declare the TS types.

Some references that will be useful to build new tests are in:

1. Test on the api for the Browser `src/tests`.
2. Test on the SSR api `ssr/tests`.

## PR

All PR is welcome, some prefixes that help us to categorize these are the definition of the type of PR by:

1. `features`: Any new features to include in Atomico
2. `bug`: Any bugs or fixes that fix Atomico's behavior
3. `maintenance`: All internal improvement example documentation, code compression, code optimization, maintenance of types for TS and others.

for all PR we should preferably prefix the type, then the version semver format and finally label, example:

```bash
# pattern
bug-1.1.<version to publish>-<label>

# example
bug-1.1.1-fix-type-of-tsx-a-tag
```

We will be very happy to receive your PR and provide you with all the support to achieve the merge.

## Pipeline

Today Atomico is published automatically detecting through github actions thanks to the use of tag.

the pipeline will execute all tests defined within Atomico before publishing to NPM

## Just Standard JS.

Internally Atomico can be used without the need of compilers, since it uses standard modules, example:

```jsx
import { html } from "./core.js";
```

This facilitates the development experience, you can experience new features directly from an html file and a local server, example:

```html
<script type="module">
    import { html, c, css } from "./core.js";
</script>
```

Although this does not benefit from JSX, it facilitates the integration of new functionalities that must later be validated by the testing environment.

## Internal code documentation

All internal functionality of the code must be commented through JSDOC.
