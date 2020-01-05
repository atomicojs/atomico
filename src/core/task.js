let defer = Promise.resolve();
let queue = [];
let running;

let maxFps = 1000 / 60;

export const IMPORTANT = Symbol("important");

export function clearQueue() {
    let time = performance.now();

    let length = queue.length;
    let current = queue;

    queue = [];

    while (length--) {
        let callback = current[length];
        // if in case one is defined as important, the execution will be forced
        if (callback[IMPORTANT] || performance.now() - time < maxFps) {
            callback();
        } else {
            queue = queue.concat(current.slice(0, length + 1));
            break;
        }
    }

    if (queue.length) {
        requestAnimationFrame(clearQueue);
        return;
    }
    running = false;
}
/**
 * add a task to the queue
 * @param {Function} callback
 * @returns {Promise} Generate a promise that show  if the queue is complete
 */
export function addQueue(callback) {
    if (!running) {
        running = true;
        defer.then(clearQueue);
    }
    // if the callback is defined as IMPORTANT,
    // it is assumed to be in favor of the tree
    // of the DOM  that must be added by unshift,
    // assuming that the mount will be carried
    // out in order, the shift priority only works
    // after the first render
    if (!queue.includes(callback))
        queue[callback[IMPORTANT] ? "unshift" : "push"](callback);
}
