![Atomico](./brand/logo-header.svg)

[![CircleCI](https://circleci.com/gh/atomicojs/atomico.svg?style=svg)](https://circleci.com/gh/atomicojs/atomico)
[![npm](https://badgen.net/npm/v/atomico)](http://npmjs.com/atomico)
[![gzip](https://badgen.net/bundlephobia/minzip/atomico)](https://bundlephobia.com/result?p=atomico)

[Español](./README-es.md) [English](../README.md)

### Una microlibrería inspirada en React Hooks, diseñada y optimizada para la creación de webcomponentes.

![hello](https://res.cloudinary.com/dz0i8dmpt/image/upload/v1580099299/github/atomico/hello.png)

### Documentación

La documentacion de atomico se encuentra disponible en gitbook en la siguiente url **[atomico.gitbook.io/doc](https://atomico.gitbook.io/doc/v/es/)**, **puede solicitar apoyo directo mediante twitter a [@Uppercod](https://twitter.com/uppercod) o [@Atomicojs](https://twitter.com/atomicojs), no dudes en preguntar, estaré encantado de ayudarte.**

[![my first webcomponent with Atomico](https://res.cloudinary.com/dz0i8dmpt/image/upload/v1580061091/github/atomico/1-es.png)](https://atomico.gitbook.io/doc/v/es/comenzando/inicio-rapido)

[![api documentation virtual-dom](https://res.cloudinary.com/dz0i8dmpt/image/upload/v1580061091/github/atomico/2-es.png)](https://atomico.gitbook.io/doc/v/es/guias/virtual-dom)

[![api documentation hooks](https://res.cloudinary.com/dz0i8dmpt/image/upload/v1580061091/github/atomico/3-es.png)](https://atomico.gitbook.io/doc/v/es/guias/hooks)

[![api documentation props](https://res.cloudinary.com/dz0i8dmpt/image/upload/v1580061091/github/atomico/4-es.png)](https://atomico.gitbook.io/doc/v/es/guias/guia-de-props)

### ¿Por que Atomico?

Atomico mejora la experiencia de creación de customElements añadiendo comportamiento funcional y sintaxis declarativa, esto se traduce en interfaces más ligera vs librerías como React, Vue, Preact, Stencil, LitElement y otras, Atómico ofrece:

**Sintaxis declarativa** : El virtual-dom y el sistema de propiedades de Atomico ofrecen expresividad al momento de declarar el DOM y las propiedades del customElement.

![Atomico Expressiveness](https://res.cloudinary.com/dz0i8dmpt/image/upload/v1580060796/github/atomico/diff-code.png)

**comportamiento funcional** : Atomico asocia un comportamiento funcional a los webcomponents a través de los hooks que mejoran la composición y abstracción de lógica y eliminando por completo la necesidad el contexto `this`.

![Atomico hooks](https://res.cloudinary.com/dz0i8dmpt/image/upload/v1580099064/github/atomico/hook-use-state.png)

**Bajo tamaño**: El tamaño total de Atomico es de tan solo [![gzip](https://badgen.net/bundlephobia/minzip/atomico)](https://bundlephobia.com/result?p=atomico) y este tamaño puede verse reducido aun más ya que su construcción permite que el proceso de tree-shaking de herramientas como Rollup desechen el código no usado.

**Soporte a Typescript**: Atomico soporta autocompletado de JSX, detención de errores asociativos y definicion de tipos al usar hooks y prop.
