[home](../../README.md)/en/**hooks**

# Hooks

Just like interface components allow UI reuse, hooks allow to reuse logical processes, for example, execute asynchronous updates, communicate effects and control states only using functions.

**Links:**

1. [Exclusive hooks for webcomponents](#exclusive-hooks-for-webcomponents).
    1. [useProp](#useprop)
    2. [useEvent](#useevent)
    3. [useHost](#useHost)
2. [Hooks copied from React](#hooks-copied-from-React).
    1. [useState](#usestate)
    2. [useEffect](#useeffect)
    3. [useMemo](#usememo)
    4. [useCallback](#usecallback)
    5. [useRef](#useref)

## Exclusive hooks for webcomponents

### useProp

Hook that allows to reflect the changes of state on a property from inside the webcomponent.

```
const [value, setValue] = useProp(propName);
```

Where:

1. `const [value, setValue]`: Return of `useProp`, the arguments allow reading and updating of the state associated with the `propName` property of the webcomponent.
2. `propName` : String defining the property to use by the `useProp` of the webcomponent.

#### Example

```jsx
const MyComponent = () => {
    const [count, setCount] = useProp("count");
    return (
        <host>
            <button onclick={() => setCount(count + 1)}>+</button>
            <span>{count}</span>
        </host>
    );
};

MyComponent.props = { count: { type: Number, value: 0 } };
```

### useEvent

Hook that allows to emit an event from the webcomponent.

```js
const dispatchEvent = useEvent(myEvent, optionalEventInit);
```

Where:

1. `dispatchEvent` : `Function` that dispatches the event defined by `myEvent`.
2. `myEvent` : `String` defining the event to dispatch by `useEvent`
3. `optionalEventInit` :Optional configuration of the event to dispatch, `{bubbles?: boolean, cancelable?: boolean, composed?: boolean, detail?: any}`. https://developer.mozilla.org/en-US/docs/Web/API/Event/Event

### useHost

Hook that creates a reference where current is the instance of the webcomponent.

```js
const refHost = useHost();
```

**This hooks is useful to add functionalities associated to the webcomponent instance**

## Hooks copied from React

### useState

Hook that allows creating a state on the webcomponent.

```js
const [state, setState] = useState(optionalInitialState);
```

Where:

1. `const [state,setState]` : Return of `useState`, the arguments allow reading and updating of the state associated with the hook instance.
    - `state` : Current state.
    - `setState`: state update function.
2. `useState( optionalInitialState )`: Hook function that associates the state with the webcomponent:
    - `optionalInitialState`: Optional parameter that defines the start state associated with the hook instance, **If `optionalInitialState` is a function it will be executed to obtain the initial state only at the moment of the hook instance for the first time**

#### Example

```jsx
function MyComponent() {
    const [count, setCount] = useState(0);
    return <host onclick={() => setCount(count + 1)}> {count} </host>;
}
```

### useEffect

Hook that allows associating effects to the webcomponent.

```js
useEffect(effectCallback, optionalArgumentList);
```

Where:

1. `effectCallback`: Function that executes one or more times to `effectCallback` according to the arguments of the`optionalArgumentList` Array, `effectCallback` can return a function that will be executed only if`effectCallback` is re-executed or the wecomponents are dismounted.
2. `optionalArgumentList`: Array of arguments to watch for `useEffect`, if one of these arguments switches between renders,`effectCallback` will be executed again. If `optionalArgumentList` is defined as an empty array (`[]`), useEffect will only run`effectCallback` when creating the webcomponent.

#### Example

```js
const listenerClickWindow = () => {
    const handlerClick = () => {
        console.log("Click window!");
    };

    window.addEventListener("click", handlerClick);

    const unlistenerClickWindow = () =>
        window.removeEventListener("click", handlerClick);

    return unlistenerClickWindow;
};
useEffect(listenerClickWindow, []);
```

### useMemo

Hook that allows memorizing the return of a callback.

```js
const memoValue = useMemo(callback, optionalArgumentList);
```

Where:

1. `memoValue` : Return memorized by useMemo.
2. `callback`: Function that runs one or more times according to `optionalArgumentList`.
3. `optionalArgumentList`: Array of arguments to be observed by `useMemo`, if one of these arguments changes between`useMemo` renders it will execute the `callback` again, memorizing a new return.

### useCallback

Hook that allows memorizing a callback so that it conserves its scope.

```js
const memoCallback = useCallack(callback, optionalArgumentList);
```

Where:

1. `memoCallback`: Return memorized by useCallback

### useRef

Hook that creates an object for reference.

```js
const ref = useRef(currentOptional);
```

Where:

1. `ref` : Return object of useRef, this allows to preserve differences between render.
2. `currentOptional`: Defines the `current` property within the`ref` object.
