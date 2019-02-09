let taks = [],
    autorun;
/**
 * creates a task loop that is not affected by other external interval effects or nested intervals
 * @param {function} callback
 */
export function createTask(callback) {
    taks.push(callback);
    if (!autorun) {
        autorun = true;
        requestAnimationFrame(function loop() {
            setTimeout(() => {
                let currentTasks = taks,
                    length = currentTasks.length;
                taks = [];
                for (let i = 0; i < length; i++) currentTasks[i]();
            });
            requestAnimationFrame(loop);
        });
    }
}
