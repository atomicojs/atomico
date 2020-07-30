[home](../../README.md)/en/**scaffolding**

# Project generator

Atomico has a project generator using the following script:

```bash
npm init @atomico
```

**Step 1**: We enter a name to create or retrieve the directory of our project.

```bash
Welcome to Atomico, let's create your project

? Project destination folder? » hi-atomico # nombre de ejemplo
```

**Step 2**: To start we recommend the configuration `Started - ....`, This will allow us to mount a development server preconfigured for Atomico.

```bash
? Select the type of project » - Use arrow-keys. Return to submit.
>   Started - Hassle-free starter template, perfect for starting with Atomico
    Getting started with Atomico + Snowpack
```

**Step 2** ends by copying the content into the directory assigned in **step 1** and it will show us a list of instructions to finish the installation locally.

```bash
Your project has been created successfully, next steps:
1. cd hi-atomico
2. npm install
3. npm start
4. Enjoy Atomico!
```

The command ** npm start ** will show us the local server to develop with Atomico.

```bash
D:\hi-atomico>npm start

> atomico-base@0.0.0 start D:\hi-atomico
> estack dev src/**/*.{html,md}

Server running on http://localhost:8000

Build    Status    Duration  Time
EStack   Resolved  0.4s      17:51:33
Rollup   Resolved  0.3s      17:51:33
```
