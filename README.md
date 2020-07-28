![Atomico](./docs/brand/logo-header.svg)

[![CircleCI](https://circleci.com/gh/atomicojs/atomico.svg?style=svg)](https://circleci.com/gh/atomicojs/atomico)
[![npm](https://badgen.net/npm/v/atomico)](http://npmjs.com/atomico)
[![gzip](https://badgen.net/bundlephobia/minzip/atomico)](https://bundlephobia.com/result?p=atomico)

[Español](./docs/README-es.md) [English](./README.md)

### A microlibrary inspired by React Hooks, designed and optimized for the creation of webcomponents

![hello](https://res.cloudinary.com/dz0i8dmpt/image/upload/v1580099299/github/atomico/hello.png)

### Documentation

Atomico documentation is available on gitbook in the following URL **[atomico.gitbook.io/doc](https://atomico.gitbook.io/doc)**, **you can request direct support via twitter to [@ Uppercod](https://twitter.com/uppercod) or [@Atomicojs](https://twitter.com/atomicojs), don't hesitate to ask, I'll be happy to help you!**

[![my first webcomponent with Atomico](https://res.cloudinary.com/dz0i8dmpt/image/upload/v1580061091/github/atomico/1.png)](https://atomico.gitbook.io/doc/get-started/quick-start)

[![api documentation virtual-dom](https://res.cloudinary.com/dz0i8dmpt/image/upload/v1580061091/github/atomico/2.png)](https://atomico.gitbook.io/doc/guides/virtual-dom)

[![api documentation hooks](https://res.cloudinary.com/dz0i8dmpt/image/upload/v1580061091/github/atomico/3.png)](https://atomico.gitbook.io/doc/guides/hooks)

[![api documentation props](https://res.cloudinary.com/dz0i8dmpt/image/upload/v1580061091/github/atomico/4.png)](https://atomico.gitbook.io/doc/guides/props)

### Why Atomic?

Atomico improves the experience when creating customElements by adding functional behavior and declarative syntax, this translates into lighter interfaces vs. libraries such as React, Vue, Preact, Stencil, LitElement and others, Atomic offers:

**Declarative syntax** : The virtual-dom and the Atomico property system offer expressiveness when declaring the DOM and the properties of the customElement

![Atomico declarative syntax](https://res.cloudinary.com/dz0i8dmpt/image/upload/v1580060796/github/atomico/diff-code.png)

**Functional behavior** : Atomico associates functional behavior with webcomponents through hooks that improve the composition and abstraction of logic and completely eliminating the need for the `this` context.

![Atomico hooks](https://res.cloudinary.com/dz0i8dmpt/image/upload/v1580099064/github/atomico/hook-use-state.png)

**Economic size**: The total size of Atomico is only [![gzip](https://badgen.net/bundlephobia/minzip/atomico)](https://bundlephobia.com/result?p=atomico) and this size can be reduced even more since its construction allows the tree-shaking process of tools such as Rollup to discard unused code.

**Typescript support**: Atomic supports JSX autocomplete, associative error stop, and type definition when using hooks and props.
