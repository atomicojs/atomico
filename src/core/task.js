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
    if (!queue.includes(callback)) queue.push(callback);
}
