(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (factory());
}(this, (function () { 'use strict';

    var NODE_TEXT = "#text";
    var NODE_HOST = "host";

    var TAG_VALUE = "@tag";

    var ATTRS_VALUE = "@attrs";

    var SHADOWDOM = "shadowDom";

    var COMPONENT_CREATE = "@create";
    var COMPONENT_UPDATE = "@update";
    var COMPONENT_CREATED = "@created";
    var COMPONENT_UPDATED = "@updated";
    var COMPONENT_CLEAR = "@clear";
    var COMPONENT_REMOVE = "@remove";
    /**
     * if a list of children is empty in content it is
     * replaced by this constant with the intention
     * of simplifying the immutable comparison
     */
    var EMPTY_CHILDREN = [];
    /**
     * stores the transformations created in update Event,
     * by manipulating the name of the event
     */
    var EVENT_ALIAS = {};

    var options = {
        // defines the maximum amount of simultaneous tasks
        maxConcurrentTask: 5000
    };

    /**
     * Return if value is array
     * @param {*}
     * @return {boolean}
     */
    function isArray(value) {
        return Array.isArray(value);
    }
    /**
     * compare 2 array
     * @param {array} before
     * @param {array} after
     * @example
     * isEqualArray([1,2,3,4],[1,2,3,4]) // true
     * isEqualArray([1,2,3,4],[1,2,3])   // false
     * isEqualArray([5,1,2,3],[1,2,3,5]) // false
     * isEqualArray([],[]) // true
     * @returns {boolean}
     */
    function isEqualArray(before, after) {
        var length = before.length;
        if (length !== after.length) { return false; }
        for (var i = 0; i < length; i++) {
            if (before[i] !== after[i]) { return false; }
        }
        return true;
    }

    function assign(master, commit) {
        var arguments$1 = arguments;

        for (var key in commit) {
            master[key] = commit[key];
        }
        for (var i = 2; i < arguments.length; i++) { assign(master, arguments$1[i]); }
        return master;
    }

    var defer = Promise.resolve(),
        task = [];
    window._task = [];
    function setTask(handler, argument) {
        if (!task.length) {
            defer.then(function () {
                var currentTask = task,
                    length = task.length;
                task = [];
                window._task.push(length);
                for (var i = 0; i < length; i++) {
                    var value = currentTask[i];
                    value[0](value[1]);
                }
            });
        }
        task.push([handler, argument]);
    }

    /**
     * allows to transfer the arguments to createVnode
     * @param {string|function} tag - define the vnode to work
     * @param {object} [props] - vnode properties
     * @param {array} [children] - properties to be transmitted to the vnode
     */
    function h(tag, props) {
        var children = [], len = arguments.length - 2;
        while ( len-- > 0 ) children[ len ] = arguments[ len + 2 ];

        return createVnode(tag, props, children);
    }
    /**
     * if the vnode is defined different from an object, it returns a vnode that creates a text node
     * @param {*} value
     * @return {object}
     */
    function defineVnode(value) {
        var type = typeof value;
        if (value && type === "object" && value.tag) {
            return value;
        } else {
            return {
                tag: "#text",
                children: type === "number" || type === "string" ? "" + value : ""
            };
        }
    }
    /**
     * create a representative object of the node to be created, updated or deleted
     * @param {string|function} tag - type of node to represent
     * @param {object} nextProps - properties of the node to represent
     * @param {array} nextChildren - children of the node to represent
     */
    function createVnode(tag, nextProps, nextChildren) {
        nextProps = nextProps || {};
        // Increase the indexes to be reused.
        var useKeys,
            // key identifier
            key,
            // list of children
            children,
            // amount of props
            size = 1,
            // Tag properties
            props = {},
            // define whether the node will update the context
            useContext,
            // announces that the node will use shadowDom
            useShadowDom,
            // lets you ignore updateChildren
            useChildren = true,
            // scan the children recursively to form a list without depth
            mapChildren = function (nextChildren, deep, children) {
                if ( deep === void 0 ) deep = 0;
                if ( children === void 0 ) children = [];

                var length = nextChildren.length,
                    recicleChildren = true;
                // allows recycling to nextChildren, if the condition is met
                while (!deep && length === 1 && isArray(nextChildren[0])) {
                    nextChildren = nextChildren[0];
                    length = nextChildren.length;
                }

                if (!length) { return EMPTY_CHILDREN; }

                for (var i = 0; i < length; i++) {
                    var child = nextChildren[i];
                    if (isArray(child)) {
                        mapChildren(child, deep + 1, children);
                        recicleChildren = false;
                    } else {
                        var childType = typeof child;
                        if (
                            child &&
                            childType === "object" &&
                            child.key !== undefined
                        ) {
                            useKeys = useKeys || {};
                            if (child.key in useKeys) {
                                throw new Error(
                                    "Each key must be unique among children"
                                );
                            } else {
                                useKeys[child.key] = true;
                            }
                        } else {
                            if (useKeys) {
                                throw new Error("Each child must have a key");
                            }
                        }
                        children.push(child);
                    }
                }
                return recicleChildren ? nextChildren : children;
            };

        for (var index in nextProps) {
            var value = nextProps[index];
            switch (index) {
                case "context":
                    if (typeof value === "object") { useContext = value; }
                    continue;
                case "children":
                    if (value === false) { useChildren = false; }
                    nextChildren = value;
                    continue;
                case "innerHTML":
                case "textContent":
                case "contenteditable":
                    useChildren = false;
                    break;

                case SHADOWDOM:
                    useShadowDom = value;
                    break;
            }
            props[index] = value;
            size++;
        }

        // children is empty, it is replaced by the constant, in order to compare the empty state
        props.children = children = mapChildren(nextChildren);

        return {
            tag: tag,
            key: key,
            size: size,
            props: props,
            children: children,
            useKeys: useKeys,
            useContext: useContext,
            useChildren: useChildren,
            useShadowDom: useShadowDom
        };
    }

    /**
     * issue elimination to the entire tree of nodes
     * @param {string} ID
     * @param {HTMLElement|SVGElement|Text} node
     */
    function clearNode(ID, node, clear, currentUpdateComponent) {
        var ref = node[ID] || {};
        var updateComponent = ref.updateComponent;
        var nodeList = node.childNodes,
            length = nodeList.length;
        if (updateComponent && updateComponent !== currentUpdateComponent) {
            updateComponent(clear ? COMPONENT_CLEAR : COMPONENT_REMOVE);
        }
        for (var i = 0; i < length; i++) {
            clearNode(ID, nodeList[i]);
        }
    }
    /**
     *
     * @param {string} ID
     * @param {HTMLElement|SVGElement|Text} node - node to extract current children
     * @param {object} vnextChildren  - list of children to update
     * @param {object|undefined} useKeys - index of keys to keep in the next update
     * @param {boolean} isSvg - define if it is a svg tree
     * @param {object} context - current context to share
     * @return {HTMLElement|SVGElement|Text}
     */
    function updateChildren(
        ID,
        node,
        vnextChildren,
        useKeys,
        isSvg,
        context
    ) {
        var nodeKeys = {},
            nodeList = node.childNodes,
            nodeListLength = nodeList.length,
            vnodeListLength = vnextChildren.length,
            /**
             * modifies the start of the iteration based on the type whether it is using keys or indexes
             * this is done for a deletion without iterate completely nodeList
             */
            nodeListIndexStart = useKeys
                ? 0
                : nodeListLength > vnodeListLength
                ? vnodeListLength
                : nodeListLength;
        for (; nodeListIndexStart < nodeListLength; nodeListIndexStart++) {
            var nodeChild = nodeList[nodeListIndexStart],
                isRemove = (void 0),
                key = nodeListIndexStart;
            // if the iteration uses keys, the node is stored in the index corresponding to its key
            if (useKeys) {
                key = nodeChild.dataset.key;
                if (key in useKeys) {
                    nodeKeys[key] = nodeChild;
                } else {
                    isRemove = true;
                }
            } else {
                isRemove = true;
            }
            if (nodeChild && isRemove) {
                clearNode(ID, nodeChild);
                nodeListLength--;
                nodeListIndexStart--;
                node.removeChild(nodeChild);
            }
        }
        for (var i = 0; i < vnodeListLength; i++) {
            var vnode = defineVnode(vnextChildren[i]),
                nextSibling = nodeList[i + 1],
                useKey = useKeys ? vnode.key : i,
                indexChild = nodeList[i],
                prevChild = useKeys ? nodeKeys[vnode.key] : indexChild;

            if (useKeys) {
                if (prevChild !== indexChild) {
                    node.insertBefore(prevChild, indexChild);
                }
            }

            // if it is a component and it does not have an associative node, it will create one to work within update
            if (typeof vnode.tag === "function") {
                if (!prevChild) {
                    prevChild = createNode(NODE_TEXT);
                    if (nextSibling) {
                        node.insertBefore(prevChild, nextSibling);
                    } else {
                        node.appendChild(prevChild);
                    }
                }
            }

            var nextNode = update(ID, prevChild, vnode, isSvg, context);

            if (!prevChild) {
                if (nextSibling) {
                    node.insertBefore(nextNode, nextSibling);
                } else {
                    node.appendChild(nextNode);
                }
            }
        }
    }

    /**
     * memorizes the transformations associated with the css properties.
     * @example
     * {borderRadius:"50px"} // {"border-radius" : "50px"}
     */
    var CSS_PROPS = {};

    /**
     * Define the style property immutably
     * @param {HTMLElement|SVGAElement} node
     * @param {object|string} nextValue
     */
    function updateStyle(node, prevValue, nextValue) {
        // this function has the previous state of the css directly from the node by the constant [CSS_VALUE]
        var prevCss = prevValue,
            nextCss = nextValue;
        if (typeof nextValue === "object") {
            nextCss = "";
            for (var key in nextValue) {
                if (!nextValue[key]) { continue; }
                if (!CSS_PROPS[key]) {
                    CSS_PROPS[key] = key.replace(
                        /([^A-Z])([A-Z])/g,
                        function (all, letterBefore, letterAfter) { return letterBefore + "-" + letterAfter.toLowerCase(); }
                    );
                }
                nextCss += (CSS_PROPS[key]) + ":" + (nextValue[key]) + ";";
            }
        }

        if (prevCss !== nextCss) {
            node.style.cssText = nextCss;
        }

        return nextCss;
    }

    function updateEvent(node, type, prevHandler, nextHandler, handlers) {
        if (!EVENT_ALIAS[type])
            { EVENT_ALIAS[type] = type.slice(2).toLocaleLowerCase(); }

        type = EVENT_ALIAS[type];
        if (!handlers[type]) {
            handlers[type] = [function (event) { return handlers[type][1].call(event.target, event); }];
        }
        var eventProxy = handlers[type][0];
        if (prevHandler && !nextHandler) {
            node.removeEventListener(type, eventProxy);
            delete handlers[type];
        } else {
            if (!prevHandler && nextHandler) {
                node.addEventListener(type, eventProxy);
            }
            handlers[type][1] = nextHandler;
        }
    }

    // properties to ignore by updateProperties
    var IGNORE = {
        children: 1
    };

    /**
     * define the properties of the node
     * @param {HTMLElement|SVGAElement} node
     * @param {object} nextProps
     * @param {boolean} isSvg
     */
    function updateProperties(node, prevProps, nextProps, handlers, isSvg) {
        prevProps = prevProps || {};
        var attrsValues = node[ATTRS_VALUE] || {};
        for (var key in prevProps) {
            if (IGNORE[key]) { continue; }
            if (key in nextProps) {
                if (!(key in nextProps) && key in attrsValues) {
                    setProperty(node, key, "", null, attrsValues, handlers, isSvg);
                }
            }
        }
        for (var key$1 in nextProps) {
            if (IGNORE[key$1]) { continue; }
            setProperty(
                node,
                key$1,
                prevProps[key$1],
                nextProps[key$1],
                attrsValues,
                handlers,
                isSvg
            );
        }
        node[ATTRS_VALUE] = attrsValues;
    }
    function setProperty(
        node,
        key,
        prevValue,
        nextValue,
        attrsValues,
        handlers,
        isSvg
    ) {

        prevValue =
            key in handlers
                ? handlers[key]
                : prevValue === null
                ? prevValue
                : attrsValues[key];

        if (nextValue === prevValue) { return; }
        if (
            key[0] === "o" &&
            key[1] === "n" &&
            (typeof nextValue === "function" || typeof prevValue === "function")
        ) {
            updateEvent(node, key, prevValue, nextValue, handlers);
            return;
        }

        switch (key) {
            case "ref":
                if (nextValue) { nextValue.current = node; }
                break;
            case "style":
                nextValue = updateStyle(
                    node,
                    prevValue || node.style.cssText,
                    nextValue
                );
                break;
            case SHADOWDOM:
                if ("attachShadow" in node) {
                    if (
                        (node.shadowRoot && !nextValue) ||
                        (!node.shadowRoot && nextValue)
                    ) {
                        node.attachShadow({ mode: nextValue ? "open" : "closed" });
                    }
                }
                return;

            case "key":
                key = "data-key";
                if (nextValue === null) {
                    delete node.dataset.key;
                } else {
                    node.dataset.key = nextValue;
                }
                break;
            case "class":
            case "className":
                key = isSvg ? "class" : "className";
            default:
                if (key !== "list" && !isSvg && key in node) {
                    node[key] = nextValue === null ? "" : nextValue;
                } else if (nextValue === null) {
                    node.removeAttribute(key);
                } else {
                    node.setAttribute(key, nextValue);
                }
        }

        attrsValues[key] = nextValue;
    }

    var CURRENT_SNAP, CURRENT_SNAP_KEY_HOOK;

    function getCurrentSnap() {
        if (!CURRENT_SNAP) {
            throw new Error(
                "the hooks can only be called from an existing functional component in the diff queue"
            );
        }
        return CURRENT_SNAP;
    }

    function useHook(reducer, state) {
        var component = getCurrentSnap().component,
            index = CURRENT_SNAP_KEY_HOOK++,
            hook,
            isCreate;
        if (!component.hooks[index]) {
            isCreate = true;
            component.hooks[index] = { state: state };
        }
        hook = component.hooks[index];
        hook.reducer = reducer;
        if (isCreate) { dispatchHook(hook, { type: COMPONENT_CREATE }); }
        return [hook.state, function (action) { return dispatchHook(hook, action); }];
    }

    function dispatchHook(hook, action) {
        if (hook.reducer) {
            hook.state = hook.reducer(hook.state, action);
        }
    }

    function dispatchComponents(components, action) {
        var length = components.length;
        for (var i = 0; i < length; i++) {
            var component = components[i],
                hooks = component.hooks,
                hooksLength = hooks.length;
            if (action.type === COMPONENT_REMOVE) {
                component.remove = true;
            }
            for (var i$1 = 0; i$1 < hooksLength; i$1++) {
                dispatchHook(hooks[i$1], action);
            }
        }
    }
    /**
     * this function allows creating a block that analyzes the tag
     * defined as a function, in turn creates a global update scope for hook management.
     */
    function createUpdateComponent(ID, isSvg) {
        var store = [],
            host;
        /**
         * This function allows reducing the functional components based on
         * their return, in turn creates a unique state for each component
         * according to a depth index
         * @param {function} vnode
         * @param {object} context
         * @param {number} deep
         */
        function reduce(vnode, context, deep) {
            // if host does not exist as a node, the vnode is not reduced
            if (!host) { return; }
            vnode = vnode || "";
            // if it is different from a functional node, it is sent to updateNode again
            if (typeof vnode.tag !== "function") {
                dispatchComponents(store.splice(deep), {
                    type: COMPONENT_REMOVE
                });
                host = update(ID, host, vnode, isSvg, context, updateComponent);
                // if the store no longer has a length, it is assumed that the updateComponent is no longer necessary
                if (store.length) { host[ID].updateComponent = updateComponent; }

                return;
            }
            // you get the current component
            var component = store[deep] || {},
                isCreate,
                useNext;
            // if the current component is dis- torted to the analyzed one,
            // the previous state is replaced with a new one and the elimination is dispatched.
            if (component.tag !== vnode.tag) {
                isCreate = true;
                // the state of the component is defined
                store[deep] = {
                    size: 1,
                    tag: vnode.tag,
                    hooks: [],
                    props: {},
                    context: {}
                };
                // the elimination is sent to the successors of the previous component
                dispatchComponents(store.splice(deep + 1), {
                    type: COMPONENT_REMOVE
                });
                useNext = true;
            }

            component = store[deep];
            // then a series of simple processes are carried out capable of
            // identifying if the component requires an update

            context = vnode.useContext
                ? assign({}, context, vnode.useContext)
                : context;

            if (component.context !== context) {
                // the current context is stored in the cache
                component.context = context;
                // create a new context

                useNext = true;
            }

            if (!useNext) {
                // compare the lake of properties
                if (vnode.size !== component.size) { useNext = true; }
                if (!useNext) {
                    // buy property by property, so the properties to be used
                    // in the areas must be immutable
                    for (var key in vnode.props) {
                        if (vnode.props[key] !== component.props[key]) {
                            useNext = true;
                            break;
                        }
                    }
                }
            }

            component.props = vnode.props;
            component.size = vnode.size;
            /**
             * this function is a snapshot of the current component,
             * allows to run the component and launch the next update
             */
            function next() {
                if (component.remove) { return host; }

                CURRENT_SNAP = {
                    component: component,
                    context: context,
                    // allows access to the instantaneous, but it uses the microtareas
                    // to prevent multiple synchronous updates
                    next: function next$1() {
                        if (!component.prevent) {
                            component.prevent = true;
                            setTask(function () {
                                component.prevent = false;
                                next();
                            });
                        }
                    }
                };

                CURRENT_SNAP_KEY_HOOK = 0;

                dispatchComponents([component], { type: COMPONENT_UPDATE });

                var vnextnode = component.tag(component.props, context);

                CURRENT_SNAP = false;
                CURRENT_SNAP_KEY_HOOK = 0;

                reduce(vnextnode, context, deep + 1);

                dispatchComponents([component], {
                    type: isCreate ? COMPONENT_CREATED : COMPONENT_UPDATED
                });

                isCreate = false;
            }

            if (useNext && !component.prevent) { next(); }
        }
        /**
         *
         * @param {string} type
         * @param {HTMLElement|SVGElement|Text} nextHost
         * @param {object} vnode
         * @param {object} context
         */
        function updateComponent(type, nextHost, vnode, context) {
            switch (type) {
                case COMPONENT_UPDATE:
                    host = nextHost;
                    reduce(vnode, context, 0);
                    return host;
                case COMPONENT_CLEAR:
                    dispatchComponents([].concat(store).reverse(), { type: type });
                    break;
                case COMPONENT_REMOVE:
                    host = false;
                    dispatchComponents(store.reverse(), { type: type });
                    store = [];
                    break;
            }
        }

        return updateComponent;
    }

    /**
     * @param {object} vnode
     * @param {HTMLElement|SVGElement} node
     * @param {string} [customID]
     * @param {boolean} disableHost
     */
    function render(vnode, node, disableHost, customID) {
        if ( customID === void 0 ) customID = "@vn";

        if (!disableHost) {
            vnode = defineVnode(vnode);
            if (vnode.tag !== NODE_HOST) {
                vnode = createVnode(NODE_HOST, {}, [vnode]);
            }
        }
        update(customID, node, vnode);
    }

    function createNode(tag, isSvg) {
        var doc = options.document || document,
            nextNode;
        if (tag !== NODE_TEXT) {
            nextNode = isSvg
                ? doc.createElementNS("http://www.w3.org/2000/svg", tag)
                : doc.createElement(tag);
        } else {
            nextNode = doc.createTextNode("");
        }
        nextNode[TAG_VALUE] = tag;
        return nextNode;
    }

    function getNodeName(node) {
        if (!node) { return; }
        // store the process locally in the node to avoid transformation
        if (!node[TAG_VALUE]) {
            node[TAG_VALUE] = node.nodeName.toLowerCase();
        }
        return node[TAG_VALUE];
    }
    /**
     *
     * @param {string} ID - store the process locally in the node to avoid transformation
     * @param {HTMLElement|SVGElement|Text|undefined} prevNode - if the current node is defined and the next
     * one to be used is different, the replacement of the current node will be made
     * @param {*} vnode
     * @param {boolean} isSvg
     * @param {object} context
     * @param {function|undefined} currentUpdateComponent
     */
    function update(
        ID,
        prevNode,
        vnode,
        isSvg,
        context,
        currentUpdateComponent
    ) {
        // get a node object
        vnode = defineVnode(vnode);
        // if the previous state exists, it obtains the state
        var ref =
            (prevNode && prevNode[ID]) || {};
        var vprevnode = ref.vnode; if ( vprevnode === void 0 ) vprevnode = {};
        var handlers = ref.handlers; if ( handlers === void 0 ) handlers = {};
        var updateComponent = ref.updateComponent;
        // if the node stored in the previous state is identical to the current one,
        // it will not execute the update process
        if (vnode === vprevnode) { return prevNode; }

        var nextTag = vnode.tag;
        var nextProps = vnode.props;
        var nextChildren = vnode.children;
        var useKeys = vnode.useKeys;
        var useChildren = vnode.useChildren;
        var useShadowDom = vnode.useShadowDom;
        // define if the tree is of the SVG type
        isSvg = isSvg || nextTag === "svg";

        var nextNode = prevNode,
            isFunction = typeof nextTag === "function";

        // create an updateComponent
        if (isFunction && !updateComponent) {
            updateComponent = createUpdateComponent(ID, isSvg);
        }

        if (
            getNodeName(prevNode) !== nextTag &&
            nextTag !== "host" &&
            !isFunction
        ) {
            nextNode = createNode(nextTag, isSvg);
            handlers = {};
            var parent = prevNode && prevNode.parentNode;
            if (parent) {
                clearNode(ID, prevNode, true, currentUpdateComponent);
                parent.replaceChild(nextNode, prevNode);
            }
        }
        if (updateComponent && currentUpdateComponent !== updateComponent) {
            return updateComponent(COMPONENT_UPDATE, nextNode, vnode, context);
        } else if (nextTag !== NODE_TEXT) {
            updateProperties(nextNode, vprevnode.props, nextProps, handlers, isSvg);
            if (useChildren && vprevnode.children !== vnode.children) {
                updateChildren(
                    ID,
                    useShadowDom ? nextNode.shadowRoot || nextNode : nextNode,
                    nextChildren,
                    useKeys,
                    isSvg,
                    context
                );
            }
        } else {
            if (nextNode.nodeValue !== nextChildren) {
                nextNode.nodeValue = nextChildren;
            }
        }

        nextNode[ID] = { handlers: handlers, vnode: vnode, updateComponent: updateComponent };

        return nextNode;
    }

    function useState(initialState) {
        var next = getCurrentSnap().next,
            type = "useState/update";
        var ref = useHook(function (state, action) {
            switch (action.type) {
                case COMPONENT_CREATE:
                    return typeof initialState === "function"
                        ? initialState()
                        : initialState;
                case type:
                    var nextState = action.state;
                    return typeof nextState === "function"
                        ? nextState(state)
                        : nextState;
            }
            return state;
        });
        var state = ref[0];
        var dispatch = ref[1];
        return [
            state,
            function (state) {
                dispatch({ state: state, type: type });
                next();
            }
        ];
    }

    function useEffect(callback, args) {
        useHook(function (state, action) {
            switch (action.type) {
                case COMPONENT_CREATE:
                    return { args: args };
                case COMPONENT_UPDATE:
                case COMPONENT_REMOVE:
                    if (state.clear) {
                        var next$1 =
                            action.type === COMPONENT_REMOVE ||
                            (args && state.args
                                ? !isEqualArray(args, state.args)
                                : true);
                        if (next$1) { state.clear(); }
                    }
                    return assign({}, state, { args: args });
                case COMPONENT_CREATED:
                case COMPONENT_UPDATED:
                    var next =
                            action.type === COMPONENT_CREATED ||
                            (args && state.args
                                ? !isEqualArray(args, state.args)
                                : true),
                        clear = state.clear;
                    if (next) {
                        clear = callback();
                    }
                    return assign({}, state, { clear: clear, args: args });
            }
            return state;
        });
    }

    function Table(props) {
        return (
            h( 'table', { class: "table table-striped latest-data" }, 
                h( 'tbody', null, 
                    props.dbs.map(function (data) { return (
                        h( 'tr', null, 
                            h( 'td', { class: "dbname" }, data.dbname), 

                            h( 'td', { class: "query-count" }, 
                                h( 'span', { class: data.lastSample.countClassName }, 
                                    data.lastSample.nbQueries
                                )
                            ), 
                            data.lastSample.topFiveQueries.map(function (data) { return (
                                h( 'td', { class: "Query " + data.elapsedClassName }, 
                                    data.formatElapsed, 
                                    h( 'div', { class: "popover left" }, 
                                        h( 'div', { class: "popover-content" }, 
                                            data.query
                                        ), 
                                        h( 'div', { class: "arrow" })
                                    )
                                )
                            ); })
                        )
                    ); })
                )
            )
        );
    }

    perfMonitor.startFPSMonitor();
    perfMonitor.startMemMonitor();
    perfMonitor.initProfiler("view update");

    function getData() {
        return ENV.generateData().toArray();
    }

    function Rerender() {
        perfMonitor.startProfile("view update");
        var ref = useState(getData);
        var state = ref[0];
        var setState = ref[1];
        useEffect(function () {
            function loop() {
                setState(getData());
                setTimeout(loop, ENV.timeout);
            }
            loop();
        }, []);
        useEffect(function () {
            perfMonitor.endProfile("view update");
        });
        return h( Table, { dbs: state });
    }

    render(h( Rerender, null ), document.getElementById("body"));

})));
//# sourceMappingURL=bundle.js.map
