let task = [],
    currentLoop,
    frameEmpty = 0,
    channel = new MessageChannel();

channel.port1.onmessage = () => {
    let currentTask = task,
        length = currentTask.length;
    if (!length) {
        frameEmpty++;
    } else {
        frameEmpty = 0;
    }
    for (let i = 0; i < length; i++) currentTask[i]();
    task = [];
};

function createLoop() {
    function loop() {
        if (frameEmpty > 60) {
            currentLoop = 0;
        } else {
            channel.port2.postMessage(undefined);
            requestAnimationFrame(loop);
        }
    }
    currentLoop = requestAnimationFrame(loop);
}

/**
 * creates a task loop that is not affected by other external interval effects or nested intervals
 * @param {function} callback
 * @todo please test in hot-reload
 */
export function createTask(callback) {
    task.push(callback);
    if (!currentLoop) createLoop();
}
