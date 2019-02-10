let taks = [],
    inFrameLoop;
/**
 * creates a task loop that is not affected by other external interval effects or nested intervals
 * @param {function} callback
 * @todo please test in hot-reload
 */
export function createTask(callback) {
    taks.push(callback);
    if (!inFrameLoop) {
        inFrameLoop = true;
        let cancel = () => {
                cancelAnimationFrame(frameLoop);
                inFrameLoop = false;
            },
            count = 0,
            frameLoop = requestAnimationFrame(function loop() {
                setTimeout(() => {
                    let currentTasks = taks,
                        length = currentTasks.length;
                    taks = [];
                    if (!length) {
                        count++;
                    } else {
                        count = 0;
                    }
                    if (count === 60) {
                        cancel();
                    } else {
                        for (let i = 0; i < length; i++) currentTasks[i]();
                        requestAnimationFrame(loop);
                    }
                });
            });
    }
}
