## Atomico 2 is on the way — faster, smarter, and packed with new features! Coming soon

![Atomico](https://raw.githubusercontent.com/atomicojs/atomico/brand/h1.svg)
![Atomico](https://raw.githubusercontent.com/atomicojs/atomico/brand/h2.svg)

[![twitter](https://raw.githubusercontent.com/atomicojs/docs/master/.gitbook/assets/twitter.svg)](https://twitter.com/atomicojs)
[![discord](https://raw.githubusercontent.com/atomicojs/docs/master/.gitbook/assets/discord.svg)](https://discord.gg/7z3rNhmkNE)
[![documentation](https://raw.githubusercontent.com/atomicojs/docs/master/.gitbook/assets/doc-1.svg)](https://atomico.gitbook.io/doc/)
[![playground](https://raw.githubusercontent.com/atomicojs/docs/master/.gitbook/assets/doc.svg)](https://stackblitz.com/edit/atomico?file=src%2Fmy-component.tsx)

[![npm](https://badgen.net/npm/v/atomico)](http://npmjs.com/atomico)
[![gzip](https://badgen.net/bundlephobia/minzip/atomico)](https://bundlephobia.com/result?p=atomico)

## Build web components using a syntax similar to React JS. 🚀

1. **Scalable and reusable interfaces**: Build once with Atomico, run anywhere — React, Vue, Svelte, HTML, WebView, you name it. Feels super simple — especially if you already know React. 🚀
2. **Open communication**: Atomico makes building and using web components easy — delivering a truly authentic dev experience. ⚡
3. **Performance**: Atomico is fast — [actually 60% faster than React](https://atomicojs.dev/perf). Your apps will fly! 🚀

### Atomico is fully type-friendly — full autocomplete powered by your IDE, TypeScript, and AI. 🚀

```tsx
import { c } from "atomico";

const MyComponent = c(
    ({ message }) => (
        <host>
            <h1>Helo {message}</h1>
        </host>
    ),
    {
        props: { message: String }
    }
);

customElements.define("my-component", MyComponent);
```

## Summary

Atomico is a modern micro-library created by Matias Trujillo, aka [@UpperCod](http://linkedin.com/in/uppercod)
, designed to simplify web component development. It replaces the need for classes and contexts with functions and scoped logic, supporting attributes, properties, methods, and events — making your components cleaner and easier to maintain.

## Join the Team by Contributing to Atomico

We’re happy to help with any support you need to make your contribution. Check out [CONTRIBUTING.md](./CONTRIBUTING.md)
for everything you need to get started contributing to Atomico’s web component code.

Not all contributions are code-related — you can also help us improve the [Atomico documentation](https://atomico.gitbook.io/doc/)
.

A good place to start is by [adding](https://github.com/atomicojs/atomico/issues/new/choose)
or picking up an item from the Atomico Roadmap
.

By default, all issues will appear in the backlog column of Atomico’s roadmap for refinement.

Let’s make Atomico better — together! 🚀
